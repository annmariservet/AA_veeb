const express = require("express");
const router = express.Router();

const {photogalleryPage} = require ("../controllers/photogalleryControllers");

router.route("/").get(photogalleryPage);

module.exports = router;