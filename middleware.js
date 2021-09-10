const ExpressError = require("./utils/ExpressError");
const {campgroundSchema ,reviewSchema } = require('./schema');
const Campground = require('./models/campground');
const Review = require('./models/review');

module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl;
        req.flash('error','You must be signed in first!');
        return res.redirect('/login');
    }
    next();
}

module.exports.serverSideValidation = (req, res, next) => {
    //schema for Joi, serverside validation
    // const campgroundSchema = Joi.object({
    //     campground: Joi.object({
    //         title : Joi.string().required(),
    //         image : Joi.string().required(),
    //         price : Joi.number().required().min(0),
    //         description : Joi.string().required(),
    //         location : Joi.string().required(),
    //     }).required()
    // })
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map((el) => el.message).join(",");
        console.log(msg);
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};

module.exports.isAuthor = async (req,res,next)=>{
    const {id} = req.params;
    const campground = await Campground.findById(id);
    if (!campground.author.equals(req.user._id)){
    req.flash('error','You are not in charge of this campground!');
    return res.redirect(`/campgrounds/${id}`);
    }
    next();
};

module.exports.isReviewAuthor = async (req,res,next)=>{
    const {id,reviewId} = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)){
    req.flash('error','You are not in charge of this campground!');
    return res.redirect(`/campgrounds/${id}`);
    }
    next();
};

module.exports.validateReview = (req,res,next)=>{
    const {error} = reviewSchema.validate(req.body);
    if (error){
        const msg = error.details.map(el=>el.message).join(',');
        console.log(msg);
        throw new ExpressError(msg,400)
    }
    else{
        next();
    }
}