const Category = require('../models/Category');

// --- CREATE Category ---
// Make sure "exports." is here
exports.createCategory = async (req, res) => {
    try {
        const { name, image, description, taxApplicability, tax, taxType } = req.body;
        
        // Check if category already exists
        const existingCategory = await Category.findOne({ name });
        if (existingCategory) {
            return res.status(400).json({ message: 'Category already exists' });
        }

        const newCategory = new Category({
            name,
            image,
            description,
            taxApplicability,
            tax,
            taxType
        });

        const savedCategory = await newCategory.save();
        res.status(201).json(savedCategory); // 201 = Created

    } catch (error) {
        res.status(500).json({ message: 'Error creating category', error: error.message });
    }
};

// --- GET All Categories ---
// Make sure "exports." is here
exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching categories', error: error.message });
    }
};

// --- GET Category by ID ---
// Make sure "exports." is here
exports.getCategoryById = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching category', error: error.message });
    }
};

// --- EDIT Category ---
// Make sure "exports." is here
exports.editCategory = async (req, res) => {
    try {
        const updatedCategory = await Category.findByIdAndUpdate(
            req.params.id,
            req.body, // The new data to update with
            { new: true, runValidators: true } // {new: true} returns the updated document
        );

        if (!updatedCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.status(200).json(updatedCategory);
    } catch (error) {
        res.status(500).json({ message: 'Error updating category', error: error.message });
    }
};