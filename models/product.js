const mongoose= require('mongoose')

//schema
const clothSchema = new mongoose.Schema({
  name: { type: String, required: true },       
  size: { type: String, required: true },       
  description: { type: String, required: true }, 
  image: String,                                
  isAvailable: { type: Boolean, default: true }  
})

// model
const Cloth = mongoose.model('Cloth', clothSchema)

module.exports = Cloth