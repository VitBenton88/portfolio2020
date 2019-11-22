const mongoose = require("mongoose")
const Schema = mongoose.Schema

// Schema for post meta
const MetaSchema = new Schema({
  title: {
    type: String
  },
  description: {
    type: String
  },
  owner: {
    type: Schema.Types.ObjectId,
    required: true,
    refPath: 'ownerModel'
  },
  ownerModel: {
    type: String,
    required: true,
    enum: ['Pages', 'Posts']
  }
})

// This creates our model from the above schema, using mongoose's model method
const Meta = mongoose.model("Meta", MetaSchema)

// Export the Meta model
module.exports = Meta
