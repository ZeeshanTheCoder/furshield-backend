const { configDotenv } = require("dotenv");
const mongoose = require("mongoose");
configDotenv();

const db_Connection = async () => {
    try {
        await mongoose.connect(process.env.MONGO_DB_STRING, {
            // dbName: "petsCare"
        });
        console.log("Database Connected Successfully");
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = db_Connection;