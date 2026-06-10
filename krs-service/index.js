const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createPool({
    host: "mysql-krs",
    user: "root",
    password: "root",
    database: "krs_db",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Auto create table and seed data
const initDb = () => {
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS krs (
            id INT AUTO_INCREMENT PRIMARY KEY,
            student_id INT NOT NULL,
            course_id INT NOT NULL
        )
    `;
    db.query(createTableQuery, (err) => {
        if (err) {
            console.error("Gagal membuat tabel krs, mencoba lagi dalam 5 detik...", err);
            setTimeout(initDb, 5000);
            return;
        }
        console.log("Tabel krs siap.");

        db.query("SELECT COUNT(*) as count FROM krs", (err, result) => {
            if (err) return;
            if (result[0].count === 0) {
                const seedQuery = `
                    INSERT INTO krs (student_id, course_id) VALUES 
                    (1, 1),
                    (1, 3),
                    (2, 2)
                `;
                db.query(seedQuery, (err) => {
                    if (err) console.error("Gagal melakukan seeding krs:", err);
                    else console.log("Seeding krs berhasil.");
                });
            }
        });
    });
};

initDb();

app.get("/", (req,res)=>{

    db.query(
        "SELECT * FROM krs",
        (err,result)=>{

            if(err){
                return res.status(500).json(err);
            }

            res.json(result);
        }
    );
});

app.post("/",(req,res)=>{

    const {student_id,course_id} = req.body;

    db.query(
        "INSERT INTO krs(student_id,course_id) VALUES(?,?)",
        [student_id,course_id],
        (err,result)=>{

            if(err){
                return res.status(500).json(err);
            }

            res.json({
                message:"KRS berhasil ditambahkan"
            });
        }
    );
});

app.listen(3003,()=>{
    console.log("KRS Service berjalan");
});