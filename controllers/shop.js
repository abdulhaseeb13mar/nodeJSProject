const Product = require("../models/product");
const Cart = require("../models/cart");

exports.getProducts = (req, res, next) => {
  Product.findAll()
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "All Products",
        path: "/products",
      });
    })
    .catch((err) => console.log(err));
  console.log("in getProducts");
};

exports.getProduct = (req, res, next) => {
  console.log("in getProduct");
  const prodId = req.params.productId;
  Product.findByPk(prodId)
    .then((product) => {
      res.render("shop/product-detail", {
        product: product,
        pageTitle: product.title,
        path: "/products",
      });
    })
    .catch((err) => console.log(err));
};

exports.getIndex = (req, res, next) => {
  Product.findAll()
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "shop",
        path: "/",
      });
    })
    .catch((err) => console.log(err));
  console.log("in home");
};

exports.getCart = (req, res, next) => {
  console.log("in get cart");
  req.user
    .getCart()
    .then((cart) => {
      return cart
        .getProducts()
        .then((products) => {
          res.render("shop/cart", {
            path: "/cart",
            pageTitle: "Your Cart",
            products: products,
          });
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
};

exports.postCart = (req, res, next) => {
  let fetchedCart;
  const prodId = req.body.productId;
  let newQuantity = 1;
  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts({ where: { id: prodId } });
    })
    .then((products) => {
      let product;
      if (products.length > 0) {
        product = products[0];
      }
      if (product) {
        const oldQuantity = product.cartItem.quantity;
        newQuantity = oldQuantity + 1;
        return product;
      }
      return Product.findByPk(prodId);
    })
    .then((product) => {
      return fetchedCart.addProduct(product, {
        through: { quantity: newQuantity },
      });
    })
    .then(() => res.redirect("/cart"))
    .catch((err) => console.log(err));
};

exports.postCartDeleteProduct = (req, res, next) => {
  console.log("in delete product cart");
  const prodId = req.body.productId;
  req.user
    .getCart()
    .then((cart) => {
      return cart.getProducts({ where: { id: prodId } });
    })
    .then((products) => {
      const product = products[0];
      return product.cartItem.destroy();
    })
    .then((result) => {
      res.redirect("/cart");
    })
    .catch((err) => console.log(err));
};

exports.getOrders = (req, res, next) => {
  res.render("shop/orders.ejs", {
    path: "/orders",
    pageTitle: "Your Orders",
  });
  console.log("in Orders");
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    path: "/checkout",
    pageTitle: "Checkout",
  });
  console.log("in checkout");
};
