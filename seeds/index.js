const _ = require("lodash");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const Campground = require("../models/campground");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
let port = 3000;

mongoose.connect("mongodb://localhost:27017/yelp-camp", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind("Connection error!"));
db.once("open", () => {
  console.log("Database connected");
});

const sample = (arr) => {
  return arr[Math.floor(Math.random() * arr.length)];
};

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const camp = new Campground({
      location: `${cities[random1000].city}, ${cities[random1000].state} `,
      title: `${sample(descriptors)} ${sample(places)}`,
      image: `https://source.unsplash.com/collection/483251`,
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum inventore rerum provident molestiae soluta, tenetur totam fugiat minima explicabo, adipisci culpa, excepturi cumque facilis? Excepturi assumenda nihil enim magni est?",
      price: Math.floor(Math.random() * 20) + 10,
    });
    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
