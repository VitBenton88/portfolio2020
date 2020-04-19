const mongoose = require("mongoose")
const Schema = mongoose.Schema

// Schema
const PasswordTokenSchema = new Schema({
    token: {
        type: String,
        required: true
    },
    user_id: {
        type: Schema.ObjectId,
        ref: 'Users',
        required: true
      },
    createdAt: { 
        type: Date, 
        expires: '15m', 
        default: Date.now 
    }
})

// Create model using mongoose's model method
const PasswordToken = mongoose.model("PasswordToken", PasswordTokenSchema)

// Export model
module.exports = PasswordToken