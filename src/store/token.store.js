let googleTokens = null;

const setGoogleTokens = (tokens) => {
    googleTokens = tokens;
};

const getGoogleTokens = () => {
    return googleTokens;
};

module.exports = {
    setGoogleTokens,
    getGoogleTokens
};

// Final Test for the token store: 30/05/2027... Time: 17:57,
// Moving to Persistence with PostgreSQL database.