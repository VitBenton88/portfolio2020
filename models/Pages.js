const mongoose = require("mongoose")
const Schema = mongoose.Schema

// Schema
const PageSchema = new Schema({
	author: {
		type: Schema.ObjectId,
		ref: 'Users',
		required: true,
		autopopulate: true
	},
	title: {
		type: String,
		unique: true,
		required: true,
		default: 'Page title!'
	},
	permalink: {
		type: Schema.ObjectId,
		unique: true,
		ref: 'Permalinks'
	},
	template: {
		type: String,
		required: true
	},
	image: {
		type: Schema.ObjectId,
		ref: 'Media',
		autopopulate: true
	},
	homepage: {
		type: Boolean,
		default: false
	},
	content: {
		type: String
	},
	forms: [{
		type: Schema.ObjectId,
		ref: 'Forms'
	}],
	blocks: [{
		type: Schema.ObjectId,
		ref: 'Blocks'
	}],
	meta: {
		type: Schema.ObjectId,
		ref: 'Meta',
		autopopulate: true
	},
	customFields: [{
		type: Schema.ObjectId,
		ref: 'CustomFields',
		autopopulate: true
	}],
	active: {
		type: Boolean,
		default: false
	},
	private: {
		type: Boolean,
		default: false
	},
	created: {
		type: Date,
		default: Date.now
	},
	updated: {
		type: Date,
		default: Date.now
	}
})

// Index all fields for searches by user
PageSchema.index({ '$**': 'text' })

// Make sure there can only be one set to homepage
PageSchema.index({
	homepage: 1
	}, {
		unique: true,
		partialFilterExpression: { homepage: true }
});

// Insert autopopulate plugin
PageSchema.plugin(require('mongoose-autopopulate'))

// Create model using mongoose's model method
const Pages = mongoose.model("Pages", PageSchema)

// Export model
module.exports = Pages