const mongoose = require('mongoose')

const PlantStoreSchema = new mongoose.Schema({
    productImg: {
        type: String,
        required: true
    },
    productName: {
        type: String,
        required: true
    },
    productDescription: {
        type: String,
        required: true
    },
    productCategory: {
        type: String,
        required: true
    },
    productRating: {
        type: Number,
        required: true
    },
    productPrice: {
        type: Number,
        required: true
    },
    productDiscount: {
        type: Number,
        required: true
    }
},
    {
        timestamps: true
    }
)

const PlantStore = mongoose.model("PlantStore", PlantStoreSchema)

module.exports = PlantStore