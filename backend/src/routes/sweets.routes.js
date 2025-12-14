const express = require("express");
const requireAuth = require("../middlewares/auth.middleware");
const requireAdmin = require("../middlewares/requireAdmin");
const validateRequest = require("../middlewares/validateRequest");
const {
	createSweetSchema,
	updateSweetSchema,
	searchSweetsSchema,
	quantityPayloadSchema,
} = require("../validations/sweets.validation");
const {
	addSweet,
	listSweets,
	searchSweets,
	updateSweet,
	deleteSweet,
	purchaseSweet,
	restockSweet,
} = require("../controllers/sweets.controller");

const router = express.Router();

/**
 * @openapi
 * /api/sweets:
 *   post:
 *     tags: [Sweets]
 *     summary: Create a new sweet for the authenticated user
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SweetCreateInput'
 *     responses:
 *       201:
 *         description: Sweet created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SweetResponse'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   get:
 *     tags: [Sweets]
 *     summary: List sweets owned by the authenticated user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of sweets
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SweetsResponse'
 */
router.post("/", requireAuth, validateRequest(createSweetSchema), addSweet);
router.get("/", requireAuth, listSweets);

/**
 * @openapi
 * /api/sweets/search:
 *   get:
 *     tags: [Sweets]
 *     summary: Search sweets by name, category or price range
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *           minLength: 2
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           minLength: 2
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *           minimum: 0
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *           minimum: 0
 *     responses:
 *       200:
 *         description: Filtered sweets
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SweetsResponse'
 *       400:
 *         description: Invalid query parameters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get(
	"/search",
	requireAuth,
	validateRequest(searchSweetsSchema, "query"),
	searchSweets
);

/**
 * @openapi
 * /api/sweets/{id}/purchase:
 *   post:
 *     tags: [Sweets]
 *     summary: Purchase a sweet (decrements quantity)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Updated sweet after purchase
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SweetResponse'
 *       400:
 *         description: Out of stock
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Sweet not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post(
	"/:id/purchase",
	requireAuth,
	validateRequest(quantityPayloadSchema),
	purchaseSweet
);

/**
 * @openapi
 * /api/sweets/{id}/restock:
 *   post:
 *     tags: [Sweets]
 *     summary: Restock a sweet (admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Updated sweet after restocking
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SweetResponse'
 *       403:
 *         description: Forbidden for non-admin users
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Sweet not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post(
	"/:id/restock",
	requireAuth,
	requireAdmin,
	validateRequest(quantityPayloadSchema),
	restockSweet
);

/**
 * @openapi
 * /api/sweets/{id}:
 *   put:
 *     tags: [Sweets]
 *     summary: Update a sweet that you own
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SweetUpdateInput'
 *     responses:
 *       200:
 *         description: Updated sweet
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SweetResponse'
 *       403:
 *         description: Attempt to modify another user's sweet
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Sweet not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   delete:
 *     tags: [Sweets]
 *     summary: Delete a sweet (admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Sweet deleted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DeleteResponse'
 *       403:
 *         description: Forbidden for non-admin users
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Sweet not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put("/:id", requireAuth, validateRequest(updateSweetSchema), updateSweet);
router.delete("/:id", requireAuth, requireAdmin, deleteSweet);

module.exports = router;
