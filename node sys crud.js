// ==========================================
// COMPLETE NODE.JS CRUD SYSTEM
// Using Express + MySQL
// ==========================================

// 1. INSTALL THESE PACKAGES FIRST
// npm init -y
// npm install express mysql2 body-parser cors nodemon

// ==========================================
// FILE: server.js
// ==========================================

const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ==========================================
// DATABASE CONNECTION
// ==========================================

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "school_system"
});

// Connect Database
db.connect((err) => {
    if (err) {
        console.log("Database Connection Failed");
        console.log(err);
    } else {
        console.log("MySQL Connected Successfully");
    }
});

// ==========================================
// CREATE TABLE AUTOMATICALLY
// ==========================================

const createTable = `
CREATE TABLE IF NOT EXISTS students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fullname VARCHAR(100),
    email VARCHAR(100),
    course VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
`;

db.query(createTable, (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log("Students Table Ready");
    }
});

// ==========================================
// HOME ROUTE
// ==========================================

app.get("/", (req, res) => {
    res.send("NODE JS CRUD SYSTEM RUNNING");
});

// ==========================================
// CREATE STUDENT
// ==========================================

app.post("/students", (req, res) => {

    const { fullname, email, course } = req.body;

    const sql = `
    INSERT INTO students(fullname,email,course)
    VALUES(?,?,?)
    `;

    db.query(sql, [fullname, email, course], (err, result) => {

        if (err) {
            res.status(500).json({
                message: "Error Creating Student",
                error: err
            });
        } else {
            res.json({
                message: "Student Created Successfully",
                data: result
            });
        }

    });

});

// ==========================================
// READ ALL STUDENTS
// ==========================================

app.get("/students", (req, res) => {

    const sql = "SELECT * FROM students";

    db.query(sql, (err, result) => {

        if (err) {
            res.status(500).json({
                message: "Error Fetching Students",
                error: err
            });
        } else {
            res.json(result);
        }

    });

});

// ==========================================
// READ SINGLE STUDENT
// ==========================================

app.get("/students/:id", (req, res) => {

    const id = req.params.id;

    const sql = "SELECT * FROM students WHERE id = ?";

    db.query(sql, [id], (err, result) => {

        if (err) {
            res.status(500).json({
                message: "Error Fetching Student",
                error: err
            });
        } else {
            res.json(result);
        }

    });

});

// ==========================================
// UPDATE STUDENT
// ==========================================

app.put("/students/:id", (req, res) => {

    const id = req.params.id;

    const { fullname, email, course } = req.body;

    const sql = `
    UPDATE students
    SET fullname=?, email=?, course=?
    WHERE id=?
    `;

    db.query(sql, [fullname, email, course, id], (err, result) => {

        if (err) {
            res.status(500).json({
                message: "Error Updating Student",
                error: err
            });
        } else {
            res.json({
                message: "Student Updated Successfully",
                data: result
            });
        }

    });

});

// ==========================================
// DELETE STUDENT
// ==========================================

app.delete("/students/:id", (req, res) => {

    const id = req.params.id;

    const sql = "DELETE FROM students WHERE id=?";

    db.query(sql, [id], (err, result) => {

        if (err) {
            res.status(500).json({
                message: "Error Deleting Student",
                error: err
            });
        } else {
            res.json({
                message: "Student Deleted Successfully",
                data: result
            });
        }

    });

});

// ==========================================
// START SERVER
// ==========================================

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server Running On Port ${PORT}`);
});