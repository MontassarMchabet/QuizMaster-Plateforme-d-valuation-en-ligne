const mongoose=require('mongoose')
const userModel=require('./user')

const adminSchema=new mongoose.Schema({
    

})
userModel.discriminator('admin',adminSchema)
module.exports=mongoose.model('admin')