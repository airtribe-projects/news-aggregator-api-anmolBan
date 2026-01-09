const express = require('express');
const dotenv = require('dotenv');
const { userRoutes } = require('./users');
const { newsRoutes } = require('./news');
const connectDB = require("./config/db");

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/users", userRoutes);
app.use("/news", newsRoutes);

app.listen(port, (err) => {
    if (err) {
        return console.log('Something bad happened', err);
    }
    console.log(`Server is listening on ${port}`);
});



module.exports = app;