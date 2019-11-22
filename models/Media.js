const mongoose = require("mongoose")
const Schema = mongoose.Schema

// Schema for users
const MediaSchema = new Schema({
  type: {
    type: String,
    required: true
  },
  storage: {
    type: String,
    required: true
  },
  fileName: {
    type: String,
    required: true
  },
  path: {
    type: String,
    required: true
  },
  key: {
    type: String
  },
  size: {
    type: Number,
    required: true
  },
  meta: {
    alt: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    caption: {
      type: String,
      default: '',
    }
  },
  created: {
    type: Date,
    default: Date.now
  }
})

//index all fields for searches by user
MediaSchema.index({'$**': 'text'})

// This creates our model from the above schema, using mongoose's model method
const Media = mongoose.model("Media", MediaSchema)

// Export the Media model
module.exports = Media