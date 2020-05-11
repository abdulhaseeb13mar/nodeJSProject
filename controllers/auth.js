exports.getLogin = (req, res, next) => {
  console.log("in getLogin");
  res.render("auth/login.ejs", {
    path: "/login",
    pageTitle: "Login",
  });
};
