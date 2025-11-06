const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema({
    name: { type: String, required: true, unique: true },
    image: { type: String, required: true }, // URL
    description: { type: String },
    taxApplicability: { type: Boolean, default: false },
    tax: { type: Number, default: 0 },
    taxType: { type: String }, // e.g., "percentage" or "fixed"
}, { timestamps: true });

module.exports = mongoose.model('Category', categorySchema);