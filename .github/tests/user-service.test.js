const request = require("supertest");
const { app, setDb } = require("../app");

// Mock database — tidak butuh MySQL beneran
const mockDb = {
    query: jest.fn(),
};

beforeAll(() => {
    setDb(mockDb);
});

afterEach(() => {
    jest.clearAllMocks();
});

describe("User Service", () => {

    describe("GET /", () => {
        it("harus return daftar semua user", async () => {
            const fakeUsers = [
                { id: 1, nama: "Ahmad Afif", email: "ahmad@email.com", role: "Mahasiswa" },
                { id: 2, nama: "Fadhila Shofa", email: "fadhila@email.com", role: "Mahasiswa" },
            ];

            mockDb.query.mockImplementation((sql, cb) => cb(null, fakeUsers));

            const res = await request(app).get("/");

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveLength(2);
            expect(res.body[0]).toHaveProperty("nama", "Ahmad Afif");
        });

        it("harus return 500 kalau database error", async () => {
            mockDb.query.mockImplementation((sql, cb) => cb({ message: "DB Error" }, null));

            const res = await request(app).get("/");

            expect(res.statusCode).toBe(500);
        });
    });

    describe("POST /", () => {
        it("harus berhasil tambah user baru", async () => {
            mockDb.query.mockImplementation((sql, params, cb) => cb(null, { insertId: 5 }));

            const res = await request(app).post("/").send({
                nama: "Budi Santoso",
                email: "budi@email.com",
                password: "password123",
                role: "Dosen",
            });

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty("message", "User berhasil ditambahkan");
        });

        it("harus return 500 kalau insert gagal", async () => {
            mockDb.query.mockImplementation((sql, params, cb) => cb({ code: "ER_DUP_ENTRY" }, null));

            const res = await request(app).post("/").send({
                nama: "Duplikat",
                email: "duplikat@email.com",
                password: "123",
                role: "Mahasiswa",
            });

            expect(res.statusCode).toBe(500);
        });
    });
});
