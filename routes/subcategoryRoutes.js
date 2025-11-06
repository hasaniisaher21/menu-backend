const express = require('express');
const router = express.Router();

// Import controllers
const subcategoryController = require('../controllers/subcategoryController');
const itemController = require('../controllers/itemController');

// --- Subcategory Routes ---

// POST /api/subcategories
router.post('/', subcategoryController.createSubcategory);

// GET /api/subcategories
router.get('/', subcategoryController.getAllSubcategories);

// GET /api/subcategories/:id
router.get('/:id', subcategoryController.getSubcategoryById);

// PATCH /api/subcategories/:id
router.patch('/:id', subcategoryController.editSubcategory);

// DELETE /api/subcategories/:id
router.delete('/:id', subcategoryController.deleteSubcategory);


// --- Nested Routes ---

// GET /api/subcategories/:subcategoryId/items
// Gets all items for a specific subcategory
router.get('/:subcategoryId/items', itemController.getItemsBySubcategory);

module.exports = router;