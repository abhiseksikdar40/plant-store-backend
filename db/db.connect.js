const mongoose = require('mongoose')
require('dotenv').config()

const mongoUrl = process.env.MONGODB

const initializePlantStoreData = async () => {
    await mongoose
    .connect(mongoUrl)
    .then(() => {
        console.log("Database Connected.")
    })
    .catch ((error) => {
        console.log("Error while connecting to database.", error)
    })
}

module.exports = { initializePlantStoreData }