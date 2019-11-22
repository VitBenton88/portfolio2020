const mongoose = require("mongoose")
const Schema = mongoose.Schema

// Schema for link
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

//index all fields for searches by user
TaxonomySchema.index({'$**': 'text'})

// This creates our model from the above schema, using mongoose's model method
TaxonomySchema.plugin(require('mongoose-autopopulate'))
const Taxonomies = mongoose.model("Taxonomies", TaxonomySchema)

// Export the Taxonomies model
module.exports = Taxonomies