const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const sendGridTransport = require("nodemailer-sendgrid-transport");
const crypto = require("crypto");
const User = require("../models/user");
const { validationResult } = require("express-validator/check");

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
    oldInput: {
      email: "",
      password: "",
    },
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
    oldInput: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });
};

exports.postLogin = (req, res, next) => {
  console.log("in postLogin");
  const email = req.body.email.toLowerCase();
  const password = req.body.password.trim();
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("auth/login.ejs", {
      path: "/login",
      pageTitle: "Login",
      errorMessage: errors.array()[0].msg,
      oldInput: {
        email: email,
        password: password,
      },
    });
  }
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        return res.status(422).render("auth/login.ejs", {
          path: "/login",
          pageTitle: "Login",
          errorMessage: "Invalid email or password",
          oldInput: {
            email: email,
            password: password,
          },
        });
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
          return res.status(422).render("auth/login.ejs", {
            path: "/login",
            pageTitle: "Login",
            errorMessage: "Invalid email or password",
            oldInput: {
              email: email,
              password: password,
            },
          });
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
  const email = req.body.email.toLowerCase();
  const password = req.body.password.trim();
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("auth/signup.ejs", {
      path: "/signup",
      pageTitle: "Signup",
      errorMessage: errors.array()[0].msg,
      oldInput: {
        email: email,
        password: password,
        confirmPassword: req.body.confirmPassword,
      },
    });
  }
  bcrypt
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
};

exports.postLogout = (req, res, next) => {
  console.log("in postLogout");
  req.session.destroy(() => {
    res.redirect("/");
  });
};

exports.getReset = (req, res, next) => {
  console.log("in getReset");
  let msg = req.flash("error");
  msg.length > 0 ? (msg = msg[0]) : (msg = null);
  res.render("auth/reset.ejs", {
    path: "/reset",
    pageTitle: "Reset Password",
    errorMessage: msg,
  });
};

exports.postReset = (req, res, next) => {
  console.log("in postReset");
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect("/reset");
    }
    const token = buffer.toString("hex");
    User.findOne({ email: req.body.email })
      .then((user) => {
        if (!user) {
          req.flash("error", "No Account with that email");
          return res.redirect("/reset");
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        return user.save();
      })
      .then((result) => {
        res.redirect("/reset/" + token);
        transporter.sendMail({
          to: req.body.email,
          from: "abdulhaseeb13mar@gmail.com",
          subject: "Password Reset!",
          html: `<p>You requested a password reset</p><p>Click this <a href="http://localhost:3000/reset/${token}">to set new password</a></p>`,
        });
      })
      .catch((err) => console.log(err));
  });
};

exports.getNewPassword = (req, res, next) => {
  console.log("in getNewPassword");

  const token = req.params.token;
  User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
    .then((user) => {
      let msg = req.flash("error");
      msg.length > 0 ? (msg = msg[0]) : (msg = null);
      res.render("auth/newPassword.ejs", {
        path: "/newPassword",
        pageTitle: "New Password",
        errorMessage: msg,
        userId: user._id.toString(),
        passwordToken: token,
      });
    })
    .catch((err) => console.log(err));
};

exports.postNewPassword = (req, res, next) => {
  console.log("in postNewPassword");
  const newPassword = req.body.password;
  const userId = req.body.userId;
  const passwordToken = req.body.passwordToken;
  let resetUser;
  User.findOne({
    resetToken: passwordToken,
    resetTokenExpiration: { $gt: Date.now() },
    _id: userId,
  })
    .then((user) => {
      resetUser = user;
      return bcrypt.hash(newPassword, 12);
    })
    .then((hashedPassword) => {
      resetUser.password = hashedPassword;
      resetUser.resetToken = null;
      resetUser.resetTokenExpiration = undefined;
      return resetUser.save();
    })
    .then((result) => {
      res.redirect("/login");
    })
    .catch((err) => console.log(err));
};
