const User = require("../models/user");

exports.getLogin = (req, res, next) => {
  console.log("in getLogin");
  res.render("auth/login.ejs", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: false,
  });
};
exports.postLogin = (req, res, next) => {
  console.log("in postLogin");
  User.findById("5eb3363c965ce62b4c1ff67a")
    .then((user) => {
      req.session.isLoggedIn = true;
      req.session.user = user;
      req.session.save((err) => {
        console.log(err);
        res.redirect("/");
      });
    })
    .catch((err) => console.log(err));
};

exports.postLogout = (req, res, next) => {
  console.log("in postLogout");
  req.session.destroy(() => {
    res.redirect("/");
  });
};
