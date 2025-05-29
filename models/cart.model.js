const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'PlantStore', required: true },
    quantity: { type: Number, default: 1, min: 1 }
});

const Cart = mongoose.model('Cart', CartSchema);

module.exports = Cart;