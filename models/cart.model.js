const mongoose = require('mongoose')

const CartSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'PlantStore' }
})

const Cart = mongoose.model('Cart', CartSchema)

module.exports = Cart