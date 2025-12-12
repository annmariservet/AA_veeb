const express = require("express");
const router = express.Router();
const checkLogin = require("../src/checkLogin");

router.use(checkLogin.isLogin);
const {newsViewPage} = require ("../controllers/newsViewControllers");

router.route("/").get(newsViewPage);

module.exports = router;