const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const path = require("path");
const session = require("express-session");
const bcrypt = require('bcrypt');

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
    user: "root",
    port: 3306,
    password: "IkariRyoshi07272001",
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
            req.session.user = { id: result.insertId, firstname, lastname, email, role: 'user' };
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
            // Return JSON instead of full-page text
            return res.status(400).json({ success: false, error: "Invalid Badge ID or Password" });
        }

        const user = results[0];
        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            // Return JSON instead of full-page text
            return res.status(400).json({ success: false, error: "Invalid Badge ID or Password" });
        }

        req.session.user = {
            id: user.id,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            role: user.role
        };

        // Send a success response with the redirect URL instead of doing res.redirect()
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
    const sql = "SELECT id, firstname, lastname, badgeid, email, site, certification, department, role FROM users ORDER BY id DESC";
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

// Get ALL content rows for the page at once
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

// Update a specific row ID (Admins only)
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

// Auto-Create or Update specific row ID from HTML data-id
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
// image/video editor
// ====================

const multer = require('multer');

// Configure storage for uploaded images
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "../assets/uploads"));
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

const fs = require('fs');

// Video / Image Universal Upload Route (Admins Only)
app.post("/api/content/upload-image", upload.single('imageFile'), (req, res) => {
    if (!req.session.user || req.session.user.role !== 'admin') {
        return res.status(401).json({ success: false, error: "Unauthorized" });
    }

    if (!req.file) {
        return res.status(400).json({ success: false, error: "No file uploaded" });
    }

    const fileId = req.body.id;
    const newFilePath = `./assets/uploads/${req.file.filename}`;

    // 1. Delete old file from server if it exists to save space
    const selectSql = "SELECT content FROM web_content WHERE id = ?";
    db.query(selectSql, [fileId], (err, results) => {
        if (!err && results.length > 0) {
            const oldPath = results[0].content;
            if (oldPath && oldPath.startsWith('./assets/uploads/')) {
                const fullOldPath = path.join(__dirname, "../", oldPath);
                if (fs.existsSync(fullOldPath)) {
                    fs.unlink(fullOldPath, () => {}); // Clean up old file
                }
            }
        }

        // 2. Save new file path to database
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
// profile user
// =============

// GET a specific user's complete profile by database ID (Admins only)
app.get("/api/users/:id", (req, res) => {
    if (!req.session.user || req.session.user.role !== 'admin') {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const userId = req.params.id;
    const sql = "SELECT id, firstname, lastname, badgeid, email, role, position, department, certification, profile_picture, site FROM users WHERE id = ?";
    
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

// UPDATE a specific user's profile and profile picture in MySQL
app.put("/api/users/:id", upload.single('imageFile'), (req, res) => {
    if (!req.session.user || req.session.user.role !== 'admin') {
        return res.status(401).json({ success: false, error: "Unauthorized" });
    }

    const userId = req.params.id;
    const { firstname, lastname, badgeid, email, position, department, certification, site, role } = req.body;

    // Check if a new profile image was uploaded
    let profilePicturePath = null;
    if (req.file) {
        profilePicturePath = `./assets/uploads/${req.file.filename}`;

        // Optional: Remove old profile picture file from disk if it exists
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

    // Build SQL query dynamically based on whether an image was uploaded
    let sql = `
        UPDATE users 
        SET firstname = ?, lastname = ?, badgeid = ?, email = ?, position = ?, department = ?, certification = ?, site = ?, role = ?
    `;
    let params = [firstname, lastname, badgeid, email, position, department, certification, site, role];

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