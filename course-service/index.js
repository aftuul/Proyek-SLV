const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createPool({
    host: "mysql-course",
    user: "root",
    password: "root",
    database: "course_db",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Auto create table and seed data
const initDb = () => {
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS courses (
            id INT AUTO_INCREMENT PRIMARY KEY,
            kode_mk VARCHAR(50) NOT NULL UNIQUE,
            nama_mk VARCHAR(255) NOT NULL,
            sks INT NOT NULL
        )
    `;
    db.query(createTableQuery, (err) => {
        if (err) {
            console.error("Gagal membuat tabel courses, mencoba lagi dalam 5 detik...", err);
            setTimeout(initDb, 5000);
            return;
        }
        console.log("Tabel courses siap.");

        db.query("SELECT COUNT(*) as count FROM courses", (err, result) => {
            if (err) return;
            if (result[0].count === 0) {
                const seedQuery = `
                    INSERT INTO courses (kode_mk, nama_mk, sks) VALUES 
                    ('IF101', 'Dasar Pemrograman', 3),
                    ('IF202', 'Struktur Data & Algoritma', 4),
                    ('IF303', 'Basis Data', 3),
                    ('IF404', 'Rekayasa Perangkat Lunak', 3)
                `;
                db.query(seedQuery, (err) => {
                    if (err) console.error("Gagal melakukan seeding courses:", err);
                    else console.log("Seeding courses berhasil.");
                });
            }
        });
    });
};

initDb();

app.get("/", (req,res)=>{

    db.query(
        "SELECT * FROM courses",
        (err,result)=>{

            if(err){
                return res.status(500).json(err);
            }

            res.json(result);
        }
    );
});

app.post("/",(req,res)=>{

    const {kode_mk,nama_mk,sks} = req.body;

    db.query(
        "INSERT INTO courses(kode_mk,nama_mk,sks) VALUES(?,?,?)",
        [kode_mk,nama_mk,sks],
        (err,result)=>{

            if(err){
                return res.status(500).json(err);
            }

            res.json({
                message:"Course berhasil ditambahkan"
            });
        }
    );
});

app.listen(3002,()=>{
    console.log("Course Service berjalan");
});