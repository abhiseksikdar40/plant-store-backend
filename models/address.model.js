const mongoose = require('mongoose')

const AddressSchema = new mongoose.Schema({
    fullName: { type: String, required: true},
    phoneNumber: { type: Number, required: true},
    pinCode: { type: Number, required: true},
    house: { type: String, required: true},
    roadName: { type: String, required: true},
    city: { type: String, required: true},
})

const Address = mongoose.model('Address', AddressSchema)

module.exports = Address