const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            message: "No authorization header provided"
        });
    }

    const token = authHeader.split(" ")[1];
    // console.log(token);

    if (!token) {
        return res.status(401).json({
            message: "Invalid token format"
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // console.log(decoded);

        req.user = decoded;

        next();

    } catch (err) {
        return res.status(401).json({
            message: "invalid or expired jwt"
        })
    }

};

module.exports = authMiddleware;