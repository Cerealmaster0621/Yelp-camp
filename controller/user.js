const User = require('../models//user');

//GET register user
module.exports.renderRegister = (req, res) => {
    res.render("users/register");
}
//POST register user
module.exports.register = async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email: email, username: username });
        const newUser = await User.register(user, password);
        req.login(newUser, err=>{
            if (err) return next(err);
            const ogUrl = req.session.returnTo || '/campgrounds';
            delete req.session.returnTo;
            req.flash("success", "Welcome to the Yelp-Camp!");
            res.redirect(ogUrl);
        })
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/register");
    }
}
//GET login
module.exports.renderLogin =  (req, res) => {
    res.render("users/login");
}
//POST login
module.exports.login = (req, res) => {
    const ogUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    req.flash("success", "welcome back!");
    res.redirect(ogUrl);
}
//GET login
module.exports.logout = (req, res) => {
    req.logout();
    req.flash("success", "Goodbye!");
    res.redirect('/campgrounds');
}