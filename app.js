const express = require("express");
const app = express();
const _ = require("lodash");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const morgan = require("morgan");
const session = require("express-session");
const path = require("path");
const flash = require("connect-flash");
const Campground = require("./models/campground");
const Review = require("./models/review");
const ExpressError = require("./Utils/ExpressJS");
const wrapAsync = require("./Utils/AsyncWrapper");
const { reviewSchema } = require("./schemas");
const campgroundsRouter = require("./routes/campground");
const reviewsRouter = require("./routes/reviews");

let port = 3000;

app.set("views", path.join(__dirname + "/views"));
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(flash());

const sessionConfig = {
  secret: "thisisasecret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

app.use(session(sessionConfig));

mongoose.connect("mongodb://localhost:27017/yelp-camp", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

const db = mongoose.connection;
db.on("error", console.error.bind("Connection error!"));
db.once("open", () => {
  console.log("Database connected");
});

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.use("/campgrounds", campgroundsRouter);
app.use("/campgrounds/:id/reviews", reviewsRouter);

app.get("/", (req, res) => {
  res.render("home");
});

app.all("*", (req, res, next) => {
  next(new ExpressError("Page not found", 404));
  // res.send("404!!!");
});

app.use((err, req, res, next) => {
  const { status = 500 } = err;
  if (!err.message) err.message = "Something went wrong";
  res.status(status).render("error", { err });
});

app.listen(port, () => {
  console.log(`http://localhost:3000`);
});

// POST /campgrounds/:id/reviews
// res.cookie(key, val);
