const mongoose = require("mongoose")
const Schema = mongoose.Schema

// Schema for users
const UsersSchema = new Schema({
  username: {
    type: String,
    unique: true
  },
  email: {
    type: String,
    unique: true,
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

//index all fields for searches by user
UsersSchema.index({'$**': 'text'})

// This creates our model from the above schema, using mongoose's model method
UsersSchema.plugin(require('mongoose-autopopulate'))
const Users = mongoose.model("Users", UsersSchema)

// Export the Users model
module.exports = Users