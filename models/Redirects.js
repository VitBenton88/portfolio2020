const mongoose = require("mongoose")
const Schema = mongoose.Schema

// Schema for post meta
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

//index all fields for searches by user
RedirectSchema.index({'$**': 'text'})

// This creates our model from the above schema, using mongoose's model method
const Redirects = mongoose.model("Redirect", RedirectSchema)

// Export the Redirect model
module.exports = Redirects