const mongoose = require("mongoose")
const Schema = mongoose.Schema

// Schema
const UsersSchema = new Schema({
	username: {
		type: String,
		unique: true
	},
	email: {
		type: String,
		unique: true
	},
	image: {
		type: Schema.ObjectId,
		ref: 'Media',
		autopopulate: true
	},
	nickname: {
		type: String
	},
	password: {
		type: String,
		trim: true
	},
	role: {
		type: String,
		default: 'Visitor'
	},
	created: {
		type: Date,
		default: Date.now
	}
})

// Index all fields for searches by user
UsersSchema.index( {'$**': 'text'} )

// Insert autopopulate plugin
UsersSchema.plugin(require('mongoose-autopopulate'))

// Create model using mongoose's model method
const Users = mongoose.model("Users", UsersSchema)

// Export model
module.exports = Users