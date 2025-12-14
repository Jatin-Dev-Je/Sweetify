const request = require("supertest");
const bcrypt = require("bcrypt");
const app = require("../app");
const User = require("../models/User");

const registerPayload = {
  email: "tester@example.com",
  password: "Sup3rSecure!",
};

describe("Auth API - Register", () => {
  it("rejects invalid email before reaching the controller", async () => {
    const response = await request(app).post("/api/auth/register").send({
      email: "not-an-email",
      password: "password123",
    });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toMatch(/email/i);
  });

  it("rejects weak passwords (< 8 chars)", async () => {
    const response = await request(app).post("/api/auth/register").send({
      email: "shortpass@example.com",
      password: "short",
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/password/i);
  });

  it("hashes passwords with bcrypt before persisting", async () => {
    const response = await request(app).post("/api/auth/register").send(registerPayload);

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);

    const user = await User.findOne({ email: registerPayload.email });
    expect(user).toBeDefined();
    expect(user.password).not.toBe(registerPayload.password);
    const passwordsMatch = await bcrypt.compare(registerPayload.password, user.password);
    expect(passwordsMatch).toBe(true);
  });

  it("returns 409 when email already exists", async () => {
    await request(app).post("/api/auth/register").send(registerPayload);
    const duplicateResponse = await request(app).post("/api/auth/register").send(registerPayload);

    expect(duplicateResponse.status).toBe(409);
    expect(duplicateResponse.body.message).toMatch(/exists/i);
  });
});

describe("Auth API - Login", () => {
  beforeEach(async () => {
    await request(app).post("/api/auth/register").send({
      email: "login-user@example.com",
      password: "Password!23",
    });
  });

  it("issues a JWT + user DTO for valid credentials", async () => {
    const response = await request(app).post("/api/auth/login").send({
      email: "login-user@example.com",
      password: "Password!23",
    });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toMatchObject({
      token: expect.any(String),
      user: {
        email: "login-user@example.com",
        role: expect.any(String),
        id: expect.any(String),
      },
    });
  });

  it("rejects login when password does not match hash", async () => {
    const response = await request(app).post("/api/auth/login").send({
      email: "login-user@example.com",
      password: "WrongPassword!",
    });

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toMatch(/invalid/i);
  });
});

describe("Auth API - Profile", () => {
  it("returns the authenticated user via /auth/me", async () => {
    const registerResponse = await request(app).post("/api/auth/register").send({
      email: "profile@example.com",
      password: "ProfilePass1!",
    });

    const token = registerResponse.body.data.token;

    const profileResponse = await request(app)
      .get("/api/auth/me")
      .set("Authorization", `Bearer ${token}`);

    expect(profileResponse.status).toBe(200);
    expect(profileResponse.body.data.user).toMatchObject({
      email: "profile@example.com",
      role: expect.any(String),
    });
  });

  it("rejects profile requests without a token", async () => {
    const response = await request(app).get("/api/auth/me");

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });
});
