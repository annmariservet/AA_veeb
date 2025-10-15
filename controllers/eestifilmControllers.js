const mysql = require("mysql2/promise");
const dbInfo = require("../../../vp2025config");

const dbConf = {
    host: dbInfo.configData.host,
    user: dbInfo.configData.user,
    password: dbInfo.configData.password,
    database: dbInfo.configData.database
}

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
    let conn;
    const sqlReq = "select * from person";
    //let personList = [];
    try {
        conn = await mysql.createConnection(dbConf);
        console.log("Andmebaasiühendus loodud.");
        const [rows, fields] = await conn.execute(sqlReq); //rows, seda oleme varem nimetanud sqlRes-iks
        res.render("filmiinimesed", {personList: rows});
    }
    catch(err) {
        console.log("Viga: " + err);
        res.render("filmiinimesed", {personList: []});
    }
    finally {
        if(conn){
            await conn.end();
            console.log("Andmebaasi ühendus suletud.");
        }
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
    let conn;
    let sqlReq = "insert into person (first_name, last_name, born, deceased) values (?,?,?,?)";
    if(!req.body.firstNameInput || !req.body.lastNameInput || !req.body.bornInput || req.body.bornInput > new Date()) {
        res.render("filmiinimesed_add", {notice: "Andmed on vigased!"});
        return;
    }
    try {
        conn = await mysql.createConnection(dbConf);
        console.log("Andmebaasiühendus loodud.");
        let deceasedDate = null;
        if(req.body.deceasedInput != ""){
        deceasedDate = req.body.deceasedInput;
        }
        const [result] = await conn.execute(sqlReq, [req.body.firstNameInput, req.body.lastNameInput, req.body.bornInput, deceasedDate]);
        console.log("Salvestati kirje id: " + result.insertId);
        res.render("filmiinimesed_add", {notice: "Andmed on salvestatud!"});
    }
    catch(err) {
        console.log("Viga: " + err);
        res.render("filmiinimesed_add", {notice: "Tekkis tehniline viga"});
    }
    finally {
        if(conn){
        await conn.end();
        console.log("Andmebaasi ühendus suletud.");
        }
    }
};

//@desc Page for professions involved in the movie industry
//@route GET /eestifilm/ametid
//access public

const filmPosition = (req, res)=>{
    const sqlReq = "select * from position";
    //conn.query
    conn.execute(sqlReq, (err, sqlRes)=>{
        if (err) {
            console.log(err);
            res.render("ametid", {positionList: []}); //[] tühi list
        }
        else {
            console.log(sqlRes);
            res.render("ametid", {positionList: sqlRes});
        }
    });
};

//@desc Page for professions involved in the movie industry
//@route GET /eestifilm/position_add
//access public

const filmPositionAdd = (req, res)=>{
    res.render("position_add", {notice: "Kirjuta midagi!"});
};

//@desc Page for professions involved in the movie industry
//@route GET /eestifilm/position_add
//access public

const filmPositionAddPost = (req, res)=>{
    console.log(req.body);
    if(!req.body.positionNameInput){
        res.render("position_add", {notice: "Andmed on vigased!"});
    }
    else {
        let positionDescription = null;
        if(req.body.descriptionInput != ""){
            positionDescription = req.body.descriptionInput;
        }

        let sqlReq = "INSERT INTO `position` (position_name, description) VALUES (?,?)";
        conn.execute(sqlReq, [req.body.positionNameInput, positionDescription], (err, sqlRes)=>{
            if(err){
                res.render("position_add", {notice: "Andmed on vigased!"});
                console.log(err)
            }
            else {
                //res.render("position_add", {notice: "Andmed on salvestatud!"});
                res.redirect("/eestifilm/ametid");
            }
        });
    }
};

module.exports = {
    filmHomePage,
    filmPeople,
    filmPeopleAdd,
    filmPeopleAddPost,
    filmPosition,
    filmPositionAdd,
    filmPositionAddPost
};