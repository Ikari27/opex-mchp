const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const path = require("path");
const session = require("express-session");
const bcrypt = require('bcrypt');
const multer = require('multer');
const fs = require('fs');

const app = express();

app.use(session({
    secret: "opex-secret-key",
    resave: false,
    saveUninitialized: false
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// PROTECT ADMIN PAGE
app.get("/admin.html", (req, res) => {
    if (!req.session.user || req.session.user.role !== 'admin') {
        return res.send("Access denied. Admins only."); 
    }
    res.sendFile(path.join(__dirname, "../admin.html"));
});

// Serve static files
app.use(express.static(path.join(__dirname, "..")));

const db = mysql.createConnection({
    host: "localhost",
    user: "admin",
    port: 3306,
    password: "Administrator123!!!",
    database: "opex_db"
});

db.connect(err => {
    if (err) throw err;
    console.log("MySQL Connected!");
});


// ==========================================
// USER & AUTH ROUTES
// ==========================================

app.post("/register", async (req, res) => {
    const previousPage = req.get('referer') || "/index.html";
    const { firstname, lastname, badgeid, email, password } = req.body;

    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const sql = "INSERT INTO users (firstname, lastname, badgeid, email, password, role) VALUES (?, ?, ?, ?, ?, 'user')";

        db.query(sql, [firstname, lastname, badgeid, email, hashedPassword], (err, result) => {
            if (err) {
                console.error(err);
                return res.send("Registration failed");
            }
            res.redirect(previousPage);
        });
    } catch (error) {
        console.error(error);
        res.send("Server error during registration");
    }
});

app.post("/login", (req, res) => {
    const { badgeid, password } = req.body;
    const sql = "SELECT * FROM users WHERE badgeid = ?";
    
    db.query(sql, [badgeid], async (err, results) => {
        if (err || results.length === 0) {
            return res.status(400).json({ success: false, error: "Invalid Badge ID or Password" });
        }

        const user = results[0];
        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            return res.status(400).json({ success: false, error: "Invalid Badge ID or Password" });
        }

        req.session.user = {
            id: user.id,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            role: user.role
        };

        const redirectUrl = (user.role === 'admin') ? "/admin.html" : "/index.html";
        res.json({ success: true, redirectUrl: redirectUrl });
    });
});

app.get("/api/user", (req, res) => {
    if (!req.session.user) {
        return res.json({ loggedIn: false });
    }
    res.json({ loggedIn: true, user: req.session.user });
});

app.get("/api/users", (req, res) => {
    if (!req.session.user || req.session.user.role !== 'admin') {
        return res.status(401).json({ error: "Unauthorized" });
    }
    const sql = "SELECT id, firstname, lastname, nickname, badgeid, email, site, certification, department, role, trainer_coach FROM users ORDER BY id DESC";
    db.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Database error" });
        }
        res.json(results);
    });
});

app.get("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) console.error("Error destroying session:", err);
        res.redirect("/index.html");
    });
});

app.listen(5500, () => {
    console.log("Server running on port 5500");
});

// ==========================================
// FULL-PAGE WEB CONTENT API ROUTES
// ==========================================

app.get("/api/all-content", (req, res) => {
    const sql = "SELECT id, content FROM web_content";
    db.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Database error" });
        }
        const contentMap = {};
        results.forEach(row => {
            contentMap[row.id] = row.content;
        });
        res.json(contentMap);
    });
});

app.post("/api/content/update", (req, res) => {
    if (!req.session.user || req.session.user.role !== 'admin') {
        return res.status(401).json({ success: false, error: "Unauthorized access" });
    }

    const { id, content } = req.body;
    const sql = "UPDATE web_content SET content = ? WHERE id = ?";

    db.query(sql, [content, id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, error: "Database update failed" });
        }
        res.json({ success: true, message: "Content updated successfully!" });
    });
});

app.post("/api/content/create-specific", (req, res) => {
    if (!req.session.user || req.session.user.role !== 'admin') {
        return res.status(401).json({ success: false, error: "Unauthorized" });
    }

    const { id, content } = req.body;
    const sql = `
        INSERT INTO web_content (id, content) 
        VALUES (?, ?) 
        ON DUPLICATE KEY UPDATE content = VALUES(content)
    `;

    db.query(sql, [id, content], (err, result) => {
        if (err) {
            console.error("Database Insert Error:", err);
            return res.status(500).json({ success: false, error: "Database error" });
        }
        res.json({ success: true, message: `Row ${id} created/updated successfully!` });
    });
});

// ====================
// IMAGE/VIDEO EDITOR
// ====================

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "../assets/uploads"));
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

app.post("/api/content/upload-image", upload.single('imageFile'), (req, res) => {
    if (!req.session.user || req.session.user.role !== 'admin') {
        return res.status(401).json({ success: false, error: "Unauthorized" });
    }

    if (!req.file) {
        return res.status(400).json({ success: false, error: "No file uploaded" });
    }

    const fileId = req.body.id;
    const newFilePath = `./assets/uploads/${req.file.filename}`;

    const selectSql = "SELECT content FROM web_content WHERE id = ?";
    db.query(selectSql, [fileId], (err, results) => {
        if (!err && results.length > 0) {
            const oldPath = results[0].content;
            if (oldPath && oldPath.startsWith('./assets/uploads/')) {
                const fullOldPath = path.join(__dirname, "../", oldPath);
                if (fs.existsSync(fullOldPath)) {
                    fs.unlink(fullOldPath, () => {});
                }
            }
        }

        const upsertSql = `
            INSERT INTO web_content (id, content) 
            VALUES (?, ?) 
            ON DUPLICATE KEY UPDATE content = VALUES(content)
        `;

        db.query(upsertSql, [fileId, newFilePath], (dbErr) => {
            if (dbErr) {
                console.error("Database Error:", dbErr);
                return res.status(500).json({ success: false, error: "Database error" });
            }
            res.json({ success: true, filePath: newFilePath });
        });
    });
});

// =============
// PROFILE USER
// =============

app.get("/api/users/:id", (req, res) => {
    if (!req.session.user || req.session.user.role !== 'admin') {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const userId = req.params.id;
    const sql = "SELECT id, firstname, lastname, nickname, badgeid, email, role, trainer_coach, position, department, certification, profile_picture, site FROM users WHERE id = ?";
    
    db.query(sql, [userId], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Database error" });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json(results[0]);
    });
});

app.put("/api/users/:id", upload.single('imageFile'), (req, res) => {
    if (!req.session.user || req.session.user.role !== 'admin') {
        return res.status(401).json({ success: false, error: "Unauthorized" });
    }

    const userId = req.params.id;
    const { firstname, lastname, nickname, badgeid, email, position, department, certification, site, role, trainer_coach } = req.body;

    let profilePicturePath = null;
    if (req.file) {
        profilePicturePath = `./assets/uploads/${req.file.filename}`;

        const selectOldSql = "SELECT profile_picture FROM users WHERE id = ?";
        db.query(selectOldSql, [userId], (err, results) => {
            if (!err && results.length > 0 && results[0].profile_picture) {
                const oldPath = path.join(__dirname, "../", results[0].profile_picture);
                if (fs.existsSync(oldPath)) {
                    fs.unlink(oldPath, () => {});
                }
            }
        });
    }

    let sql = `
        UPDATE users 
        SET firstname = ?, lastname = ?, nickname = ?, badgeid = ?, email = ?, position = ?, department = ?, certification = ?, site = ?, role = ?, trainer_coach = ?
    `;
    let params = [firstname, lastname, nickname, badgeid, email, position, department, certification, site, role, trainer_coach];

    if (profilePicturePath) {
        sql += `, profile_picture = ?`;
        params.push(profilePicturePath);
    }

    sql += ` WHERE id = ?`;
    params.push(userId);

    db.query(sql, params, (err, result) => {
        if (err) {
            console.error("Database update error:", err);
            return res.status(500).json({ success: false, error: "Database update failed" });
        }
        res.json({ success: true, message: "Profile updated successfully!", profile_picture: profilePicturePath });
    });
});

// ==========================================
// PROJECT ROUTES
// ==========================================

app.get("/api/projects", (req, res) => {
    if (!req.session.user || req.session.user.role !== 'admin') {
        return res.status(401).json({ error: "Unauthorized" });
    }
    
    const sql = "SELECT id, project_owner, project_title, project_impact, project_savings, financial_impact, quality_improved, created_at, belt_certification FROM projects ORDER BY id DESC";
    
    db.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Database error" });
        }
        res.json(results);
    });
});

// POST / Create a new project (Admins only) - Cleaned up duplicate
app.post("/api/projects", (req, res) => {
    if (!req.session.user || req.session.user.role !== 'admin') {
        return res.status(401).json({ success: false, error: "Unauthorized" });
    }

    const { 
        project_owner, 
        project_title, 
        project_impact, 
        project_savings, 
        financial_impact, 
        quality_improved, 
        belt_certification 
    } = req.body;

    const sql = `
        INSERT INTO projects 
        (project_owner, project_title, project_impact, project_savings, financial_impact, quality_improved, belt_certification) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
        project_owner || null, 
        project_title || null, 
        project_impact || null, 
        project_savings || 0, 
        financial_impact || null, 
        quality_improved || null, 
        belt_certification || null
    ];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error("Database insert error:", err);
            return res.status(500).json({ success: false, error: "Database error while saving project" });
        }
        res.status(201).json({ success: true, message: "Project created successfully", projectId: result.insertId });
    });
});

app.get("/api/projects/:id", (req, res) => {
    if (!req.session.user || req.session.user.role !== 'admin') {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const projectId = req.params.id;

    const projectSql = "SELECT * FROM projects WHERE id = ?";
    db.query(projectSql, [projectId], (err, projectResults) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Database error" });
        }
        if (projectResults.length === 0) {
            return res.status(404).json({ error: "Project not found" });
        }

        const project = projectResults[0];
        const ownerName = project.project_owner || "";

        const userSql = "SELECT profile_picture, firstname, certification, department FROM users WHERE CONCAT(firstname, ' ', lastname) LIKE ? OR firstname LIKE ? LIMIT 1";
        
        db.query(userSql, [`%${ownerName}%`, `%${ownerName}%`], (userErr, userResults) => {
            let userInfo = { profile_picture: '', firstname: '', certification: 'None', department: 'N/A' };
            
            if (!userErr && userResults.length > 0) {
                userInfo.profile_picture = userResults[0].profile_picture || '';
                userInfo.firstname = userResults[0].firstname || '';
                userInfo.certification = userResults[0].certification || 'None';
                userInfo.department = userResults[0].department || 'N/A';
            }

            res.json({
                ...project,
                profile_picture: userInfo.profile_picture,
                firstname: userInfo.firstname,
                certification: userInfo.certification,
                department: userInfo.department
            });
        });
    });
});

app.put("/api/projects/:id", (req, res) => {
    if (!req.session.user || req.session.user.role !== 'admin') {
        return res.status(401).json({ success: false, error: "Unauthorized" });
    }

    const projectId = req.params.id;
    
    // Fallback to an empty object if req.body is undefined
    const body = req.body || {};
    const project_owner = body.project_owner;
    const project_title = body.project_title;
    const project_impact = body.project_impact;
    const project_savings = body.project_savings;
    const quality_improved = body.quality_improved;

    const sql = `
        UPDATE projects 
        SET project_owner = ?, project_title = ?, project_impact = ?, project_savings = ?, quality_improved = ?
        WHERE id = ?
    `;
    
    const params = [
        project_owner || null, 
        project_title || null, 
        project_impact || null, 
        project_savings || 0, 
        quality_improved || null,
        projectId
    ];

    db.query(sql, params, (err, result) => {
        if (err) {
            console.error("Database project update error:", err);
            return res.status(500).json({ success: false, error: "Database update failed" });
        }
        res.json({ success: true, message: "Project updated successfully!" });
    });
});

// =============================
// GREENBELTS & BLACKBELTS API
// =============================

app.get("/api/greenbelts", (req, res) => {
    const sql = `
        SELECT id, firstname, lastname, nickname, position, department, certification, profile_picture, site 
        FROM users 
        WHERE certification LIKE '%Green Belt%'
    `;
    db.query(sql, (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Database error" });
        }
        res.json(results);
    });
});

app.get("/api/blackbelts", (req, res) => {
    const sql = `
        SELECT id, firstname, lastname, nickname, position, department, certification, profile_picture, site 
        FROM users 
        WHERE certification LIKE '%Black Belt%'
    `;
    db.query(sql, (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Database error" });
        }
        res.json(results);
    });
});

// ==========================================
// PUBLIC USER PROFILE & PROJECTS API
// ==========================================
app.get("/api/public-profile/:id", (req, res) => {
    const userId = req.params.id;

    const userSql = "SELECT id, firstname, lastname, nickname, badgeid, email, position, department, certification, profile_picture, site, role FROM users WHERE id = ?";
    
    db.query(userSql, [userId], (err, userResults) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Database error" });
        }
        if (userResults.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        const user = userResults[0];
        const fullName = `${user.firstname || ''} ${user.lastname || ''}`.trim();

        const projectsSql = "SELECT * FROM projects WHERE project_owner LIKE ? ORDER BY id ASC";
        
        db.query(projectsSql, [`%${fullName}%`], (projErr, projResults) => {
            if (projErr) {
                console.error("Database error:", projErr);
                return res.status(500).json({ error: "Database error" });
            }

            let totalSavings = 0;
            let totalQuality = 0;
            projResults.forEach(project => {
                totalSavings += parseFloat(project.project_savings || 0);
                totalQuality += parseInt(project.quality_improved || 0);
            });

            res.json({
                user: user,
                projects: projResults,
                totals: {
                    savings: totalSavings,
                    quality: totalQuality
                }
            });
        });
    });
});

// =============================
// TRAINERS & COACH API
// =============================

app.get("/api/trainers", (req, res) => {
    const sql = `
        SELECT id, firstname, lastname, nickname, position, department, certification, profile_picture, site 
        FROM users 
        WHERE trainer_coach LIKE '%Trainer%'
    `;
    db.query(sql, (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Database error" });
        }
        res.json(results);
    });
});

app.get("/api/coaches", (req, res) => {
    const sql = `
        SELECT id, firstname, lastname, nickname, position, department, certification, profile_picture, site 
        FROM users 
        WHERE trainer_coach LIKE '%Coach%'
    `;
    db.query(sql, (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Database error" });
        }
        res.json(results);
    });
});