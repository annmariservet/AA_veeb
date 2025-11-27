const express = require("express");
const checkLogin = require("../src/checkLogin");
const router = express.Router();

//kõik siinsed marsruudid kasutavad vahevara 
router.use(checkLogin.isLogin);
const {photogalleryPage} = require ("../controllers/photogalleryControllers");

router.route("/").get(photogalleryPage);

module.exports = router;