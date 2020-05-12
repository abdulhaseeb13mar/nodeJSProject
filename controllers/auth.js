exports.getLogin = (req, res, next) => {
  console.log("in getLogin");
  const isLoggedIn = req.get("Cookie").split(";")[0].trim().split("=")[1];
  res.render("auth/login.ejs", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: isLoggedIn,
  });
};

exports.postLogin = (req, res, next) => {
  console.log("in postLogin");
  res.setHeader("Set-Cookie", "isloggedIn=true");
  res.redirect("/");
  // res.render("auth/login.ejs", {
  //   path: "/login",
  //   pageTitle: "Login",
  // });
};
