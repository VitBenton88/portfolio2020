const mongoose = require("mongoose")
const Schema = mongoose.Schema

// Schema
const PagesNotFoundSchema = new Schema({
	created: {
		type: Date,
		default: Date.now
	},
	source: {
		type: String,
		unique: true
	},
	hits: {
		type: Number,
		default: 0
	}
})

// Index all fields for searches by user
PagesNotFoundSchema.index( {'$**': 'text'} )

// Create model using mongoose's model method
const PagesNotFound = mongoose.model("PagesNotFound", PagesNotFoundSchema)

// Export model
module.exports = PagesNotFound