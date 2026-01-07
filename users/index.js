const express = require("express");
const {userSignupSchema, userSigninSchema, updatePreferencesSchema} = require("../types");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { authMiddleware } = require("../middlewares/authMiddleware");

const router = express.Router()

const users = [];

router.post("/signup", async (req, res) => {
    const body = req.body;

    const parsedBody = userSignupSchema.safeParse(body);

    if(!parsedBody.success){
       return res.status(400).json({
           message: "Invalid inputs."
       });
    }

    const hashedPassword = await bcrypt.hash(body.password, 10);

    const localUser = {
        id: Math.random().toString(36).substr(2, 9), // Generate a unique ID
        email: body.email,
        password: hashedPassword,
        name: body.name,
        preferences: body.preferences
    }
    users.push(localUser);

    return res.status(200).json({
        message: "User created successfully."
    });

});

router.post("/login", async (req, res) => {
    const body = req.body;

    const parsedBody = userSigninSchema.safeParse(body);

    if(!parsedBody.success){
        console.log("Invalid inputs");
        return res.status(400).json({
            message: "Invalid inputs"
        });
    }

    const user = users.find(u => u.email === body.email);

    if(!user){
        return res.status(401).json({
            message: "Invalid email id."
        });
    }

    const passwordMatch = await bcrypt.compare(body.password, user.password);

    if(!passwordMatch){
        return res.status(401).json({
            message: "Invalid password."
        });
    }

    const payload = {
        id: user.id,
        email: user.email,
        name: user.name
    };

    const jwt_token = jwt.sign(payload, process.env.JWT_SECRET);

    return res.status(200).json({
        token: jwt_token
    });

});

router.get("/preferences", authMiddleware, (req, res) => {
    const userId = req.user.id;

    const user = users.find(u => u.id === userId);

    if(!user){
        return res.status(404).json({
            message: "User not found"
        });
    }

    return res.status(200).json({
        preferences: user.preferences
    });
});

router.put("/preferences", authMiddleware, (req, res) => {
    const userId = req.user.id;
    const body = req.body;
    
    const parsedBody = updatePreferencesSchema.safeParse(body);

    if(!parsedBody.success){
        return res.status(400).json({
            message: "Invalid inputs."
        });
    }

    const userIndex = users.findIndex(u => u.id === userId);

    if(userIndex === -1){
        return res.status(404).json({
            message: "User not found"
        });
    }

    users[userIndex].preferences = body.preferences;

    return res.status(200).json({
        message: "Preferences updated successfully."
    });
})

module.exports = {userRoutes: router}