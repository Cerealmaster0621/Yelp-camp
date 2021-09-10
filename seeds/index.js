const mongoose = require('mongoose');
const Campground = require('./../models/campground');
const {places, descriptors} = require('./seedHelpers');
const cities = require('./cities');
const Review = require('./../models/review');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {useNewUrlParser: true,useCreateIndex:true ,useUnifiedTopology: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('Db connected');
});

const sample = arr => arr[Math.floor(Math.random()*arr.length)];
const price = Math.floor(Math.random()*20)+10;

const seedDB = async()=>{
    await Campground.deleteMany({});
    await Review.deleteMany({});
    for (let i = 0; i<50; i++){
        const random1000 = Math.floor(Math.random()*1000)+1;
        const camp = new Campground({
            author : "61397cca0fbca52972a877e8",
            location : `${cities[random1000].city}, ${cities[random1000].state}`,
            title : `${sample(descriptors)} ${sample(places)}`,
            image : 'https://source.unsplash.com/collection/11676878',
            description : 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Incidunt placeat perferendis sapiente inventore? Sed accusamus deleniti magni ullam ex? Saepe facilis reprehenderit nobis eveniet dicta quas quibusdam, voluptatem hic error!',
            price : price,
        })
        await camp.save();
    }
}

seedDB().then(()=>{
    mongoose.connection.close();
})