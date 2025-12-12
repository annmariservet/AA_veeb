const express = require("express");
const checkLogin = require("../src/checkLogin");
const router = express.Router();

//kõik siinsed marsruudid kasutavad vahevara 
router.use(checkLogin.isLogin);
const {
    photogalleryHome,
    photogalleryPage} = require ("../controllers/photogalleryControllers");

router.route("/").get(photogalleryHome);
router.route("/:page").get(photogalleryPage);

module.exports = router;