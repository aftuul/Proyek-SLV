const request = require("supertest");
const { app, setDb } = require("../app");

const mockDb = { query: jest.fn() };

beforeAll(() => { setDb(mockDb); });
afterEach(() => { jest.clearAllMocks(); });

describe("Course Service", () => {

    describe("GET /", () => {
        it("harus return daftar semua mata kuliah", async () => {
            const fakeCourses = [
                { id: 1, kode_mk: "IF101", nama_mk: "Dasar Pemrograman", sks: 3 },
                { id: 2, kode_mk: "IF202", nama_mk: "Struktur Data & Algoritma", sks: 4 },
            ];

            mockDb.query.mockImplementation((sql, cb) => cb(null, fakeCourses));

            const res = await request(app).get("/");

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveLength(2);
            expect(res.body[0]).toHaveProperty("kode_mk", "IF101");
            expect(res.body[1]).toHaveProperty("sks", 4);
        });

        it("harus return 500 kalau database error", async () => {
            mockDb.query.mockImplementation((sql, cb) => cb({ message: "DB Error" }, null));

            const res = await request(app).get("/");

            expect(res.statusCode).toBe(500);
        });
    });

    describe("POST /", () => {
        it("harus berhasil tambah mata kuliah baru", async () => {
            mockDb.query.mockImplementation((sql, params, cb) => cb(null, { insertId: 5 }));

            const res = await request(app).post("/").send({
                kode_mk: "IF505",
                nama_mk: "Keamanan Jaringan",
                sks: 3,
            });

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty("message", "Course berhasil ditambahkan");
        });

        it("harus return 500 kalau kode_mk duplikat", async () => {
            mockDb.query.mockImplementation((sql, params, cb) =>
                cb({ code: "ER_DUP_ENTRY" }, null)
            );

            const res = await request(app).post("/").send({
                kode_mk: "IF101",
                nama_mk: "Duplikat",
                sks: 2,
            });

            expect(res.statusCode).toBe(500);
        });
    });
});
