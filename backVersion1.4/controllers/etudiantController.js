const etudiant = require('../model/etudiant')
const nodemailer = require("nodemailer")
const bcrypt = require('bcrypt')
const User = require('../model/user')
const Joi=require('joi')
//generation du code avec la fct randomBytes dans la biblio crypto
const { randomBytes } = require("crypto")
const { error } = require('console')
const code = randomBytes(6).toString("hex")

var transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "9d056b85673da5",
      pass: "822368ce3b2d2c"
    }
  });
const createetudiant = (async (req, res) => {
    const schema = Joi.object({
        name: Joi.string().min(6).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
 
    });
    const { error, value } = schema.validate(req.body);
    if(error){return res.status(400).json({error:error.details[0].message})} 
    
    try {
        const salt = await bcrypt.genSalt(10)
    const hashpassword = await bcrypt.hash(req.body.password, salt)
    const newetudiant = new etudiant({
        ...req.body, password: hashpassword,
        codeverify: code
        //au lieu de req.body et les ... pour le reste des attributs
    })
    console.log(newetudiant)
    await newetudiant.save(req.body, (err, item) => {
        if (err) {
            res.status(400).json({
                message: "erreur",
             
                data:err
            })
            console.log(err)
        }
        else {
            transport.sendMail({
                from: "etudiant@gmail.com",
                to: item.email,
                subject: "hello" + item.name,
                text: "mail de confirmation",
                html: `<!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta http-equiv="X-UA-Compatible" content="IE=edge">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Document</title>
                </head>
                <body>
                    <h1>verify account</h1>
                    <a href="http://localhost:8080/auth/verify/${item.codeverify}">click here </a>
                </body>
                </html>`
            })
            res.status(201).json({
                message:"success",
                data:item     
        })
    }
    })
    } catch (error) {
        res.status(400).json({
            error:error.message
        })
        
    }
})

const getetudiants = (async (req, res) => {
    const adm = await etudiant.find()
    res.status(200).json({
        message: "list of etudiants",
        data: adm
    })
})

const getAdmByID = (async (req, res) => {
    try {
        const adm = await etudiant.findOne({ _id: req.params.id })
       res.status(200).json({
        data: adm
      })
    } catch (error) {
        res.status(400).json({
            data: null
        })
    }
})

const deleteetudiant = (async (req, res) => {
    const adm = await etudiant.deleteOne({ _id: req.params.id })

    res.status(200).json({
        message: 'etudiant deleted'
    })

})


module.exports = { createetudiant, getAdmByID, getetudiants, deleteetudiant }