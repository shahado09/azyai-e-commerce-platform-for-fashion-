const mongoose = require('mongoose');

//mongoose schema
const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
  },

  password: {
    type: String,
    required: true,
  },

  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true },

  passwordHash: {
    type: String,
    required: true },

  role: {
      type: String,
      enum: ["customer", "vendor", "admin"], 
      default: "customer"}
    },

  { timestamps: true } );


//the model with mongoose
const User = mongoose.model('User', userSchema);

// export the model
module.exports = User;
