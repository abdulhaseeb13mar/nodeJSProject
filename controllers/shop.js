const Product = require("../models/product");

exports.getProducts = (req, res, next) => {
  Product.fetchAll(products => {
    res.render("shop/product-list", {
      prods: products,
      pageTitle: "All Products",
      path: "/products"
    });
  });
  console.log("in getProducts");
};

exports.getIndex = (req, res, next) => {
  Product.fetchAll(products => {
    res.render("shop/index", {
      prods: products,
      pageTitle: "shop",
      path: "/"
    });
  });
  console.log("in home");
};

exports.getCart = (req, res, next) => {
  res.render("shop/cart", {
    path: "/cart",
    pageTitle: "Your Cart"
  });
  console.log("in cart");
};

exports.getOrders = (req, res, next) => {
  res.render("shop/orders.ejs", {
    path: "/orders",
    pageTitle: "Your Orders"
  });
  console.log("in Orders");
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    path: "/checkout",
    pageTitle: "Checkout"
  });
  console.log("in checkout");
};
