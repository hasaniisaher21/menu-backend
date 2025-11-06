const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');

// --- Item Routes ---

// POST /api/items
router.post('/', itemController.createItem);

// GET /api/items
router.get('/', itemController.getAllItems);

// GET /api/items/search
// (e.g., /api/items/search?name=Pizza)
// This MUST come before the '/:id' route
router.get('/search', itemController.searchItems);

// GET /api/items/:id
router.get('/:id', itemController.getItemById);

// PATCH /api/items/:id
router.patch('/:id', itemController.editItem);

// DELETE /api/items/:id
router.delete('/:id', itemController.deleteItem);

module.exports = router;