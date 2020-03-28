const path = require("path");
const express = require("express");

const rootDir = require("../utils/path");

const router = express.Router();
const adminData = require("./admin");

router.get("/", (req, res, next) => {
  const products = adminData.products;
  res.render("shop", {
    prods: products,
    pageTitle: "shop",
    path: "/",
    hasProducts: products.length > 0,
    activeShop: true,
    productsCSS: true
  });
  console.log("in home");
});

module.exports = router;
