const express = require("express");
const multer = require("multer");

const router = express.Router();
//seadistame vahevara fotode üles laadimiseks kindlasse kataloogi
const uploader = multer({dest:"./public/news/orig/"});

const {
    newsAddPage,
    newsAddPagePost
} = require ("../controllers/newsAddControllers");

router.route("/").get(newsAddPage);
//post marsruudi puhul kasutame vahevara uploader
router.route("/").post(uploader.single("photoInput"), newsAddPagePost);

module.exports = router;