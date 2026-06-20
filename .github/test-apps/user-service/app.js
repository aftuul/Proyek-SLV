const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// db disuntik dari luar (dependency injection) biar bisa di-mock saat test
let db;
const setDb = (database) => { db = database; };

app.get("/", (req, res) => {
    db.query("SELECT * FROM users", (err, result) => {
        if (err) return res.status(500).json(err);
        res.json(result);
    });
});

app.post("/", (req, res) => {
    const { nama, email, password, role } = req.body;
    db.query(
        "INSERT INTO users(nama,email,password,role) VALUES(?,?,?,?)",
        [nama, email, password, role],
        (err, result) => {
            if (err) return res.status(500).json(err);
            res.json({ message: "User berhasil ditambahkan" });
        }
    );
});

module.exports = { app, setDb };
