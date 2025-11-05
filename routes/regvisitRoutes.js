const express = require("express");
const router = express.Router();

const {
    visitRegistrationPage,
    visitRegistrationPost
} = require ("../controllers/regvisitControllers");

router.route("/").get(visitRegistrationPage);
router.route("/").post(visitRegistrationPost);
//router.route("/visitlog").get(viewVistors);

module.exports = router;