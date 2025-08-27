require("dotenv").config(); // Load environment variables
const mongoose = require("mongoose");

class Database {
  constructor() {
    this._connect();
  }

  //connect to mongoDB
  _connect() {
    if (!Database.instance) {
      mongoose
        .connect(process.env.MONGO_URI, {})
        .then(() => {
          console.log("Database connected successfully");
        })
        .catch((err) => {
          console.error("Database connection error:", err);
        });

      Database.instance = this;
    }

    return Database.instance;
  }
}

module.exports = new Database(); // Export a single instance of the Database
