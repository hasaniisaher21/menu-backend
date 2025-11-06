const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const subcategorySchema = new Schema({
    name: { type: String, required: true },
    image: { type: String, required: true }, // URL
    description: { type: String },
    // This links it to the Category model
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    taxApplicability: { type: Boolean }, // Will default from category if not provided
    tax: { type: Number }, // Will default from category if not provided
}, { timestamps: true });

module.exports = mongoose.model('Subcategory', subcategorySchema);