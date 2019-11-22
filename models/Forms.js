const mongoose = require("mongoose")
const Schema = mongoose.Schema

// Schema for Entry
const FormsSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    name: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    fields: {
        type: Array,
        default: []
    },
    entries: [{
        type: Schema.ObjectId,
        ref: 'Entries'
    }],
    settings: {
        recaptcha: {
            type: Boolean,
            default: true
        }
    },
    mail: {
        recipients: {
            type: Array,
            default: []
        },
        subject: {
            type: String
        },
        replyTo: {
            type: String
        },
        success: {
            type: String
        },
        redirect: {
            type: String
        }
    }
})

//index all fields for searches by user
FormsSchema.index({
    '$**': 'text'
})

// This creates our model from the above schema, using mongoose's model method
const Forms = mongoose.model("Forms", FormsSchema)

// Export the Forms model
module.exports = Forms