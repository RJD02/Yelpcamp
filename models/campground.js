const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CampgroundSchema = new Schema({
  title: String,
  image: String,
  price: Number,
  description: String,
  location: String,
  reviews: [
    {
      types: Schema.Types.ObjectId,
      ref: "review",
    },
  ],
});

module.exports = mongoose.model("Campground", CampgroundSchema);
