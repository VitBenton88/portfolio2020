const mongoose = require("mongoose")
const Schema = mongoose.Schema

// Schema
const RedirectSchema = new Schema({
	created: {
		type: Date,
		default: Date.now
	},
	type: {
		type: Number,
		default: 301
	},
	active: {
		type: Boolean,
		default: true
	},
	source: {
		type: String,
		unique: true
	},
	target: {
		type: String
	},
	hits: {
		type: Number,
		default: 0
	}
})

// Index all fields for searches by user
RedirectSchema.index( {'$**': 'text'} )

// Create model using mongoose's model method
const Redirects = mongoose.model("Redirect", RedirectSchema)

// Export model
module.exports = Redirects