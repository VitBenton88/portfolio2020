const mongoose = require("mongoose")
const AutoIncrement = require('mongoose-sequence')(mongoose)
const Schema = mongoose.Schema

// Schema for link
const LinkSchema = new Schema({
  text: {
    type: String,
    default: 'Link1',
    trim: true
  },
  route: {
    type: String,
    default: '/',
    trim: true
  },
  target: {
    type: String,
    default: '_self'
  },
  position: {
    type: Number,
    default: 0
  },
  sub_position: {
    type: Number,
    default: 0
  },
  is_ref: {
    type: Boolean,
    default: false
  },
  active: {
    type: Boolean,
    default: true
  },
  owner: {
    type: Schema.ObjectId,
    ref: 'Menus',
    required: true,
  },
  permalink: {
    type: Schema.ObjectId,
    ref: 'Permalinks',
    autopopulate: true
  },
  submenu: [{
    type: Schema.ObjectId,
    ref: 'Links'
  }]
})

// This creates our model from the above schema, using mongoose's model method
LinkSchema.plugin(AutoIncrement, {
  id: 'position_seq',
  inc_field: 'position'
})
LinkSchema.plugin(AutoIncrement, {
  id: 'sub_position_seq',
  inc_field: 'sub_position'
})
LinkSchema.plugin(require('mongoose-autopopulate'))
const Links = mongoose.model("Links", LinkSchema)

// Export the Links model
module.exports = Links