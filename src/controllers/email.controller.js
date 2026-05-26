const gmailService = require("../services/gmail.service");

const getEmails = async (req, res) => {
    try {
        const emails = await gmailService.getEmails();

        return res.json({
            message: "Emails fetched successfully",
            count: emails.length,
            emails
        });

    } catch (error) {
        return res.status(500).json({
            message: "Failed to fetch emails",
            error: error.message
        });
    }
    console.log("Fetching emails...");
};

module.exports = { getEmails };


// const getEmails = (req, res) => {
//     return res.json({
//         message: "Protected emails fetched successfully",
//         user: req.user,
//         emails: [
//             {
//                 id: 1,
//                 subject: "Welcome to Email Cleaner"
//             },
//             {
//                 id: 2,
//                 subject: "Your Weekly Newsletter"
//             }
//         ]
//     });
// };

// module.exports = { getEmails };