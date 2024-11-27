const nodemailer = require("nodemailer");
const asyncHandler = require('express-async-handler');

const sendEmail = asyncHandler(async (data, req, res) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          
            user: 'elkindyconservatory@gmail.com', // Remplacez par votre adresse email
            pass: 'akgt bkvh mzhf uvzf'
        },
    });


    const info = await transporter.sendMail({
        from: '"Hey 👻"',
        to: data.to,
        subject: data.subject,
        text: data.text,
    
    });
});

module.exports = sendEmail;
