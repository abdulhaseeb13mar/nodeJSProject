const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const sendGridTransport = require("nodemailer-sendgrid-transport");
const User = require("../models/user");

const transporter = nodemailer.createTransport(
  sendGridTransport({
    auth: {
      api_key:
        "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",
    },
  })
);

exports.getLogin = (req, res, next) => {
  console.log("in getLogin");
  let msg = req.flash("error");
  msg.length > 0 ? (msg = msg[0]) : (msg = null);
  res.render("auth/login.ejs", {
    path: "/login",
    pageTitle: "Login",
    errorMessage: msg,
  });
};

exports.getSignup = (req, res, next) => {
  console.log("in getSignup");
  let msg = req.flash("error");
  msg.length > 0 ? (msg = msg[0]) : (msg = null);
  res.render("auth/signup.ejs", {
    path: "/signup",
    pageTitle: "Signup",
    errorMessage: msg,
  });
};

exports.postLogin = (req, res, next) => {
  console.log("in postLogin");
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        req.flash("error", "Invalid email or password");
        return res.redirect("/login");
      }
      bcrypt
        .compare(password, user.password)
        .then((match) => {
          if (match) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save((err) => {
              console.log(err);
              res.redirect("/");
            });
          }
          res.redirect("login");
        })
        .catch((err) => {
          console.log(err);
          req.flash("error", "Invalid email or password");
          res.redirect("/login");
        });
    })
    .catch((err) => console.log(err));
};

exports.postSignup = (req, res, next) => {
  console.log("in postSignup");
  const email = req.body.email;
  const password = req.body.password;
  // const confirmPassword = req.body.confirmPassword;
  User.findOne({ email: email })
    .then((userDoc) => {
      if (userDoc) {
        req.flash("error", "Email already exists!");
        return res.redirect("/signup");
      }
      return bcrypt
        .hash(password, 12)
        .then((hashedPassword) => {
          const user = new User({
            email: email,
            password: hashedPassword,
            cart: { items: [] },
          });
          return user.save();
        })
        .then((result) => {
          res.redirect("/login");
          return transporter.sendMail({
            to: email,
            from: "abdulhaseeb13mar@gmail.com",
            subject: "Signup Succeeded!",
            html: "<h1>You successfully signed up!</h1>",
          });
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
};

exports.postLogout = (req, res, next) => {
  console.log("in postLogout");
  req.session.destroy(() => {
    res.redirect("/");
  });
};
