const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

let db;
const setDb = (database) => { db = database; };

app.get("/", (req, res) => {
    db.query("SELECT * FROM courses", (err, result) => {
        if (err) return res.status(500).json(err);
        res.json(result);
    });
});

app.post("/", (req, res) => {
    const { kode_mk, nama_mk, sks } = req.body;
    db.query(
        "INSERT INTO courses(kode_mk,nama_mk,sks) VALUES(?,?,?)",
        [kode_mk, nama_mk, sks],
        (err, result) => {
            if (err) return res.status(500).json(err);
            res.json({ message: "Course berhasil ditambahkan" });
        }
    );
});

module.exports = { app, setDb };
