const express = require("express");
const { authMiddleware } = require("../middlewares/authMiddleware");
const { default: axios } = require("axios");

const router = express.Router();


router.get("/", authMiddleware, async (req, res) => {

    const preferences = req.user?.preferences || [];

    if (!Array.isArray(preferences) || preferences.length === 0) {
        return res.status(400).json({ message: "User preferences not set." });
    }

    const stringifiedPreferences = preferences.join(" OR ");

    const news = [];

    try{
        const response = await axios.get(`https://gnews.io/api/v4/search?q=${stringifiedPreferences}&lang=en&country=us&max=10&apikey=${process.env.NEWS_API_KEY}`);
        news.push(...res.data.articles);
    } catch(error){
        console.error("Error fetching news:", error);
        return res.status(500).json({ message: "Error fetching news." });
    }

    return res.status(200).json({ news });
});



module.exports = {newsRoutes: router}
