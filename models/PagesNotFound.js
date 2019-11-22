const mongoose = require("mongoose")
const Schema = mongoose.Schema

// Schema for post meta
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

//index all fields for searches by user
PagesNotFoundSchema.index({'$**': 'text'})

// This creates our model from the above schema, using mongoose's model method
const PagesNotFound = mongoose.model("PagesNotFound", PagesNotFoundSchema)

// Export the Redirect model
module.exports = PagesNotFound