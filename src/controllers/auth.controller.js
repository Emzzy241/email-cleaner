// Using PostgreSQL for persistence of google tokens
const prisma = require("../config/prisma");
const oauth2Client = require("../config/google.config");


const SCOPES = [
    "openid",
    "https://www.googleapis.com/auth/gmail.readonly",
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/userinfo.profile"
];

const googleAuthUrl = (req, res) => {
    const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: SCOPES
});

    res.redirect(url);
};

const googleCallback = async (req, res) => {
    const code = req.query.code;
    console.log(`The code value from google ${code}`);

    if (!code) {
        return res.status(400).json({
            message: "Authorization code missing"
        });
    }

    try {
        const { tokens } = await oauth2Client.getToken(code);
        console.log(`What google actually returned, the tokens value ${tokens}`);
        console.log("CODE:", code);

console.log("TOKENS:", tokens);

console.log("ACCESS TOKEN:", tokens.access_token);

console.log("REFRESH TOKEN:", tokens.refresh_token);

        oauth2Client.setCredentials(tokens);

        console.log(
    "CLIENT CREDENTIALS:",
    oauth2Client.credentials
);

        // 1. Get user info from Google (important step)
        const oauth2 = require("googleapis").google.oauth2({
            auth: oauth2Client,
            version: "v2"
        });

        const userInfo = await oauth2.userinfo.get();
//         try {

//     const userInfo = await oauth2.userinfo.get();

//     console.log(userInfo.data);

// } catch(error) {

//     console.log(
//         error.response?.data ||
//         error.message ||
//         error
//     );

    // throw error;
// }

        const email = userInfo.data.email;
        const googleId = userInfo.data.id;

        // 2. Find or create user
        let user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            user = await prisma.user.create({
                data: {
                    email,
                    googleId
                }
            });
        }

        // 3. Save OAuth tokens in DB
        await prisma.oAuthToken.create({
            data: {
                accessToken: tokens.access_token,
                refreshToken: tokens.refresh_token,
                expiryDate: tokens.expiry_date,
                provider: "google",
                userId: user.id
            }
        });

        return res.json({
            message: "Google authentication successful",
            user
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
    googleCallback
};


// Using an in-memory for storage of Google Tokens
// const oauth2Client = require("../config/google.config");
// const { google } = require("googleapis");
// const { setGoogleTokens } = require("../store/token.store")

// const SCOPES = [
//     "https://www.googleapis.com/auth/gmail.readonly"
// ];

// // Step 1: Redirect user to Google login
// const googleAuthUrl = (req, res) => {
//     const url = oauth2Client.generateAuthUrl({
//         access_type: "offline",
//         scope: SCOPES
//     });

//     res.redirect(url);
// };

// // Step 2: Google redirects back here
// const googleCallback = async (req, res) => {
//     const code = req.query.code;

//     if (!code) {
//         return res.status(400).json({
//             message: "Authorization code missing"
//         });
//     }

//     try {
//         // Exchange code for tokens
//         const { tokens } = await oauth2Client.getToken(code);

//         setGoogleTokens(tokens);

//         oauth2Client.setCredentials(tokens);

//         console.log(tokens);

//         return res.json({
//             message: "Google authentication successful",
//             tokens
//         });

//     } catch (error) {
//         return res.status(500).json({
//             message: "Google authentication failed",
//             error: error.message
//         });
//     }
// };



// module.exports = {
//     googleAuthUrl,
//     googleCallback, 
// };

// // const jwt = require("jsonwebtoken");


// // const login = (req, res) => {
// //     const { email } = req.body;

// //     if (!email) {
// //         return res.status(400).json({
// //             message: "Email is required"
// //         });
// //     }

// //     // A User payload
// //     const user = {
// //         id: Date.now(),
// //         email
// //     }

// //     // Sign JWT
// //     const token = jwt.sign(user, process.env.JWT_SECRET, {
// //         expiresIn: "1h"
// //     });

    
    
// //     return res.json({
// //         message: "Login successful",
// //         user: {
// //             email,
// //             token
// //         }
// //         // console.log(token);
// //     });
// // };

// // module.exports = { login };