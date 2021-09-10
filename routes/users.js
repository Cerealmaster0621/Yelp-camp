const User = require("./../models/user");
const express = require("express");
const wrapAsync = require("./../utils/CatchAsync");
const router = express.Router();
const passport = require("passport");
const { renderRegister, register, renderLogin, login, logout } = require("../controller/user");



router.get("/logout", logout);

router.route('/register')
    .get(renderRegister)
    .post(wrapAsync(register));

router.route('/login')
    .get(renderLogin)
    .post(passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
}),login);

module.exports = router;
