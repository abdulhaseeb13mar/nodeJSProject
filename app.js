const express = require("express");

const app = express();

app.use("/addproduct", (req, res, next) => {
  console.log("in the addprofuct");
  res.send("<h1>hello add product</h1>");
});

app.use("/", (req, res, next) => {
  console.log("in the middleware");
  res.send("<h1>hello</h1>");
});

app.listen(3000);
