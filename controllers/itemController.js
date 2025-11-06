const Item = require('../models/Item');
const Category = require('../models/Category');
const Subcategory = require('../models/Subcategory');

// --- CREATE ---

/**
 * @desc    Create a new item
 * @route   POST /api/items
 * @access  Public
 */
exports.createItem = async (req, res) => {
  try {
    const {
      name,
      image,
      description,
      categoryId,
      subcategoryId, // This is optional
      taxApplicability,
      tax,
      baseAmount,
      discount
    } = req.body;

    // 1. Validate Category
    const parentCategory = await Category.findById(categoryId);
    if (!parentCategory) {
      return res.status(404).json({ message: 'Parent category not found' });
    }

    let parentSubcategory = null;
    // 2. Validate Subcategory (if provided)
    if (subcategoryId) {
      parentSubcategory = await Subcategory.findById(subcategoryId);
      if (!parentSubcategory) {
        return res.status(404).json({ message: 'Parent sub-category not found' });
      }
      // 2a. Check that the subcategory belongs to the correct category
      if (parentSubcategory.category.toString() !== categoryId) {
        return res.status(400).json({ message: 'Sub-category does not belong to the provided category' });
      }
    }

    // 3. Tax Logic: Priority = Item > Subcategory > Category
    const finalTaxApplicability = taxApplicability ?? parentSubcategory?.taxApplicability ?? parentCategory.taxApplicability;
    const finalTax = tax ?? parentSubcategory?.tax ?? parentCategory.tax;

    // 4. Create new item
    const newItem = new Item({
      name,
      image,
      description,
      category: categoryId,
      subcategory: subcategoryId || null,
      taxApplicability: finalTaxApplicability,
      tax: finalTax,
      baseAmount,
      discount
    });

    const savedItem = await newItem.save();
    res.status(201).json(savedItem);

  } catch (error) {
    res.status(500).json({ message: 'Error creating item', error: error.message });
  }
};

// --- READ (GET) ---

/**
 * @desc    Get all items
 * @route   GET /api/items
 * @access  Public
 */
exports.getAllItems = async (req, res) => {
  try {
    // Populate both category and subcategory for full details
    const items = await Item.find()
      .populate('category', 'name')
      .populate('subcategory', 'name');
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching items', error: error.message });
  }
};

/**
 * @desc    Get a single item by ID
 * @route   GET /api/items/:id
 * @access  Public
 */
exports.getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id)
      .populate('category', 'name')
      .populate('subcategory', 'name');

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching item', error: error.message });
  }
};

/**
 * @desc    Get all items for a specific category
 * @route   GET /api/categories/:categoryId/items
 * @access  Public
 */
exports.getItemsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const items = await Item.find({ category: categoryId })
      .populate('subcategory', 'name');
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching items', error: error.message });
  }
};

/**
 * @desc    Get all items for a specific sub-category
 * @route   GET /api/subcategories/:subcategoryId/items
 * @access  Public
 */
exports.getItemsBySubcategory = async (req, res) => {
  try {
    const { subcategoryId } = req.params;
    const items = await Item.find({ subcategory: subcategoryId })
      .populate('category', 'name');
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching items', error: error.message });
  }
};

// --- UPDATE (EDIT) ---

/**
 * @desc    Edit an item by ID
 * @route   PATCH /api/items/:id
 * @access  Public
 */
exports.editItem = async (req, res) => {
  try {
    const updatedItem = await Item.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.status(200).json(updatedItem);

  } catch (error) {
    res.status(500).json({ message: 'Error updating item', error: error.message });
  }
};

// --- DELETE ---

/**
 * @desc    Delete an item by ID
 * @route   DELETE /api/items/:id
 * @access  Public
 */
exports.deleteItem = async (req, res) => {
  try {
    const deletedItem = await Item.findByIdAndDelete(req.params.id);

    if (!deletedItem) {
      return res.status(44).json({ message: 'Item not found' });
    }
    res.status(200).json({ message: 'Item deleted successfully.' });

  } catch (error) {
    res.status(500).json({ message: 'Error deleting item', error: error.message });
  }
};

// --- SEARCH ---

/**
 * @desc    Search for items by name
 * @route   GET /api/items/search
 * @access  Public
 */
exports.searchItems = async (req, res) => {
  try {
    // Search term is passed as a query parameter (e.g., /search?name=Pizza)
    const { name } = req.query;

    if (!name) {
      return res.status(400).json({ message: 'Search query "name" is required.' });
    }

    const items = await Item.find({
      // Use $regex for a partial match and $options: 'i' for case-insensitivity
      name: { $regex: name, $options: 'i' }
    })
    .populate('category', 'name')
    .populate('subcategory', 'name');

    res.status(200).json(items);

  } catch (error) {
    res.status(500).json({ message: 'Error searching items', error: error.message });
  }
};