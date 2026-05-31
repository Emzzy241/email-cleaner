const { google } = require("googleapis");
const oauth2Client = require("../config/google.config");
const { getGoogleTokens } = require("../store/token.store");
const prisma = require("../config/prisma");
const { classifyEmail } = require("./classification.service");
const { shouldDeleteEmail, shouldProtectEmail } = require("./cleanup.service");

// Get Gmail instance with oauth
// const getGmailClient = () => {
//     return google.gmail({
//         version: "v1",
//         auth: oauth2Client
//     });
// };

// With persistence layer from the database
const getGmailClient = async (userId) => {

    const tokenRecord = await prisma.oAuthToken.findFirst({
        where: { userId, provider: "google" },
        orderBy: { createdAt: "desc" }
    });

    console.log(tokenRecord);
    if (!tokenRecord) {
        throw new Error("No Google tokens found. Please login again.");
    }


    oauth2Client.setCredentials({
        access_token: tokenRecord.accessToken,
        refresh_token: tokenRecord.refreshToken,
        expiry_date: tokenRecord.expiryDate
    });

    return google.gmail({
        version: "v1",
        auth: oauth2Client
    });
};
// Without Database: in-memory storage
// const getGmailClient = () => {

//     const tokens = getGoogleTokens();

//     if (!tokens) {
//         throw new Error(
//             "Authenticate with Google first."
//         );
//     }

//     oauth2Client.setCredentials(tokens);

//     return google.gmail({
//         version: "v1",
//         auth: oauth2Client
//     });
// };

const getEmailList = async () => {

    const gmail = getGmailClient();

    const response = await gmail.users.messages.list({
        userId: "me",
        maxResults: 10
    });

    return response.data.messages || [];
};

// const getEmailById = async (messageId) => {
//     const gmail = getGmailClient();

//     // const response = await gmail.users.messages.get({
//     //     userId: "me",
//     //     id: messageId,
//     //     format: "full"
//     // });

//     const fullEmails = await Promise.all(
//         messages.map(async (msg) => {
//             const email = await gmail.users.messages.get({
//                 userId: "me",
//                 id: msg.id
//             });

//             return email.data;
//         })
//     );

//     const getHeader = (headers, name) =>
//         headers.find(h => h.name === name)?.value;

//     const simplified = fullEmails.map(email => {
//         const headers = email.payload.headers;

//         return {
//             id: email.id,
//             subject: getHeader(headers, "Subject"),
//             sender: getHeader(headers, "From"),
//             snippet: email.snippet,
//             internalDate: email.internalDate
//         };
//     });

//     return response.data;
// };

const getEmailById = async (messageId) => {
    const gmail = await getGmailClient();

    const response = await gmail.users.messages.get({
        userId: "me",
        id: messageId,
        format: "full"
    });

    const email = response.data;

    const headers = email.payload.headers;

    const getHeader = (name) =>
        headers.find(h => h.name === name)?.value;

    return {
        id: email.id,
        subject: getHeader("Subject"),
        sender: getHeader("From"),
        snippet: email.snippet,
        internalDate: email.internalDate
    };
};

const getEmails = async (messages, gmail) => {

    // const gmail = await getGmailClient();

    const fullEmails = await Promise.all(
        messages.map(async (msg) => {
            const email = await gmail.users.messages.get({
                userId: "me",
                id: msg.id,
                format: "full"
            });

            const headers = email.data.payload.headers;

            const getHeader = (name) =>
                headers.find(h => h.name === name)?.value;

            const emailObject = {
                id: email.data.id,
                subject: getHeader("Subject"),
                sender: getHeader("From"),
                snippet: email.data.snippet,
                internalDate: email.data.internalDate
            };

            emailObject.classification = classifyEmail(emailObject);
            emailObject.recommendedAction =
                shouldDeleteEmail(emailObject)
                    ? "DELETE" :
                    shouldProtectEmail(emailObject)
                        ? "KEEP" : "REVIEW";

            return emailObject;
        })
    );

    return fullEmails;
};

const deleteEmail = async (messageId, gmail) => {

    await gmail.users.messages.trash({
        userId: "me",
        id: messageId
    });

    return true;
};

const parseEmail = (message) => {
    const headers = message.payload.headers;

    const getHeader = (name) =>
        headers.find(h => h.name === name)?.value;

    return {
        id: message.id,
        subject: getHeader("Subject"),
        from: getHeader("From"),
        date: getHeader("Date"),
        snippet: message.snippet
    };
};

// const getEmails = async () => {
//     const messages = await getEmailList();

//     const fullEmails = await Promise.all(
//         messages.map(msg => getEmailById(msg.id))
//     );

//     return fullEmails.map(parseEmail);
// };

console.log("Google tokens loaded");

module.exports = {
    getEmails,
    getGmailClient,
    deleteEmail
};