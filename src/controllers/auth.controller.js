const oauth2Client = require("../config/google.config");
const { google } = require("googleapis");
const { setGoogleTokens } = require("../store/token.store")
// const { PrismaClient } = require("../config/prisma");
// const { prismaConfig } = require("../../prisma.config.ts")

const SCOPES = [
    "https://www.googleapis.com/auth/gmail.readonly"
];

// const prisma = new PrismaClient(prismaConfig);

// Step 1: Redirect user to Google login
const googleAuthUrl = (req, res) => {
    const url = oauth2Client.generateAuthUrl({
        access_type: "offline",
        scope: SCOPES
    });

    res.redirect(url);
};

// Step 2: Google redirects back here
const googleCallback = async (req, res) => {
    const code = req.query.code;

    if (!code) {
        return res.status(400).json({
            message: "Authorization code missing"
        });
    }

    try {
        // Exchange code for tokens
        const { tokens } = await oauth2Client.getToken(code);

        setGoogleTokens(tokens);

        oauth2Client.setCredentials(tokens);

        console.log(tokens);

        return res.json({
            message: "Google authentication successful",
            tokens
        });

    } catch (error) {
        return res.status(500).json({
            message: "Google authentication failed",
            error: error.message
        });
    }
};



module.exports = {
    googleAuthUrl,
    googleCallback, 
};

// const jwt = require("jsonwebtoken");


// const login = (req, res) => {
//     const { email } = req.body;

//     if (!email) {
//         return res.status(400).json({
//             message: "Email is required"
//         });
//     }

//     // A User payload
//     const user = {
//         id: Date.now(),
//         email
//     }

//     // Sign JWT
//     const token = jwt.sign(user, process.env.JWT_SECRET, {
//         expiresIn: "1h"
//     });

    
    
//     return res.json({
//         message: "Login successful",
//         user: {
//             email,
//             token
//         }
//         // console.log(token);
//     });
// };

// module.exports = { login };