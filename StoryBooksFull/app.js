const express = require("express");
const path = require("path");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const session = require("express-session");
const passport = require("passport");
const methodOverride = require("method-override");

// Load User Model
require("./models/User");

// Passport Config
let pass = require("./config/passport");
pass(passport);

// Load Routes
const index = require("./routes/index");
const auth = require("./routes/auth");
const stories = require("./routes/stories");
const {
  truncate,
  stripTags,
  formatDate,
  editIcon,
  prepareText,
  prepareComment
} = require("./helpers/helper");

// Load Keys
const keys = require("./config/keys");

// Map global promises
mongoose.Promise = global.Promise;
// Mongoose Connect
mongoose
  .connect(
    "mongodb://localhost:27017/storybook",
    {
      useMongoClient: true
    }
  )
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

const app = express();

// Handlebars Middleware
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main",
    helpers: {
      truncate,
      stripTags,
      formatDate,
      editIcon,
      prepareText,
      prepareComment
    }
  })
);
app.set("view engine", "handlebars");

// Set static folder
app.use(express.static(path.join(__dirname, "public")));

//body parser
// create application/json parser
app.use(bodyParser.json());

// create application/x-www-form-urlencoded parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride("_method"));

app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false
  })
);

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Set global vars
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

// Use Routes
app.use("/", index);
app.use("/auth", auth);
app.use("/stories", stories);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
