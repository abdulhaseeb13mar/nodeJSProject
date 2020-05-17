const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const { check } = require("express-validator/check");

router.get("/login", authController.getLogin);
router.post("/login", authController.postLogin);
router.post("/logout", authController.postLogout);
router.get("/signup", authController.getSignup);
router.post(
  "/signup",
  check("email").isEmail().withMessage("Please enter a valid email"),
  authController.postSignup
);
router.get("/reset", authController.getReset);
router.post("/reset", authController.postReset);
router.get("/reset/:token", authController.getNewPassword);
router.post("/newPassword", authController.postNewPassword);

module.exports = router;
