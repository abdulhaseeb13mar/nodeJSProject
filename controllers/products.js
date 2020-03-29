const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
  res.render("addproduct", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    formsCSS: true,
    productCSS: true,
    activeAddProduct: true
  });
  console.log("in get product");
};

exports.postAddProduct = (req, res, next) => {
  const product = new Product(req.body.title);
  product.save();
  console.log("in post product");
  res.redirect("/");
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll(products => {
    res.render("shop", {
      prods: products,
      pageTitle: "shop",
      path: "/",
      hasProducts: products.length > 0,
      activeShop: true,
      productsCSS: true
    });
  });
  console.log("in home");
};
