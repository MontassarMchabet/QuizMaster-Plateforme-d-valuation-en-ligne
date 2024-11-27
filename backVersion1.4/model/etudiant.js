const mongoose=require('mongoose')
const userModel=require('./user')

const etudiantSchema=new mongoose.Schema({
    Answer: { type: String },

})
userModel.discriminator('etudiant',etudiantSchema)
module.exports=mongoose.model('etudiant')