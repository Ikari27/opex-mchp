const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const path = require("path");
const session = require("express-session");

const app = express();

app.use(session({
    secret: "opex-secret-key",
    resave: false,
    saveUninitialized: false
}));

app.use(bodyParser.urlencoded({ extended: true }));
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

app.post("/register", (req, res) => {

    const { firstname, lastname, badgeid, email, password } = req.body;

    const sql =
        "INSERT INTO users (firstname, lastname, badgeid, email, password) VALUES (?, ?, ?, ?, ?)";

    db.query(
        sql,
        [firstname, lastname, badgeid, email, password],
        (err, result) => {

            if (err) {
                console.error(err);
                return res.send("Registration failed");
            }

            // Auto-login
            req.session.user = {
                id: result.insertId,
                firstname,
                lastname,
                email
            };

            res.redirect("/index.html");
        }
    );
});

app.get("/api/user", (req, res) => {

    if (!req.session.user) {
        return res.json({ loggedIn: false });
    }

    res.json({
        loggedIn: true,
        user: req.session.user
    });
});

//logout

app.get("/logout", (req, res) => {

    req.session.destroy(() => {
        res.redirect("/index.html");
    });

});

app.listen(5500, () => {
    console.log("Server running on port 5500");
});