const shouldDeleteEmail = (email) => {

    const autoDeleteCategories = [
        "PROMOTIONAL",
        "POSSIBLE_SPAM"
    ];

    return autoDeleteCategories.includes(
        email.classification
    );
};

const shouldProtectEmail = (email) => {

    const protectedCategories = [
        "IMPORTANT",
        "JOBS"
    ];

    return protectedCategories.includes(
        email.classification
    );
};

module.exports = {
    shouldDeleteEmail,
    shouldProtectEmail
};