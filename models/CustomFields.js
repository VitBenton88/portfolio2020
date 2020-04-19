const mongoose = require("mongoose")
const Schema = mongoose.Schema

// Schema
const CustomFieldsSchema = new Schema({
    slug: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    value: {
        type: String
    },
    owner: {
        type: Schema.Types.ObjectId,
        required: true,
        // Instead of a hardcoded model name in `ref`, `refPath` means Mongoose
        // will look at the `onModel` property to find the right model.
        refPath: 'ownerModel'
    },
    ownerModel: {
        type: String,
        required: true,
        enum: ['Pages', 'Posts']
    }
})

// Create model using mongoose's model method
const CustomFields = mongoose.model("CustomFields", CustomFieldsSchema)

// Export model
module.exports = CustomFields