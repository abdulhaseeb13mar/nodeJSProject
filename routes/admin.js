const express = require("express");

const adminController = require("../controllers/admin");
const router = express.Router();
const isAuth = require("../middleware/is-auth");
const { body } = require("express-validator/check");

router.get("/add-product", isAuth, adminController.getAddProduct);

router.get("/products", isAuth, adminController.getProducts);

router.post(
  "/add-product",
  [
    body("title")
      .isString()
      .isLength({ min: 3, max: 50 })
      .trim()
      .withMessage("Invalid Title"),
    body("imageUrl").isURL().withMessage("Invalid image url"),
    body("price").isFloat().withMessage("Invalid Price"),
    body("description")
      .isLength({ min: 5, max: 200 })
      .trim()
      .withMessage("Invalid Description"),
  ],
  isAuth,
  adminController.postAddProduct
);

router.get("/edit-product/:productId", isAuth, adminController.getEditProduct);

router.post(
  "/edit-product",
  [
    body("title")
      .isString()
      .isLength({ min: 3, max: 50 })
      .trim()
      .withMessage("Invalid Title"),
    body("imageUrl").isURL().withMessage("Invalid image url"),
    body("price").isFloat().withMessage("Invalid Price"),
    body("description")
      .isLength({ min: 5, max: 200 })
      .trim()
      .withMessage("Invalid Description"),
  ],
  isAuth,
  adminController.postEditProduct
);

router.post("/delete-product", isAuth, adminController.postDeleteProduct);

module.exports = router;
