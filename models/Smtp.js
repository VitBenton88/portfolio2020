const mongoose = require("mongoose")
const Schema = mongoose.Schema

// Schema for SMTP
const SmtpSchema = new Schema({
  host: {
    type: String
  },
  port: {
    type: Number,
    default: 465
  },
  secure: {
    type: Boolean,
    default: false
  },
  user: {
    type: String
  },
  password: {
    type: String
  }
})

// This creates our model from the above schema, using mongoose's model method
const Smtp = mongoose.model("Smtp", SmtpSchema)

// Export the Smtp model
module.exports = Smtp