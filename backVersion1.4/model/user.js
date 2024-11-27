 


const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const baseOption = {
    discriminatorKey: "itemtypes"
};

const userSchema = new mongoose.Schema({
    fullName: {
        type: String
    },
    email: {
        type: String,
        required: true,
   
    },
    dateOfBirth: {
        type: Date,
    }
    ,
    password: {
        type: String,
        required: true
    },
   
    verified: {
        type: Boolean,
        default: false
    },
    resetpass: {
        type: String
    },
    profilePicture: {
        type: String
    },
    
    role: {
        type: String,
        enum: ['admin', 'prof', 'client']
       
        }
}, baseOption);

 
module.exports = mongoose.model('User', userSchema);



