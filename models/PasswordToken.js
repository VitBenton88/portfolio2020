const mongoose = require("mongoose")
const Schema = mongoose.Schema

// Analog Schema
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

// This creates our model from the above schema, using mongoose's model method
const PasswordToken = mongoose.model("PasswordToken", PasswordTokenSchema)

// Export the Menu model
module.exports = PasswordToken