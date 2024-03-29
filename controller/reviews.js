const Campground = require('../models/campground');
const Review = require('../models/review');

//POST create review
module.exports.createReview = async (req,res)=>{
    const campground = await Campground.findById(req.params.id);
    const newReview = new Review(req.body.review);
    newReview.author = req.user;
    campground.reviews.push(newReview);
    await newReview.save();
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
}
//DELETE delete review
module.exports.deleteReview = async (req,res)=>{
    const {id, reviewId} = req.params;
    await Campground.findByIdAndUpdate(id,{$pull : {reviews : reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success','successfully deleted Reviews');
    res.redirect(`/campgrounds/${id}`);
}