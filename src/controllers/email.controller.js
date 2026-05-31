const gmailService = require("../services/gmail.service");

const getEmails = async (req, res) => {
    try {
        const userId = req.user?.id || 1; // temporary fallback

        // 1. Get Gmail client (already DB-backed + OAuth handled)
        const gmail = await gmailService.getGmailClient(userId);

        // 2. Fetch message IDs
        const response = await gmail.users.messages.list({
            userId: "me",
            maxResults: 10
        });

        const messages = response.data.messages || [];

        // 3. Transform into FULL email objects using your service
        const emails = await gmailService.getEmails(messages, gmail);

        return res.json({
            message: "Emails fetched successfully",
            count: emails.length,
            messages: emails
        });

    } catch (error) {
        return res.status(500).json({
            message: "Failed to fetch emails",
            error: error.message
        });
    }
};

module.exports = { getEmails };

// const gmailService = require("../services/gmail.service");

// const getEmails = async (req, res) => {
//     try {
//         const userId = req.user?.id || 1; // temporary fallback

//         const gmail = await gmailService.getGmailClient(userId);

//         const response = await gmail.users.messages.list({
//             userId: "me",
//             maxResults: 10
//         });

//         const messages = response.data.messages || [];

//         return res.json({
//             message: "Emails fetched successfully",
//             count: messages.length,
//             messages
//         });

//     } catch (error) {
//         return res.status(500).json({
//             message: "Failed to fetch emails",
//             error: error.message
//         });
//     }
// };

// module.exports = { getEmails };


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