const request = require("supertest");
const { app } = require("../app");

describe("API Gateway", () => {

    describe("CORS Headers", () => {
        it("harus return header CORS yang benar", async () => {
            const res = await request(app).get("/");

            expect(res.headers["access-control-allow-origin"]).toBe("*");
            expect(res.headers["access-control-allow-methods"]).toContain("GET");
            expect(res.headers["access-control-allow-methods"]).toContain("POST");
        });

        it("harus respond 200 untuk OPTIONS preflight request", async () => {
            const res = await request(app).options("/users");

            expect(res.statusCode).toBe(200);
        });
    });

    describe("Route /users", () => {
        it("harus menerima request ke /users", async () => {
            const res = await request(app).get("/users");

            expect(res.statusCode).toBe(200);
        });
    });

    describe("Route /courses", () => {
        it("harus menerima request ke /courses", async () => {
            const res = await request(app).get("/courses");

            expect(res.statusCode).toBe(200);
        });
    });

    describe("Route /krs", () => {
        it("harus menerima request ke /krs", async () => {
            const res = await request(app).get("/krs");

            expect(res.statusCode).toBe(200);
        });
    });
});
