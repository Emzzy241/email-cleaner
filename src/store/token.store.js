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