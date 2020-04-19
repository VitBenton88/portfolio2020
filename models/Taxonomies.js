const mongoose = require("mongoose")
const Schema = mongoose.Schema

// Schema
const TaxonomySchema = new Schema({
	name: {
		type: String,
		required: true,
		unique: true,
		trim: true
	},
	terms: [{
		type: Schema.ObjectId,
		ref: 'Terms',
		autopopulate: true
	}]
})

// Index all fields for searches by user
TaxonomySchema.index( {'$**': 'text'} )

// Insert autopopulate plugin
TaxonomySchema.plugin(require('mongoose-autopopulate'))

// Create model using mongoose's model method
const Taxonomies = mongoose.model("Taxonomies", TaxonomySchema)

// Export model
module.exports = Taxonomies