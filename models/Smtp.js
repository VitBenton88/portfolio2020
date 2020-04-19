const mongoose = require("mongoose")
const Schema = mongoose.Schema

// Schema
const SmtpSchema = new Schema({
	host: {
		type: String
	},
	port: {
		type: Number,
		default: 465
	},
	secure: {
		type: Boolean,
		default: false
	},
	user: {
		type: String
	},
	password: {
		type: String
	}
})

// Create model using mongoose's model method
const Smtp = mongoose.model("Smtp", SmtpSchema)

// Export model
module.exports = Smtp