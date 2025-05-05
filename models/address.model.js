const mongoose = require('mongoose');

const AddressSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  phoneNumber: { type: Number, required: true },
  pinCode: { type: Number, required: true },
  houseNumber: { type: String, required: true },
  streetName: { type: String, required: true },
  cityName: { type: String, required: true },
});

const Address = mongoose.model('Address', AddressSchema);

module.exports = Address;
