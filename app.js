const express = require('express');
const dotenv = require('dotenv');
const { userRoutes } = require('./users');
const { newsRoutes } = require('./news');
const connectDB = require("./config/db");

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/users", userRoutes);
app.use("/news", newsRoutes);

async function startServer() {
    try {
        await connectDB();
        app.listen(port, (err) => {
            if (err) {
                return console.log('Something bad happened', err);
            }
            console.log(`Server is listening on ${port}`);
        });
    } catch (err) {
        console.error('Failed to connect to database:', err);
        // Gracefully handle error: do not exit, just log and do not start server
        // Optionally, implement retry logic here if desired
    }
}

startServer();

module.exports = app;