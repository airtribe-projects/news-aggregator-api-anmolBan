const zod = require("zod");

const userSignupSchema = zod.object({
    name: zod.string().min(3),
    email: zod.email(),
    password: zod.string(),
    preferences: zod.array(zod.string())
});

const userSigninSchema = zod.object({
    email: zod.email(),
    password: zod.string()
});

const updatePreferencesSchema = zod.object({
    preferences: zod.array(zod.string())
});

module.exports = {userSignupSchema, userSigninSchema, updatePreferencesSchema};