const mongoose = require("mongoose")
const Schema = mongoose.Schema

// Schema for taxonomy terms
const TermsSchema = new Schema({
    name: {
      type: String,
      required: true,
      trim: true
    },
    owner: { type: Schema.ObjectId, 
      ref: 'Taxonomies', 
      required: true
    },
    associations: [{ type: Schema.ObjectId}]
  })
  
// This creates our model from the above schema, using mongoose's model method
const Terms = mongoose.model("Terms", TermsSchema)

// Export the Terms model
module.exports = Terms