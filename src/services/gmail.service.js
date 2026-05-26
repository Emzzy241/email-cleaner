const { google } = require("googleapis");
const oauth2Client = require("../config/google.config");
const { getGoogleTokens } = require("../store/token.store")

// Get Gmail instance with auth
// const getGmailClient = () => {
//     return google.gmail({
//         version: "v1",
//         auth: oauth2Client
//     });
// };


const getGmailClient = () => {

    const tokens = getGoogleTokens();

    if (!tokens) {
        throw new Error(
            "Authenticate with Google first."
        );
    }

    oauth2Client.setCredentials(tokens);

    return google.gmail({
        version: "v1",
        auth: oauth2Client
    });
};

const getEmailList = async () => {
   
    const gmail = getGmailClient();

    const response = await gmail.users.messages.list({
        userId: "me",
        maxResults: 10
    });

    return response.data.messages || [];
};

const getEmailById = async (messageId) => {
    const gmail = getGmailClient();

    const response = await gmail.users.messages.get({
        userId: "me",
        id: messageId,
        format: "full"
    });

    return response.data;
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

const getEmails = async () => {
    const messages = await getEmailList();

    const fullEmails = await Promise.all(
        messages.map(msg => getEmailById(msg.id))
    );

    return fullEmails.map(parseEmail);
};

console.log("Google tokens loaded");

module.exports = {
    getEmails
};