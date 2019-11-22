const mongoose = require("mongoose")
const Schema = mongoose.Schema

// Entry Fields Schema
const FieldsSchema = new Schema({
    name: {
        type: String,
    },
    value: {},
    label: {
        type: String,
    }
})

// Schema for Entry
const EntriesSchema = new Schema({
    form: {
        type: Schema.ObjectId,
        ref: 'Forms',
        required: true,
        autopopulate: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    fields: [FieldsSchema],
    read: {
        type: Boolean,
        default: false
      },
    meta: {
        ip: {
            type: String,
        },
        recaptchaScore: {
            type: Number,
        }
    },
    created: {
        type: Date,
        default: Date.now
      }
})

//index all fields for searches by user
EntriesSchema.index({
    '$**': 'text'
})

FieldsSchema.index({
    '$**': 'text'
})

// This creates our model from the above schema, using mongoose's model method
EntriesSchema.plugin(require('mongoose-autopopulate'))
const Entries = mongoose.model("Entries", EntriesSchema)

// Export the Entries model
module.exports = Entries