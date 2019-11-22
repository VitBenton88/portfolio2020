const mongoose = require("mongoose")
const Schema = mongoose.Schema

// Schema for post meta
const RecaptchaSchema = new Schema({
  site_key: {
    type: String
  },
  secret_key: {
    type: String
  }
})

// This creates our model from the above schema, using mongoose's model method
const Recaptcha = mongoose.model("Recaptcha", RecaptchaSchema)

// Export the Recaptcha model
module.exports = Recaptcha