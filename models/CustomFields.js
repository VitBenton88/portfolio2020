const mongoose = require("mongoose")
const Schema = mongoose.Schema

// Schema for link
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

// This creates our model from the above schema, using mongoose's model method
const CustomFields = mongoose.model("CustomFields", CustomFieldsSchema)

// Export the Custom Fields model
module.exports = CustomFields