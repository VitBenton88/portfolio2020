const mongoose = require("mongoose")
const Schema = mongoose.Schema

// Schema
const RecaptchaSchema = new Schema({
	site_key: {
		type: String
	},
	secret_key: {
		type: String
	}
})

// Create model using mongoose's model method
const Recaptcha = mongoose.model("Recaptcha", RecaptchaSchema)

// Export model
module.exports = Recaptcha