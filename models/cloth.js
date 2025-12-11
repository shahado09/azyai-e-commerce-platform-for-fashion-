const mongoose= require('mongoose')

//schema
const clothSchema = new mongoose.Schema({
  name: { type: String, required: true },       
  sizes: [{ type: String, required: true }],        
  description: { type: String, required: true }, 
  images: [{ type: String, required: true }],                           
  isAvailable: { type: Boolean, default: true }  
})

// model
const Cloth = mongoose.model('Cloth', clothSchema)

module.exports = Cloth