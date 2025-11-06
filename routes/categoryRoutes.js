const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

// POST /api/categories - Create Category
// Check that 'categoryController.createCategory' is a function
router.post('/', categoryController.createCategory);

// GET /api/categories - Get All Categories
// Check that 'categoryController.getAllCategories' is a function
router.get('/', categoryController.getAllCategories);

// GET /api/categories/:id - Get Category by ID
// Check that 'categoryController.getCategoryById' is a function
router.get('/:id', categoryController.getCategoryById);

// PATCH /api/categories/:id - Edit Category
// Check that 'categoryController.editCategory' is a function
router.patch('/:id', categoryController.editCategory);

module.exports = router;