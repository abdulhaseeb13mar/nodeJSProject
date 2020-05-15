const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session");
const MongodbStore = require("connect-mongodb-session")(session);
const errorController = require("./controllers/error");
const User = require("./models/user");

const MONGODB_URI =
  "mongodb+srv://abdulhaseeb:mongodb123@shop-cluster-pnzzp.gcp.mongodb.net/shop?retryWrites=true&w=majority";

const app = express();
const store = new MongodbStore({
  uri: MONGODB_URI,
  collection: "sessions",
});

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
app.use(errorController.get404);

mongoose
  .connect(MONGODB_URI)
  .then((res) => {
    User.findOne().then((user) => {
      if (!user) {
        const user = new User({
          name: "Haseeb",
          email: "abdulhaseeb13mar@gmail.com",
          cart: {
            items: [],
          },
        });
        user.save();
      }
    });
    app.listen(3000);
  })
  .catch((err) => console.log(err));
