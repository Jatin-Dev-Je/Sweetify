const authMiddleware = require("../middlewares/auth.middleware");
const { generateToken } = require("../utils/jwt");
const { AuthenticationError } = require("../utils/errors");

describe("Auth middleware", () => {
  const callMiddleware = (authorizationValue) => {
    const req = { headers: { authorization: authorizationValue } };
    const res = {};
    const next = jest.fn();
    authMiddleware(req, res, next);
    return { req, next };
  };

  it("bubbles an AuthenticationError when the Authorization header is missing", () => {
    const { next } = callMiddleware(undefined);
    const [error] = next.mock.calls[0];

    expect(error).toBeInstanceOf(AuthenticationError);
    expect(error.message).toMatch(/required/i);
  });

  it("rejects malformed Authorization headers", () => {
    const { next } = callMiddleware("Token abc");
    const [error] = next.mock.calls[0];

    expect(error).toBeInstanceOf(AuthenticationError);
    expect(error.message).toMatch(/required/i);
  });

  it("rejects invalid or expired tokens", () => {
    const { next } = callMiddleware("Bearer invalid.token");
    const [error] = next.mock.calls[0];

    expect(error).toBeInstanceOf(AuthenticationError);
    expect(error.message).toMatch(/invalid or expired/i);
  });

  it("hydrates req.user and calls next with a valid token", () => {
    const token = generateToken({ id: "user-123", email: "reader@example.com", role: "user" });
    const { req, next } = callMiddleware(`Bearer ${token}`);

    expect(req.user).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        email: "reader@example.com",
        role: "user",
      })
    );
    expect(next).toHaveBeenCalledWith();
  });
});
