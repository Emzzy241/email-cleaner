const classifyEmail = (email) => {

    const subject = (email.subject || "").toLowerCase();
    const sender = (email.sender || "").toLowerCase();
    const snippet = (email.snippet || "").toLowerCase();

    const combinedText =
        `${subject} ${sender} ${snippet}`;

    // Promotional indicators
    const promoKeywords = [
        "discount",
        "sale",
        "offer",
        "promo",
        "limited time",
        "deal",
        "coupon",
        "gifts",
        "your purchases will release",
        "turn your savings into extra cash"
    ];

    // Social indicators
    const socialKeywords = [
        "facebook",
        "linkedin",
        "instagram",
        "twitter",
        "notification"
    ];

    // Spam indicators
    const spamKeywords = [
        "win money",
        "urgent",
        "claim now",
        "lottery",
        "crypto giveaway",
        "free cash"
    ];

    const jobKeywords = [
        "developer",
        "remote",
        "job",
        "jobs",
        "role",
        "more jobs"
    ]

    if (
        spamKeywords.some(
            keyword => combinedText.includes(keyword)
        )
    ) {
        return "POSSIBLE_SPAM";
    }

    if (
        promoKeywords.some(
            keyword => combinedText.includes(keyword)
        )
    ) {
        return "PROMOTIONAL";
    }

    if (
        socialKeywords.some(
            keyword => combinedText.includes(keyword)
        )
    ) {
        return "SOCIAL";
    }
    
    if (
        jobKeywords.some(
            keyword => combinedText.includes(keyword)
        )
    ) {
        return "JOBS";
    }

    if (
        sender.includes("university") ||
        sender.includes("work") ||
        sender.includes("github")
    ) {
        return "IMPORTANT";
    }

    return "GENERAL";
};

module.exports = {
    classifyEmail
};