const mongoose = require("mongoose")
const Schema = mongoose.Schema

// Schema for site post
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

//index all fields for searches by user
PostSchema.index({
  '$**': 'text'
})

// This creates our model from the above schema, using mongoose's model method
PostSchema.plugin(require('mongoose-autopopulate'))
const Posts = mongoose.model("Posts", PostSchema)

// Export the Posts model
module.exports = Posts