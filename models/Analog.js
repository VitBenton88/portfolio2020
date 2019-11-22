const mongoose = require("mongoose")
const Schema = mongoose.Schema

// Schema for site settings
const SettingsSchema = new Schema({
  meta_body: {
    type: String
  },
  meta_head: {
    type: String,
    default: `<meta name="apple-mobile-web-app-capable"content="yes">
    <meta name="apple-mobile-web-app-status-bar-style"content="black-translucent">`
  },
  name: {
    type: String,
    default: 'Your Website!'
  },
  description: {
    type: String,
    default: "Your Website's Description!"
  },
  address: {
    type: String,
    trim: true
  },
  storage: {
    type: {
      type: String,
      default: 'local'
    },
    fileSizeLimit: {
      type: Number,
      default: 8
    },
    configurations: {
      aws: {
        accessKeyId: String,
        secretAccessKey: String,
        bucketName: String
      },
      googleCloud: {
        bucketName: String,
        projectId: String
      }
    }
  }
})

// Analog Schema
const AnalogSchema = new Schema({
  settings: SettingsSchema,
  created: {
    type: Date,
    default: Date.now
  }

})

// This creates our model from the above schema, using mongoose's model method
const Analog = mongoose.model("Analog", AnalogSchema)

// Instantiate new schema
// const instance = new Analog()
// instance.save(function (err) {
//   console.error(err)
// })

// Export the Analog model
module.exports = Analog