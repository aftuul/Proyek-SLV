const request = require("supertest");
const { app, setDb } = require("../app");

const mockDb = { query: jest.fn() };

beforeAll(() => { setDb(mockDb); });
afterEach(() => { jest.clearAllMocks(); });

describe("KRS Service", () => {

    describe("GET /", () => {
        it("harus return daftar semua data KRS", async () => {
            const fakeKrs = [
                { id: 1, student_id: 1, course_id: 1 },
                { id: 2, student_id: 1, course_id: 3 },
                { id: 3, student_id: 2, course_id: 2 },
            ];

            mockDb.query.mockImplementation((sql, cb) => cb(null, fakeKrs));

            const res = await request(app).get("/");

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveLength(3);
            expect(res.body[0]).toHaveProperty("student_id", 1);
        });

        it("harus return 500 kalau database error", async () => {
            mockDb.query.mockImplementation((sql, cb) => cb({ message: "DB Error" }, null));

            const res = await request(app).get("/");

            expect(res.statusCode).toBe(500);
        });
    });

    describe("POST /", () => {
        it("harus berhasil daftarkan mahasiswa ke mata kuliah", async () => {
            mockDb.query.mockImplementation((sql, params, cb) => cb(null, { insertId: 4 }));

            const res = await request(app).post("/").send({
                student_id: 2,
                course_id: 4,
            });

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty("message", "KRS berhasil ditambahkan");
        });

        it("harus return 500 kalau insert gagal", async () => {
            mockDb.query.mockImplementation((sql, params, cb) =>
                cb({ message: "Insert failed" }, null)
            );

            const res = await request(app).post("/").send({
                student_id: 99,
                course_id: 99,
            });

            expect(res.statusCode).toBe(500);
        });
    });
});
