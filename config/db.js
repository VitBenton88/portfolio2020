// dependencies
// =============================================================
const mongoose = require("mongoose")

module.exports = {
    connect: () => {
        const DB_NAME = "portfolio_2020"
        const MONGODB_URI = process.env.DB_URI || `mongodb://localhost/${DB_NAME}`
        const MONGODB_CONFIG = {
            useCreateIndex: true,
            useFindAndModify: false,
            useNewUrlParser: true,
            useUnifiedTopology: true
        }

        // connect
        mongoose.connect(MONGODB_URI, MONGODB_CONFIG)
        console.log(`Database connected @ ${MONGODB_URI}`)
    }
}