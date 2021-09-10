const mongoose = require('mongoose');
const Review = require('./review');
const User = require('./user');
const {Schema}  = mongoose;

const CampgroundSchema = new Schema({
    title : String,
    image : String,
    price : Number,
    description : String,
    location : String,
    reviews: [
        {
            type : Schema.Types.ObjectId,
            ref : 'Review',
        }
    ],
    author: {
        type : Schema.Types.ObjectId,
        ref : 'User'
    }
});

CampgroundSchema.post('findOneAndDelete', async function(data){
    const result = await Review.deleteMany({_id : {$in : data.reviews}})
    console.log(result);
})


module.exports = mongoose.model('Campground', CampgroundSchema);