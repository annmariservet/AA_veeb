//const mysql = require("mysql2/promise");
//const dbInfo = require("../../../vp2025config");
//const dbConf = dbInfo.configData
const pool = require("../src/dbPool");

//@desc Home page for Estonian movie section
//@route GET /eestifilm
//access public

const filmHomePage = (req, res)=>{
    res.render("eestifilm");
};

//@desc Page for people involved in Estonian movie industry
//@route GET /eestifilm/filmiinimesed
//access public

const filmPeople = async (req, res)=>{
    //let conn;
    const sqlReq = "select * from person";
    //let personList = [];
    try {
        //conn = await mysql.createConnection(dbConf);
        //console.log("Andmebaasiühendus loodud.");
        const [rows, fields] = await pool.execute(sqlReq); //rows, seda oleme varem nimetanud sqlRes-iks
        res.render("filmiinimesed", {personList: rows});
    }
    catch(err) {
        console.log("Viga: " + err);
        res.render("filmiinimesed", {personList: []});
    }
    finally {
        /* if(conn){
            await conn.end();
            console.log("Andmebaasi ühendus suletud.");
        } */
    }
};

//@desc Page for adding people involved in Estonian movie industry
//@route GET /eestifilm/filmiinimesed_add
//access public

const filmPeopleAdd = (req, res)=>{
    res.render("filmiinimesed_add", {notice: "Kirjuta ometi midagi!"});
};

//@desc Page for submitting people involved in Estonian movie industry
//@route GET /eestifilm/filmiinimesed_add
//access public

const filmPeopleAddPost = async (req, res)=>{
    //let conn;
    let sqlReq = "insert into person (first_name, last_name, born, deceased) values (?,?,?,?)";
    if(!req.body.firstNameInput || !req.body.lastNameInput || !req.body.bornInput || req.body.bornInput > new Date()) {
        res.render("filmiinimesed_add", {notice: "Andmed on vigased!"});
        return;
    }
    try {
        //conn = await mysql.createConnection(dbConf);
        //console.log("Andmebaasiühendus loodud.");
        let deceasedDate = null;
        if(req.body.deceasedInput != ""){
        deceasedDate = req.body.deceasedInput;
        }
        const [result] = await pool.execute(sqlReq, [req.body.firstNameInput, req.body.lastNameInput, req.body.bornInput.value, deceasedDate]);
        console.log("Salvestati kirje id: " + result.insertId);
        res.render("filmiinimesed_add", {notice: "Andmed on salvestatud!"});
    }
    catch(err) {
        console.log("Viga: " + err);
        res.render("filmiinimesed_add", {notice: "Tekkis tehniline viga"});
    }
    finally {
        /* if(conn){
        await conn.end();
        console.log("Andmebaasi ühendus suletud.");
        } */
    }
};

//@desc Page for professions involved in the movie industry
//@route GET /eestifilm/ametid
//access public

const filmPosition = async (req, res)=>{
    //let conn;
    const sqlReq = "select * from `position`";
    try {
        //conn = await mysql.createConnection(dbConf);
        //console.log("Andmebaasiühendus loodud.");
        const [rows, fields] = await pool.execute(sqlReq);
        res.render("ametid", {positionList: rows});
    }
    catch(err) {
        console.log("Viga: " + err);
        res.render("ametid", {positionList: []});
    }
    finally {
        /* if(conn){
            await conn.end();
            console.log("Andmebaasi ühendus suletud.");
        } */
    }

};

//@desc Page for adding professions involved in the movie industry
//@route GET /eestifilm/position_add
//access public

const filmPositionAdd = (req, res)=>{
    res.render("position_add", {notice: "Kirjuta midagi!"});
};

//@desc Page for submitting professions involved in the movie industry
//@route GET /eestifilm/position_add
//access public

const filmPositionAddPost = async (req, res)=>{
    //let conn;
    let sqlReq = "insert into `position` (position_name, description) values (?,?)";
    let positionDescription = null;
    if(req.body.descriptionInput != ""){
        positionDescription = req.body.descriptionInput;
        return;
    }
    try {
        //conn = await mysql.createConnection(dbConf);
        //console.log("Andmebaasiühendus loodud.");
        // let positionDescription = null;
        // if(req.body.descriptionInput != ""){
        //     positionDescription = req.body.descriptionInput;
        // }
        const [result] = await pool.execute(sqlReq, [req.body.positionNameInput, positionDescription]);
        console.log("Salvestati kirje id: " + result.insertId);
        res.render("position_add", {notice: "Andmed on salvestatud!"});
    }
    catch(err) {
        console.log("Viga: " + err);
        res.render("position_add", {notice: "Tekkis tehniline viga"});
    }
    finally {
        /* if(conn){
        await conn.end();
        console.log("Andmebaasi ühendus suletud.");
        } */
    }
};

//@desc Page for a list of Estonian movies
//@route GET /eestifilm/filmid
//access public

const estonianMovies = async (req, res)=>{
    //let conn;
    const sqlReq = "select * from movie";
    try {
        //conn = await mysql.createConnection(dbConf);
        //console.log("Andmebaasiühendus loodud.");
        const [rows, fields] = await pool.execute(sqlReq);
        res.render("filmid", {movieList: rows});
    }
    catch(err) {
        console.log("Viga: " + err);
        res.render("filmid", {movieList: []});
    }
    finally {
        /* if(conn){
            await conn.end();
            console.log("Andmebaasi ühendus suletud.");
        } */
    }

};

//@desc Page for adding Estonian movies to the list
//@route GET /eestifilm/filmid_add
//access public

const estonianMoviesAdd = (req, res)=>{
    res.render("filmid_add", {notice: "Kirjuta midagi!"});
};

//@desc Page for submitting Estonian movies 
//@route GET /eestifilm/filmid_add
//access public

const estonianMoviesAddPost = async (req, res)=>{
    //let conn;
    let sqlReq = "insert into movie (title, production_year, duration, description) values (?,?,?,?)";
    let movieDescription = null;
    if(!req.body.movieNameInput || !req.body.movieDurationInput || !req.body.movieProductionYearInput) {
        res.render("filmid_add", {notice: "Andmed on vigased!"});
        return;
    }
    if(req.body.movieDescriptionInput != ""){
        movieDescription = req.body.movieDescriptionInput;
    }
    try {
        //conn = await mysql.createConnection(dbConf);
        //console.log("Andmebaasiühendus loodud.");
        // if(req.body.descriptionInput != ""){
        //     positionDescription = req.body.descriptionInput;
        // }
        const [result] = await pool.execute(sqlReq, [req.body.movieNameInput, req.body.movieDurationInput, req.body.movieProductionYearInput, movieDescription]);
        console.log("Salvestati kirje id: " + result.insertId);
        res.render("filmid_add", {notice: "Andmed on salvestatud!"});
    }
    catch(err){
        console.log("Viga: " + err);
        res.render("filmid_add", {notice: "Tekkis tehniline viga"});
    }
    finally {
       /*  if(conn){
            await conn.end();
            console.log("Andmebaasi ühendus suletud.");
        } */
    }
};

//@desc Page for seeing movie, person, position relations
//@route GET /eestifilm/seosed
//access public

const movieRelations = async (req, res)=>{
    //let conn;

    try {
        //conn = await mysql.createConnection(dbConf);
        
    }
    catch{
        console.log("Viga: " + err);
        res.render("seosed", {notice: "Tekkis tehniline viga"});
    }
    finally {
        /* if(conn){
            await conn.end();
            console.log("Andmebaasi ühendus suletud.");
        } */
    }
} 

module.exports = {
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
};