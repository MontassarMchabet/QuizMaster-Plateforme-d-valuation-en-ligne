const User = require('../model/user')
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken');
const { join } = require("path")
const nodemailer = require("nodemailer")
const sendEmail = require('./nodemailer');
JWT_SECRET="0cd1070210be0c64a0fb1973ee64600b115a09004c0a40de2d1b89d574efa2ef88461b61417b28a86d2c07b95601141f0c51baafae44c098e7452f1cf403c161"
REFRESH_TOKEN_SECRET="0a559ab55bff2b54cb5f29fc30c1d616e7bf8ffd614e09b036920a98844b19450bc06865f86d35a9f1ef6894ed235c888a1ef5752662264331ca7a27c68a0e05"
const registerClient = async (req, res) => {
    const { fullName, email, password, dateOfBirth, role } = req.body;

    if (!email || !password) {
        return res.status(400).send('Email et mot de passe sont requis');
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            fullName,
            email,
            password: hashedPassword,
            dateOfBirth,
            role
        });

        await user.save();

        if (role === 'client') {
            // Génération du jeton pour vérification de l'email
            const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
            const verificationLink = `http://localhost:5000/auth/verify-email?token=${token}`;
            const data = {
                to: email,
                subject: 'Vérification de l’email',
                text: `Cliquez sur le lien suivant pour vérifier votre adresse e-mail : ${verificationLink}`
            };
            await sendEmail(data, req, res);

            res.status(201).send('Utilisateur créé, veuillez vérifier votre e-mail.');
        } else if (role === 'prof') {
            // Envoi d'un e-mail pour informer de l'attente d'acceptation
            const data = {
                to: email,
                subject: 'Compte en attente d\'acceptation',
                text: `Bonjour ${fullName},\n\nVotre compte a été créé avec succès, mais il est en attente d'acceptation par un administrateur. Vous serez informé une fois que votre compte sera activé.\n\nMerci pour votre patience.`
            };
            await sendEmail(data, req, res);

            res.status(201).send('Utilisateur créé avec succès, veuillez attendre l\'acceptation de l\'admin.');
        } else {
            // Gestion d'autres rôles ou de l'absence de rôle
            res.status(201).send('Utilisateur créé avec succès.');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur lors de la création de l’utilisateur');
    }
};

const sendVerificationMail = async (req, res) => {
    const { token } = req.query;

    if (!token) {
        return res.status(400).send('Token manquant');
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(404).send('Utilisateur non trouvé');
        }

        user.verified = true;
        await user.save();

        res.redirect('http://localhost:3000/signin');
    } catch (error) {
        console.error(error);
        res.status(400).send('Token invalide ou expiré');
    }
   
}

const loginWithEmail = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email et mot de passe sont requis' });
    }

    try {
        // Recherche de l'utilisateur par email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
        }

        // Comparaison du mot de passe fourni avec le mot de passe haché stocké
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
        }

        // Vérification si l'utilisateur est vérifié
        if (!user.verified) {
            return res.status(403).json({ error: 'Veuillez vérifier votre email avant de vous connecter' });
        }

        // Génération d'un jeton JWT
        const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
        const refreshToken = jwt.sign({ userId: user._id, role: user.role }, REFRESH_TOKEN_SECRET, { expiresIn: '4h' });
        res.status(200).json({ message: 'Connexion réussie', token, refreshToken });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur lors de la connexion' });
    }
};

const VerifyRefreshToken = async (req, res) => {
    const refreshToken = req.body.refreshToken;
    if (!refreshToken) {
        return res.status(401).json({ message: 'Refresh token is required' });
    }
    try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const accessToken = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '10m' }
        );

        res.status(200).json({ newToken: accessToken });
    } catch (error) {
        console.error('Error refreshing token:', error);
        res.status(500).json({ message: 'Error refreshing token' });
    }
};
const updateetudiant = (async (req, res) => {
    try {
        // Si un fichier a été téléchargé, on ajoute le chemin du fichier à la requête
        if (req.file) {
          req.body.profilePicture = req.file.filename; // Stocke le chemin relatif du fichier
        }
    
        // Mettre à jour l'utilisateur dans la base de données
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    
        // Retourner l'utilisateur mis à jour
        res.status(200).json(user);
      } catch (err) {
        console.error('Erreur lors de la mise à jour de l\'utilisateur', err);
        res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'utilisateur' });
      }
})
module.exports = { registerClient, sendVerificationMail,loginWithEmail,VerifyRefreshToken,updateetudiant }