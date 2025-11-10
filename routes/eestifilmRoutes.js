const express = require("express");
const router = express.Router();

const {
    filmHomePage,
    filmPeople,
    filmPeopleAdd,
    filmPeopleAddPost,
    filmPosition,
    filmPositionAdd,
    filmPositionAddPost,
    estonianMovies,
    estonianMoviesAdd,
    estonianMoviesAddPost,
    //movieRelations
    
} = require ("../controllers/eestifilmControllers");

router.route("/").get(filmHomePage);
router.route("/filmiinimesed").get(filmPeople);
router.route("/filmiinimesed_add").get(filmPeopleAdd);
router.route("/filmiinimesed_add").post(filmPeopleAddPost);
router.route("/ametid").get(filmPosition);
router.route("/position_add").get(filmPositionAdd);
router.route("/position_add").post(filmPositionAddPost);
router.route("/filmid").get(estonianMovies);
router.route("/filmid_add").get(estonianMoviesAdd);
router.route("/filmid_add").post(estonianMoviesAddPost);
//router.route("/seosed").get(movieRelations);


module.exports = router;