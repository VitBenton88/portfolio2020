const mongoose = require("mongoose")
const Schema = mongoose.Schema

// Analog Schema
const MenuSchema = new Schema({
    name: {
        type: String,
        default: 'Your Menu'
    },
    slug: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    links: [{
        type: Schema.ObjectId,
        ref: 'Links'
    }]

})

//index all fields for searches by user
MenuSchema.index({'$**': 'text'})

// This creates our model from the above schema, using mongoose's model method
const Menu = mongoose.model("Menu", MenuSchema)

// Export the Menu model
module.exports = Menu