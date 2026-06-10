const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();

// Custom CORS middleware to allow frontend requests
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    if (req.method === "OPTIONS") {
        return res.sendStatus(200);
    }
    next();
});

app.use(
    "/users",
    createProxyMiddleware({
        target:"http://user-service:3001",
        changeOrigin:true
    })
);

app.use(
    "/courses",
    createProxyMiddleware({
        target:"http://course-service:3002",
        changeOrigin:true
    })
);

app.use(
    "/krs",
    createProxyMiddleware({
        target:"http://krs-service:3003",
        changeOrigin:true
    })
);

app.listen(5000, () => {
    console.log("API Gateway berjalan di port 5000");
});