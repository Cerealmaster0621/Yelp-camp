const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const morgan = require("morgan");
const engine = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const campgroundsRoutes = require("./routes/campgrounds");
const reviewsRoutes = require("./routes/reviews");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
const usersRoutes = require("./routes/users");
const date = new Date();
const { isLoggedIn,serverSideValidation,isAuthor} = require("./middleware");
if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}

console.log(process.env.VAR);
console.log(process.env.API_KEY);

const app = express();
app.set("views", path.join(__dirname, "views"));
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.use(flash());

//mongoose
mongoose.connect("mongodb://localhost:27017/yelp-camp", {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
    console.log("Db connected");
});

//ejs
app.set("view engine", "ejs");
app.engine("ejs", engine);

//session
const sessionConfig = {
    secret: "secretcode",
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: date.setTime(date.getTime() + 7 * 24 * 60 * 60 * 1000),
        maxAge: 7 * 24 * 60 * 60 * 1000,
    },
};

//elaborate passport AFTER SESSION
app.use(session(sessionConfig));

//passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//flash
app.use((req, res, next) => {
    //set success as a global variable
    //currentUser AFTER PASSPORT
    res.locals.currentUser = req.user;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

//Routers
app.use("/campgrounds", campgroundsRoutes);
app.use("/campgrounds/:id/reviews", reviewsRoutes);
app.use("/", usersRoutes);

//404 error handling
app.all("*", (req, res, next) => {
    next(new ExpressError("Page Not Found", 404));
});
//error handling in general
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Oh no! something got wrong";
  res.status(statusCode).render("error", { err });
});

app.listen(3000, () => {
  console.log("Serving on port 3000");
});
