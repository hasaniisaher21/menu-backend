const Subcategory = require('../models/Subcategory');
const Category = require('../models/Category');
const Item = require('../models/Item');

// --- CREATE ---

/**
 * @desc    Create a new sub-category
 * @route   POST /api/subcategories
 * @access  Public
 */
exports.createSubcategory = async (req, res) => {
  try {
    const { name, image, description, categoryId, taxApplicability, tax } = req.body;

    // 1. Check if parent category exists
    const parentCategory = await Category.findById(categoryId);
    if (!parentCategory) {
      return res.status(404).json({ message: 'Parent category not found' });
    }

    // 2. Create new subcategory
    const newSubcategory = new Subcategory({
      name,
      image,
      description,
      category: categoryId,
      // 3. Tax Logic: Use provided value OR parent's value
      taxApplicability: taxApplicability ?? parentCategory.taxApplicability,
      tax: tax ?? parentCategory.tax,
    });

    const savedSubcategory = await newSubcategory.save();
    res.status(201).json(savedSubcategory);

  } catch (error) {
    res.status(500).json({ message: 'Error creating sub-category', error: error.message });
  }
};

// --- READ (GET) ---

/**
 * @desc    Get all sub-categories
 * @route   GET /api/subcategories
 * @access  Public
 */
exports.getAllSubcategories = async (req, res) => {
  try {
    // .populate() shows the full parent category object, not just its ID
    const subcategories = await Subcategory.find().populate('category', 'name');
    res.status(200).json(subcategories);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching sub-categories', error: error.message });
  }
};

/**
 * @desc    Get all sub-categories for a specific category
 * @route   GET /api/categories/:categoryId/subcategories
 * @access  Public
 */
exports.getSubcategoriesByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    // Check if category exists before searching
    const parentCategory = await Category.findById(categoryId);
    if (!parentCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const subcategories = await Subcategory.find({ category: categoryId });
    res.status(200).json(subcategories);

  } catch (error) {
    res.status(500).json({ message: 'Error fetching sub-categories', error: error.message });
  }
};

/**
 * @desc    Get a single sub-category by ID
 * @route   GET /api/subcategories/:id
 * @access  Public
 */
exports.getSubcategoryById = async (req, res) => {
  try {
    const subcategory = await Subcategory.findById(req.params.id).populate('category', 'name');
    if (!subcategory) {
      return res.status(404).json({ message: 'Sub-category not found' });
    }
    res.status(200).json(subcategory);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching sub-category', error: error.message });
  }
};

// --- UPDATE (EDIT) ---

/**
 * @desc    Edit a sub-category by ID
 * @route   PATCH /api/subcategories/:id
 * @access  Public
 */
exports.editSubcategory = async (req, res) => {
  try {
    const updatedSubcategory = await Subcategory.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true } // Return the updated document
    );

    if (!updatedSubcategory) {
      return res.status(404).json({ message: 'Sub-category not found' });
    }
    res.status(200).json(updatedSubcategory);

  } catch (error) {
    res.status(500).json({ message: 'Error updating sub-category', error: error.message });
  }
};

// --- DELETE ---

/**
 * @desc    Delete a sub-category by ID
 * @route   DELETE /api/subcategories/:id
 * @access  Public
 */
exports.deleteSubcategory = async (req, res) => {
  try {
    const subcategoryId = req.params.id;
    const deletedSubcategory = await Subcategory.findByIdAndDelete(subcategoryId);

    if (!deletedSubcategory) {
      return res.status(404).json({ message: 'Sub-category not found' });
    }

    // **Good Practice:** Also update or delete items under this subcategory.
    // Here, we'll set their `subcategory` field to null.
    await Item.updateMany(
      { subcategory: subcategoryId },
      { $set: { subcategory: null } }
    );

    res.status(200).json({ message: 'Sub-category deleted successfully and items updated.' });

  } catch (error) {
    res.status(500).json({ message: 'Error deleting sub-category', error: error.message });
  }
};