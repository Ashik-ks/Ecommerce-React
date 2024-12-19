const mongoose = require('mongoose')
const bcrypt = require('bcrypt');



const products = new mongoose.Schema({
    name: { 
        type: String, 
        trim: true 
    },
    description: { 
        type: String, 
        trim: true 
    },
    category: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Category', 
    }, // Reference to Category
    subcategory: { 
        type: String, 
    }, // Name of the selected subcategory
    item: { 
        type: String, 
    }, // Name of the selected item
    brand: { 
        type: String, 
        trim: true 
    },
    price: { 
        type: Number, 
        min: 0 
    },
    discountPrice: { 
        type: Number, 
        min: 0, 
        validate: {
            validator: function(value) {
                return value < this.price; // Discounted price should be less than original price
            },
            message: 'Discount price must be less than the original price'
        }
    },
    currency: { 
        type: String, 
        default: "INR", 
        enum: ["USD", "EUR", "GBP", "INR", "AUD"] 
    },
    stockQuantity: { 
        type: Number, 
        min: 0 
    },
    stockStatus: { 
        type: String, 
        enum: ["In Stock", "Out of Stock", "backordered"], 
        default: "In Stock" 
    },
    productStatus: { 
        type: String, 
        enum: ["Block", "UnBlock"], 
        default: "UnBlock" 
    },
    images: { 
        type: [String], 
    },
    weight: { 
        type: Number, 
        min: 0 
    }, // Weight of the product
    sellerId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
    },
    reviews: [
        {
            user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
            email: { type: String, required: true },
            rating: { type: Number, required: true },
            comment: { type: String, required: true },
            createdAt: { type: Date, default: Date.now },
        }
    ],
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
}, { 
    timestamps: true 
}); // Automatically adds createdAt and updatedAt fields

    

let Product = mongoose.model('products',products)
module.exports = Product;