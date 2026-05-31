const prisma = require("../config/prisma");

const devTestDbConnection = async (req, res) => {
    try {
        // console.log(prisma);
        // console.log(prisma.user);
        const users = await prisma.user.findMany();

        return res.json({
            message: "Database connection successful",
            users
        });

    } catch (error) {
        return res.status(500).json({
            message: "Database error",
            error: error.message
        });
    }
}

module.exports = devTestDbConnection;