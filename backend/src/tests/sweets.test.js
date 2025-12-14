const request = require("supertest");
const app = require("../app");

const registerAndLogin = async ({ email, password = "Password!23", role = "user", name = "Sweet User" }) => {
  await request(app).post("/api/auth/register").send({ name, email, password, role });
  const loginRes = await request(app).post("/api/auth/login").send({ email, password });
  return loginRes.body.data.token;
};

const createSweet = async (token, overrides = {}) => {
  const payload = {
    name: "Signature Sweet",
    category: "Indian",
    price: 25,
    quantity: 10,
    ...overrides,
  };

  return request(app)
    .post("/api/sweets")
    .set("Authorization", `Bearer ${token}`)
    .send(payload);
};

describe("Sweets routes", () => {
  it("requires authentication", async () => {
    const response = await request(app).get("/api/sweets");
    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });

  it("allows access with valid token", async () => {
    const token = await registerAndLogin({ email: "sweet@example.com" });

    const response = await request(app)
      .get("/api/sweets")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data.sweets)).toBe(true);
  });

  it("rejects sweet creation with invalid payload", async () => {
    const token = await registerAndLogin({ email: "invalid-payload@example.com" });

    const response = await request(app)
      .post("/api/sweets")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "NoPrice" });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toMatch(/required/i);
  });

  it("allows authenticated user to add a sweet", async () => {
    const token = await registerAndLogin({ email: "maker@example.com" });

    const response = await createSweet(token, { name: "Ladoo", price: 10, quantity: 50 });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.sweet).toMatchObject({ name: "Ladoo", price: 10 });
  });

  it("returns list of sweets for authenticated user", async () => {
    const token = await registerAndLogin({ email: "list@example.com" });

    await createSweet(token, { name: "Barfi" });

    const response = await request(app)
      .get("/api/sweets")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.data.sweets.length).toBeGreaterThan(0);
    expect(response.body.data.sweets[0]).toHaveProperty("name", "Barfi");
  });

  it("exposes admin-created sweets to other authenticated users", async () => {
    const adminToken = await registerAndLogin({ email: "catalog-admin@example.com", role: "admin" });
    const shopperToken = await registerAndLogin({ email: "catalog-user@example.com" });

    const created = await createSweet(adminToken, { name: "Kaju Katli" });
    const sweetId = created.body.data.sweet.id;
    expect(sweetId).toBeDefined();

    const response = await request(app)
      .get("/api/sweets")
      .set("Authorization", `Bearer ${shopperToken}`);

    expect(response.status).toBe(200);
    const sweetNames = response.body.data.sweets.map((sweet) => sweet.name);
    expect(sweetNames).toContain("Kaju Katli");
  });

  it("searches sweets by name", async () => {
    const token = await registerAndLogin({ email: "search@example.com" });

    await createSweet(token, { name: "Rasgulla" });
    await createSweet(token, { name: "Chocolate", category: "Western" });

    const response = await request(app)
      .get("/api/sweets/search?name=Rasgulla")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.data.sweets).toHaveLength(1);
    expect(response.body.data.sweets[0]).toHaveProperty("name", "Rasgulla");
  });

  it("validates search query parameters", async () => {
    const token = await registerAndLogin({ email: "bad-search@example.com" });

    const response = await request(app)
      .get("/api/sweets/search?minPrice=-10")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toMatch(/minPrice/i);
  });

  it("updates an existing sweet owned by the user", async () => {
    const token = await registerAndLogin({ email: "update@example.com" });

    const createRes = await createSweet(token, { name: "Halwa", price: 20, quantity: 10 });
    const sweetId = createRes.body.data.sweet.id;

    const response = await request(app)
      .put(`/api/sweets/${sweetId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ price: 25, quantity: 15 });

    expect(response.status).toBe(200);
    expect(response.body.data.sweet).toMatchObject({ price: 25, quantity: 15 });
  });

  it("prevents users from updating sweets they do not own", async () => {
    const ownerToken = await registerAndLogin({ email: "owner@example.com" });
    const intruderToken = await registerAndLogin({ email: "intruder@example.com" });

    const createRes = await createSweet(ownerToken, { name: "Secret Sweet" });
    const sweetId = createRes.body.data.sweet.id;

    const response = await request(app)
      .put(`/api/sweets/${sweetId}`)
      .set("Authorization", `Bearer ${intruderToken}`)
      .send({ price: 999 });

    expect(response.status).toBe(403);
    expect(response.body.success).toBe(false);
  });

  it("allows admin user to delete a sweet", async () => {
    const adminToken = await registerAndLogin({ email: "admin@example.com", role: "admin" });

    const createRes = await createSweet(adminToken, { name: "Gulab Jamun" });
    const sweetId = createRes.body.data.sweet.id;

    const response = await request(app)
      .delete(`/api/sweets/${sweetId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });
});
