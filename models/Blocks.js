const mongoose = require("mongoose")
const Schema = mongoose.Schema

// Schema
const BlockSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    slug: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    content: {
        type: String
    },
    active: {
        type: Boolean,
        default: true
    },
    global: {
        type: Boolean,
        default: false
    }
})

// Index all fields for searches by user
BlockSchema.index({ '$**': 'text' })

// Create model using mongoose's model method
const Block = mongoose.model("Block", BlockSchema)

// Export model
module.exports = Block
