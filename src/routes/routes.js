const express = require("express");
const router = express.Router();
const { validateToken } = require("../utils/utils");

const userController = require("../controllers/user.controller");

router.get("/callback", userController.checkSession);

router.get("/validate", validateToken, userController.test);

router.get("/", validateToken, userController.getUserInfo);

module.exports = router;
