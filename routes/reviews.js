const express = require('express');
const flash = require('connect-flash');
//set mergeParams to true so that you can access
//to :id of /campgrounds/:id
//if the id has been declared from outside router
//like app.use('/campgrounds/:id/reviews',reviews);
//you might wanna have to store id from mergeParams : true
const router = express.Router({mergeParams: true});
const {reviewSchema} = require('./../schema.js');
const Campground = require('./../models/campground');
const Review = require('./../models/review');
const wrapAsync = require('./../utils/CatchAsync');
const {validateReview, isLoggedIn, isReviewAuthor} = require('../middleware');
const { createReview,deleteReview } = require('../controller/reviews.js');

router.post('/',isLoggedIn,validateReview,wrapAsync(createReview))

router.delete('/:reviewId',isLoggedIn, isReviewAuthor,wrapAsync(deleteReview))

module.exports = router;