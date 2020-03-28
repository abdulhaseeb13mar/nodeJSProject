const products = [];

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
  console.log("in post product");
  products.push({ title: req.body.title });
  res.redirect("/");
};

exports.getProducts = (req, res, next) => {
  res.render("shop", {
    prods: products,
    pageTitle: "shop",
    path: "/",
    hasProducts: products.length > 0,
    activeShop: true,
    productsCSS: true
  });
  console.log("in home");
};
