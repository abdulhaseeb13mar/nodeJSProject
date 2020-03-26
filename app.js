const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.use("/addproduct", (req, res, next) => {
  console.log("in add product");

  res.send(
    '<form action="/product" method="POST"><input type="text" name="title"><button type="submit">Add Product</button></form>'
  );
});

app.post("/product", (req, res, next) => {
  console.log("in product");
  console.log(req.body);
  res.redirect("/");
});
app.use("/", (req, res, next) => {
  console.log("in home");
  res.send("<h1>hello</h1>");
});

app.listen(3000);
