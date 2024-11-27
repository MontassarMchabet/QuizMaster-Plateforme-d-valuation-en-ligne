const route = require("express").Router()
const admin=require('../controllers/adminController')
route.post('/',admin.createadmin)

module.exports=route