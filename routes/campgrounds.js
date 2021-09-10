const express = require("express");
const router = express.Router();
const wrapAsync = require("./../utils/CatchAsync");
const ExpressError = require("./../utils/ExpressError");
const Campground = require("./../models/campground");
const { campgroundSchema } = require("./../schema.js");
const review = require("../models/review");
const { serverSideValidation,isLoggedIn,isAuthor } = require("../middleware");
const Review = require('../models/review');
const {index,newCamp,createCamp,getCampgroundInfo,getEditCamp,updateCamp,deleteCamp} = require('../controller/campgrounds');
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })


router.get("/new", isLoggedIn,newCamp);

router.route('/')
    .get(wrapAsync(index))
    // .post(isLoggedIn,serverSideValidation,wrapAsync(createCamp));
    .post(upload.array('image'),(req,res)=>{
        res.send(req.body, req.file);
    })

router.route('/:id')
    .get(wrapAsync(getCampgroundInfo))
    .put(isLoggedIn,isAuthor,serverSideValidation,wrapAsync(updateCamp))
    .delete(isLoggedIn,isAuthor,wrapAsync(deleteCamp));
    
router.get("/:id/edit",isLoggedIn,isAuthor, wrapAsync(getEditCamp));

module.exports = router;
