const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const path = require("path");
const session = require("express-session");
const bcrypt = require('bcrypt'); // or bcryptjs if you are using that package

const app = express();

app.use(session({
    secret: "opex-secret-key",
    resave: false,
    saveUninitialized: false
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // <--- Add this line to parse incoming JSON data from fetch

// PROTECT ADMIN PAGE: Check if logged in and is an admin before serving the static file
app.get("/admin.html", (req, res) => {
    if (!req.session.user || req.session.user.role !== 'admin') {
        return res.send("Access denied. Admins only."); 
        // Or you can use: return res.redirect("/index.html");
    }
    res.sendFile(path.join(__dirname, "../admin.html"));
});

// Serve all other static files normally
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

// Register Route
app.post("/register", async (req, res) => {
    const previousPage = req.get('referer') || "/index.html";
    const { firstname, lastname, badgeid, email, password } = req.body;

    try {
        // Hash the password before saving
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const sql = "INSERT INTO users (firstname, lastname, badgeid, email, password, role) VALUES (?, ?, ?, ?, ?, 'user')";

        db.query(sql, [firstname, lastname, badgeid, email, hashedPassword], (err, result) => {
            if (err) {
                console.error(err);
                return res.send("Registration failed");
            }

            req.session.user = {
                id: result.insertId,
                firstname,
                lastname,
                email,
                role: 'user'
            };

            res.redirect(previousPage);
        });
    } catch (error) {
        console.error(error);
        res.send("Server error during registration");
    }
});

// Login Route (Allows both users and Admins to log in)
app.post("/login", (req, res) => {
    const { badgeid, password } = req.body;

    // Fetch user by badgeid only (we verify password in code using bcrypt)
    const sql = "SELECT * FROM users WHERE badgeid = ?";
    
    db.query(sql, [badgeid], async (err, results) => {
        if (err || results.length === 0) {
            return res.send("Invalid Badge ID or Password");
        }

        const user = results[0];

        // Compare the submitted password with the stored hash
        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            return res.send("Invalid Badge ID or Password");
        }

        // Save session data for the user
        req.session.user = {
            id: user.id,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            role: user.role
        };

        if (user.role === 'admin') {
            res.redirect("/admin.html");
        } else {
            res.redirect("/index.html");
        }
    });
});

// Update User API Route (Admins only)
app.put("/api/users/:badgeid", (req, res) => {
    // 1. Check if logged in and is admin
    if (!req.session.user || req.session.user.role !== 'admin') {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const targetBadgeId = req.params.badgeid;
    const { firstname, lastname, email, role } = req.body;

    // 2. Update query in database
    const sql = "UPDATE users SET firstname = ?, lastname = ?, email = ?, role = ? WHERE badgeid = ?";

    db.query(sql, [firstname, lastname, email, role, targetBadgeId], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Failed to update user in database" });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json({ success: true, message: "User updated successfully" });
    });
});

// User Session API Route
app.get("/api/user", (req, res) => {
    if (!req.session.user) {
        return res.json({ loggedIn: false });
    }

    res.json({
        loggedIn: true,
        user: req.session.user
    });
});

// Logout Route
app.get("/logout", (req, res) => {
    const previousPage = req.get('referer') || "/index.html";
    
    req.session.destroy((err) => {
        if (err) {
            console.error("Error destroying session:", err);
        }
        res.redirect("/index.html");
    });
});

app.listen(5500, () => {
    console.log("Server running on port 5500");
});

// Get all users API Route (Admins only)
app.get("/api/users", (req, res) => {
    // Check if user is logged in and is an admin
    if (!req.session.user || req.session.user.role !== 'admin') {
        return res.status(401).json({ error: "Unauthorized" });
    }

    // Select user data (Notice we are NOT selecting the password column)
    const sql = "SELECT id, firstname, lastname, badgeid, email, role FROM users ORDER BY id DESC";

    db.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Database error" });
        }
        res.json(results); // Send users data as JSON
    });
});