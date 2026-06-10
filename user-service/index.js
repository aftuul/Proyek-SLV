const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createPool({
    host: "mysql-user",
    user: "root",
    password: "root",
    database: "user_db",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Auto create table and seed data
const initDb = () => {
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            nama VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            role VARCHAR(50) NOT NULL
        )
    `;
    db.query(createTableQuery, (err) => {
        if (err) {
            console.error("Gagal membuat tabel users, mencoba lagi dalam 5 detik...", err);
            setTimeout(initDb, 5000);
            return;
        }
        console.log("Tabel users siap.");

        db.query("SELECT COUNT(*) as count FROM users", (err, result) => {
            if (err) return;
            if (result[0].count === 0) {
                const seedQuery = `
                    INSERT INTO users (nama, email, password, role) VALUES 
                    ('Ahmad Afif', 'ahmad.afif@email.com', 'password123', 'Mahasiswa'),
                    ('Fadhila Shofa', 'fadhila.shofa@email.com', 'password123', 'Mahasiswa'),
                    ('Dr. Ir. Budi Santoso', 'budi.santoso@email.com', 'password123', 'Dosen'),
                    ('Admin Portal', 'admin@email.com', 'admin123', 'Admin')
                `;
                db.query(seedQuery, (err) => {
                    if (err) console.error("Gagal melakukan seeding users:", err);
                    else console.log("Seeding users berhasil.");
                });
            }
        });
    });
};

initDb();

app.get("/", (req,res)=>{

    db.query(
        "SELECT * FROM users",
        (err,result)=>{

            if(err){
                return res.status(500).json(err);
            }

            res.json(result);
        }
    );

});

app.post("/", (req,res)=>{

    const {nama,email,password,role} = req.body;

    db.query(
        "INSERT INTO users(nama,email,password,role) VALUES(?,?,?,?)",
        [nama,email,password,role],
        (err,result)=>{

            if(err){
                return res.status(500).json(err);
            }

            res.json({
                message:"User berhasil ditambahkan"
            });
        }
    );

});

app.listen(3001,()=>{
    console.log("User Service berjalan");
});