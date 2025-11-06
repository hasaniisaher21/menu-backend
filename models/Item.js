const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const itemSchema = new Schema({
    name: { type: String, required: true },
    image: { type: String, required: true }, // URL
    description: { type: String },
    
    // This links it to the Category model (required)
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    
    // This links it to the Subcategory model (optional)
    subcategory: { type: Schema.Types.ObjectId, ref: 'Subcategory', default: null },

    taxApplicability: { type: Boolean, default: false },
    tax: { type: Number, default: 0 },
    
    baseAmount: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    
    // This field is calculated, not stored. We use a "virtual"
    // totalAmount: Number 
}, { timestamps: true });

// A "Virtual" field for totalAmount
itemSchema.virtual('totalAmount').get(function() {
    // 'this' refers to the item document
    return this.baseAmount - this.discount;
});

// Ensure virtuals are included when converting to JSON
itemSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Item', itemSchema);