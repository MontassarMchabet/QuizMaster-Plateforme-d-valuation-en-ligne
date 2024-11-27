const admin = require('../model/admin')
const nodemailer = require("nodemailer")
const bcrypt = require('bcrypt')
const User = require('../model/user')
const Joi=require('joi')
const sendEmail = require('./nodemailer');
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
const createadmin = (async (req, res) => {
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
    const newadmin = new admin({
        ...req.body, password: hashpassword,
        codeverify: code
        //au lieu de req.body et les ... pour le reste des attributs
    })
    console.log(newadmin)
    await newadmin.save(req.body, (err, item) => {
        if (err) {
            res.status(400).json({
                message: "erreur",
             
                data:err
            })
            console.log(err)
        }
        else {
            transport.sendMail({
                from: "admin@gmail.com",
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

const getUnverifiedProfs = async (req, res) => {
    try {
        
        const unverifiedProfs = await User.find({ role: 'prof', verified: false });

       

        res.status(200).json(unverifiedProfs);
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur lors de la récupération des professeurs non vérifiés.');
    }
};
const getverifiedProfs = async (req, res) => {
    try {
        
        const verifiedProfs = await User.find({ role: 'prof', verified: true });

      
        res.status(200).json(verifiedProfs);
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur lors de la récupération des professeurs  vérifiés.');
    }
};
const getverifiedclients = async (req, res) => {
    try {
        
        const verifiedProfs = await User.find({ role: 'client', verified: true });

      
        res.status(200).json(verifiedProfs);
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur lors de la récupération des client vérifiés.');
    }
};
const getUserById = async (req, res) => {
    try {
        const userId = req.params.userId;
       

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user by ID:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
const updateTeacherVerification = async (req, res) => {
    const teacherId = req.params.id;

    try {
        // Trouver l'utilisateur par ID
        const teacher = await User.findById(teacherId);

        if (!teacher) {
            return res.status(404).json({ message: 'Enseignant non trouvé' });
        }

        // Mettre à jour le statut de vérification
        teacher.verified = true;
        await teacher.save();

        // Préparer les données pour l'email
        const data = {
            to: teacher.email, // Utilisation de l'email de l'enseignant
            subject: 'Acceptation de compte',
            text: `Bonjour ${teacher.fullName},\n\nVotre compte a été accepté avec succès. Vous pouvez maintenant vous connecter.\n\nCordialement,\nL'équipe support.`
        };

        // Envoyer l'email
        await sendEmail(data, req, res);

        res.status(200).json({ message: 'Statut de vérification mis à jour avec succès' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la mise à jour du statut de vérification' });
    }
};

module.exports = { createadmin,getUnverifiedProfs,getverifiedProfs,getverifiedclients,getUserById,updateTeacherVerification }