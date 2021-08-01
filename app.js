const express = require("express");
const app = express();
const _ = require("lodash");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const morgan = require("morgan");
const path = require("path");
const Campground = require("./models/campground");
const ExpressError = require("./Utils/ExpressJS");
const wrapAsync = require("./Utils/AsyncWrapper");
let port = 3000;

app.set("views", path.join(__dirname + "/views"));
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
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

app.get("/", (req, res) => {
  res.render("home");
});

app.get(
  "/campgrounds",
  wrapAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
  })
);

app.get("/campgrounds/new", (req, res) => {
  res.render("campgrounds/new");
});

app.post(
  "/campgrounds",
  wrapAsync(async (req, res, next) => {
    // * wrapAsync function will catch the error we will throw error
    // ! So "throwing error in here" works
    if (!req.body.campground) throw new ExpressError("Insufficient data", 400);
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

app.get(
  "/campgrounds/:id/edit",
  wrapAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render("campgrounds/edit", { campground });
  })
);

app.get(
  "/campgrounds/:id",
  wrapAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render("campgrounds/show", { campground });
  })
);

app.put(
  "/campgrounds/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {
      ...req.body.campground,
    });
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

app.delete(
  "/campgrounds/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect("/campgrounds");
  })
);

app.all("*", (req, res, next) => {
  next(new ExpressError("Page not found", 404));
  res.send("404!!!");
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Something went wrong" } = err;
  console.log("Ohh Boy!");
  res.status(status).send(`Ohh no... ${message}`);
});

app.listen(port, () => {
  console.log(`http://localhost:3000`);
});
