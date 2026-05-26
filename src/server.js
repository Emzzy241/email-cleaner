require("dotenv").config();

const app = require("./app.js");

const PORT = process.env.PORT || 3004;

app.listen(PORT, () => {
    console.log(`Server running at port ${PORT}`);
});