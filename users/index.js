const express = require("express");
const {userSignupSchema, userSigninSchema, updatePreferencesSchema} = require("../types");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { authMiddleware } = require("../middlewares/authMiddleware");
const User = require("../models/User");

const router = express.Router()

router.post("/signup", async (req, res) => {
    const body = req.body;

    const parsedBody = userSignupSchema.safeParse(body);

    if(!parsedBody.success){
        return res.status(400).json({
            message: "Invalid inputs."
        });
    }

    
    try{
        const existingUser = await User.findOne({ email: body.email });

        if (existingUser) {
            return res.status(400).json({ message: "Email already in use." });
        }

        const hashedPassword = await bcrypt.hash(body.password, 10);

        await User.create({
            email: body.email,
            password: hashedPassword,
            name: body.name,
            preferences: body.preferences
        });

        return res.status(200).json({
            message: "User created successfully."
        });

    } catch(err){
        console.log(err);
        return res.status(500).json({
            message: "Internal server error."
        });
    }


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

    try{
        const user = await User.findOne({ email: body.email });

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
            name: user.name,
            preferences: user.preferences
        };
    
        const jwt_token = jwt.sign(payload, process.env.JWT_SECRET);
    
        return res.status(200).json({
            token: jwt_token
        });
    }catch(err){
        console.log(err);
        return res.status(500).json({
            message: "Internal server error."
        });
    }
});

router.get("/preferences", authMiddleware, async (req, res) => {
    const userId = req.user.id;

    try{
        const user = await User.findById(userId);
        
        if(!user){
            return res.status(404).json({
                message: "User not found"
            });
        }

        return res.status(200).json({
            preferences: user.preferences
        });
    } catch(err){
        console.log(err);
        return res.status(500).json({
            message: "Internal server error."
        });
    }
});

router.put("/preferences", authMiddleware, async (req, res) => {
    const userId = req.user.id;
    const body = req.body;
    
    const parsedBody = updatePreferencesSchema.safeParse(body);

    if(!parsedBody.success){
        return res.status(400).json({
            message: "Invalid inputs."
        });
    }

    try{
        const user = await User.findById(userId);
        
        if(!user){
            return res.status(404).json({
                message: "User not found"
            });
        }
        user.preferences = body.preferences;

        await user.save();

        return res.status(200).json({
            message: "Preferences updated successfully."
        });
    } catch(err){
        console.log(err);
        return res.status(500).json({
            message: "Internal server error."
        });
    }
});

module.exports = {userRoutes: router}