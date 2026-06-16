const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utills/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

const userController = require("../controllers/users.js");

// --- 1. Signup Route ("/signup") ---
router.route("/signup")
    .get(userController.renderSignupForm)
    .post(wrapAsync(userController.signup));

// --- 2. Login Route ("/login") ---
router.route("/login")
    .get(userController.renderLoginForm)
    .post(
        saveRedirectUrl,
        passport.authenticate("local", {
            failureFlash: true,
            failureRedirect: "/login",
        }),
        userController.login
    );

// --- 3. Logout Route ("/logout") ---
// Single request hai, toh ise chain karne ki zaroorat nahi hai
router.get("/logout", userController.logout);

module.exports = router;