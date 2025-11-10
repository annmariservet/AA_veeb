const express = require("express");
const router = express.Router();

const {
    visitRegistrationPage,
    visitRegistrationPost,
    visitLogPage
} = require ("../controllers/regvisitControllers");

router.route("/").get(visitRegistrationPage);
router.route("/").post(visitRegistrationPost);
router.route("/visitlog").get(visitLogPage);

module.exports = router;