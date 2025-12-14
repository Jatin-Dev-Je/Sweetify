const path = require("path");
const swaggerJsdoc = require("swagger-jsdoc");
const { config } = require("../config/env");

const serverUrls = [
  {
    url: `http://localhost:${config.port}`,
    description: "Local development",
  },
];

if (process.env.API_BASE_URL) {
  serverUrls.push({ url: process.env.API_BASE_URL, description: "Deployed" });
}

const swaggerDefinition = {
  openapi: "3.0.3",
  info: {
    title: "Sweetify API",
    version: "1.0.0",
    description:
      "REST API for Sweetify managing authentication and sweets inventory. All successful responses use the `{ success, data }` envelope while failures return `{ success: false, message }`.",
  },
  servers: serverUrls,
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      ErrorResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: false },
          message: { type: "string" },
          errors: {
            type: "array",
            items: { type: "string" },
            nullable: true,
          },
        },
      },
      User: {
        type: "object",
        properties: {
          id: { type: "string" },
          email: { type: "string", format: "email" },
          role: { type: "string", enum: ["user", "admin"] },
        },
        required: ["id", "email", "role"],
      },
      AuthRegisterInput: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string", format: "email" },
          password: { type: "string", minLength: 8 },
          role: { type: "string", enum: ["user", "admin"], default: "user" },
        },
      },
      AuthLoginInput: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string", format: "email" },
          password: { type: "string", minLength: 8 },
        },
      },
      AuthResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          data: {
            type: "object",
            properties: {
              token: { type: "string" },
              user: { $ref: "#/components/schemas/User" },
            },
          },
        },
      },
      UserProfileResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          data: {
            type: "object",
            properties: {
              user: { $ref: "#/components/schemas/User" },
            },
          },
        },
      },
      Sweet: {
        type: "object",
        properties: {
          id: { type: "string" },
          name: { type: "string" },
          category: { type: "string" },
          price: { type: "number", format: "float" },
          quantity: { type: "integer", minimum: 0 },
          owner: { type: "string", format: "email" },
        },
        required: ["id", "name", "category", "price", "quantity", "owner"],
      },
      SweetCreateInput: {
        type: "object",
        required: ["name", "category", "price", "quantity"],
        properties: {
          name: { type: "string", minLength: 2, maxLength: 120 },
          category: { type: "string", minLength: 2, maxLength: 80 },
          price: { type: "number", format: "float", minimum: 0.01 },
          quantity: { type: "integer", minimum: 0 },
        },
      },
      SweetUpdateInput: {
        type: "object",
        properties: {
          name: { type: "string" },
          category: { type: "string" },
          price: { type: "number", format: "float", minimum: 0.01 },
          quantity: { type: "integer", minimum: 0 },
        },
        minProperties: 1,
      },
      SweetResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          data: {
            type: "object",
            properties: {
              sweet: { $ref: "#/components/schemas/Sweet" },
            },
          },
        },
      },
      SweetsResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          data: {
            type: "object",
            properties: {
              sweets: {
                type: "array",
                items: { $ref: "#/components/schemas/Sweet" },
              },
            },
          },
        },
      },
      DeleteResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          data: {
            type: "object",
            properties: {
              deleted: { type: "boolean" },
            },
          },
        },
      },
    },
  },
  tags: [
    { name: "Auth", description: "Authentication endpoints" },
    { name: "Sweets", description: "Sweet inventory endpoints" },
  ],
};

const options = {
  swaggerDefinition,
  apis: [path.resolve(__dirname, "../routes/*.js")],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = { swaggerSpec };
