const express = require("express");

const app = express();

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    if (req.method === "OPTIONS") {
        return res.sendStatus(200);
    }
    next();
});

// Health check endpoint
app.get("/", (req, res) => {
    res.json({ message: "API Gateway berjalan", status: "ok" });
});

// Route definitions (tanpa proxy saat test)
app.use("/users", (req, res) => res.json({ proxied: "user-service" }));
app.use("/courses", (req, res) => res.json({ proxied: "course-service" }));
app.use("/krs", (req, res) => res.json({ proxied: "krs-service" }));

module.exports = { app };
