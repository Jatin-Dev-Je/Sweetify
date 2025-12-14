const request = require("supertest");
const app = require("../app");

const registerAndLogin = async ({ email, password = "Password!23", role = "user", name = "Inventory User" }) => {
  await request(app).post("/api/auth/register").send({ name, email, password, role });
  const loginRes = await request(app).post("/api/auth/login").send({ email, password });
  return loginRes.body.data.token;
};

const createSweet = async (token, overrides = {}) =>
  request(app)
    .post("/api/sweets")
    .set("Authorization", `Bearer ${token}`)
    .send({
      name: "Inventory Sweet",
      category: "Indian",
      price: 30,
      quantity: 5,
      ...overrides,
    });

describe("Inventory - Purchase Sweet", () => {
  it("allows authenticated user to purchase a sweet and reduces quantity", async () => {
    const token = await registerAndLogin({ email: "buyer@example.com" });

    const createRes = await createSweet(token, { quantity: 5 });
    const sweetId = createRes.body.data.sweet.id;

    const response = await request(app)
      .post(`/api/sweets/${sweetId}/purchase`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.data.sweet).toHaveProperty("quantity", 4);
  });

  it("prevents purchasing a sweet when out of stock", async () => {
    const token = await registerAndLogin({ email: "out@example.com" });

    const createRes = await createSweet(token, { quantity: 0 });
    const sweetId = createRes.body.data.sweet.id;

    const response = await request(app)
      .post(`/api/sweets/${sweetId}/purchase`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toMatch(/out of stock/i);
  });

  it("rejects purchase when requested quantity exceeds available stock", async () => {
    const token = await registerAndLogin({ email: "bulk@example.com" });

    const createRes = await createSweet(token, { quantity: 2 });
    const sweetId = createRes.body.data.sweet.id;

    const response = await request(app)
      .post(`/api/sweets/${sweetId}/purchase`)
      .set("Authorization", `Bearer ${token}`)
      .send({ quantity: 3 });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toMatch(/out of stock/i);
  });

  it("rejects purchase when quantity payload is invalid", async () => {
    const token = await registerAndLogin({ email: "invalid@example.com" });

    const createRes = await createSweet(token, { quantity: 5 });
    const sweetId = createRes.body.data.sweet.id;

    const response = await request(app)
      .post(`/api/sweets/${sweetId}/purchase`)
      .set("Authorization", `Bearer ${token}`)
      .send({ quantity: 0 });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toMatch(/quantity/i);
  });

  it("allows admin to restock a sweet and increases quantity", async () => {
    const adminToken = await registerAndLogin({ email: "restock@example.com", role: "admin" });

    const createRes = await createSweet(adminToken, { quantity: 1 });
    const sweetId = createRes.body.data.sweet.id;

    const response = await request(app)
      .post(`/api/sweets/${sweetId}/restock`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).toBe(200);
    expect(response.body.data.sweet).toHaveProperty("quantity", 2);
  });

  it("blocks non-admin users from restocking sweets", async () => {
    const token = await registerAndLogin({ email: "nonadmin@example.com" });

    const createRes = await createSweet(token, { quantity: 1 });
    const sweetId = createRes.body.data.sweet.id;

    const response = await request(app)
      .post(`/api/sweets/${sweetId}/restock`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(403);
    expect(response.body.success).toBe(false);
  });
});
