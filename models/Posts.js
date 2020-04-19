const mongoose = require("mongoose")
const Schema = mongoose.Schema

// Schema
const PostSchema = new Schema({
	author: {
		type: Schema.ObjectId,
		ref: 'Users',
		required: true,
		autopopulate: true
	},
	title: {
		type: String,
		default: 'Post title!',
		required: true,
		unique: true
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
	content: {
		type: String
	},
	taxonomies: [{
		type: Schema.ObjectId,
		ref: 'Taxonomies'
	}],
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
	created: {
		type: Date,
		default: Date.now
	},
	updated: {
		type: Date,
		default: Date.now
	},
	private: {
		type: Boolean,
		default: false
	},
	published: {
		type: Date,
		default: Date.now
	}
})

// Index all fields for searches by user
PostSchema.index({ '$**': 'text' })

// Insert autopopulate plugin
PostSchema.plugin(require('mongoose-autopopulate'))

// Create model using mongoose's model method
const Posts = mongoose.model("Posts", PostSchema)

// Export model
module.exports = Posts