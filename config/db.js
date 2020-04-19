// Dependencies
// =============================================================
const mongoose = require("mongoose")

module.exports = {
    connect: () => {
        // Connect to the Mongo DB
        // =============================================================
        const DB_NAME = "portfolio_2020"
        const MONGODB_URI = process.env.MONGODB_URI || `mongodb://localhost/${DB_NAME}`
        // Set mongoose to leverage built in JavaScript ES6 Promises
        mongoose.Promise = Promise
        mongoose.connect(MONGODB_URI, { useNewUrlParser: true })

        console.log(`Database connected @ ${MONGODB_URI}`)
    }
}