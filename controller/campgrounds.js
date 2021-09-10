const Campground = require('../models/campground');

//GET campgrounds index
module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
}

//GET new campground
module.exports.newCamp =  (req, res) => {
    res.render("campgrounds/new");
}

//POST create new campground
module.exports.createCamp = async (req, res, next) => {
    const newCamp = req.body.campground; //stored name = campground[title]
    const newCampground = new Campground(newCamp);
    newCampground.author = req.user._id;
    await newCampground.save();
    req.flash("success", "successfully made new campground");
    res.redirect("/campgrounds");
}

//GET campground info
module.exports.getCampgroundInfo = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate({path:'reviews',populate:{path : 'author'}}).populate('author');
    if (!campground) {
        req.flash("error", "Cannot find that campground");
        return res.redirect("/campgrounds");
    }
    res.render("campgrounds/show", { campground });
}

//GET edit camp
module.exports.getEditCamp = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash("error", "Cannot find that campground");
        return res.redirect("/campgrounds");
    }
    res.render(`campgrounds/edit`, { campground });
}

//PUT update camp
module.exports.updateCamp = async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndUpdate(id,req.body.campground,{ new: true, runValidators: true });
    req.flash("success", "Successfully updated Campground");
    res.redirect(`/campgrounds/${id}`);
}

//DELETE camp
module.exports.deleteCamp = async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash("success", "successfully deleted Campground");
    res.redirect("/campgrounds");
}