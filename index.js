const express = require("express");
require("dotenv").config();
const fs = require("fs");
const bodyparser = require("body-parser");
//const mysql = require("mysql2/promise");
const session = require("express-session");
const dateEt = require("./src/dateTimeET");
//const dbInfo = require("../../vp2025config");
//const dbConf = dbInfo.configData;
//const dbSession = dbInfo.sessionData;
const pool = require("./src/dbPool");
const checkLogin = require("./src/checkLogin");
const textRef = "public/txt/vanasonad.txt";
//const textRef2 = "public/txt/visitlog.txt";
const app = express();
//sessiooni kasutamine
app.use(session({
    secret: process.env.SES_SECRET,
    saveUninitialized: true,
    resave: true
}));
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyparser.urlencoded({extended: true}));

app.get("/", async (req, res)=>{
    //let conn;
    let latestPhoto = null;
    try{
        //conn = await mysql.createConnection(dbConf);
        const sqlReq = "SELECT filename, alttext FROM galleryphotos_aa WHERE id=(SELECT MAX(id) FROM galleryphotos_aa WHERE privacy=? AND deleted IS NULL)";
        const privacy = 3;
		const [rows, fields] = await pool.execute(sqlReq, [privacy]);
		//console.log(rows);
		let imgAlt = "Avalik foto";
		if(rows[0].alttext != ""){
			imgAlt = rows[0].alttext;
		}
		res.render("index", {imgFile: "gallery/normal/" + rows[0].filename, imgAlt: imgAlt});
    }
    catch(err){
        console.log("Viga foto laadimisel: " + err);
    } 
    finally {
        /* if(conn) {
            await conn.end();
        } */
    }
});

//sisseloginud kasutajate avaleht
app.get("/home", checkLogin.isLogin, (req, res)=>{
    console.log("Sisse logis kasutaja id: " + req.session.userId);
    const userName = req.session.userFirstname + " " + req.session.userLastname;
    res.render("home", {userName: userName});
});

//välja logimine
app.get("/logout", (req, res)=>{
    //tühistame sessiooni
    req.session.destroy();
    res.redirect("/");
})

app.get("/timenow", (req, res)=>{
    res.render("timenow", {wd: dateEt.weekDay(), date: dateEt.longDate()});
});

app.get("/vanasonad", (req, res)=>{
    fs.readFile(textRef, "utf8", (err, data)=>{
        if(err){
            res.render("genericlist", {h2: "Vanasõnad", listData: ["Vabandame, ühtki vanasõna ei leitud"]});
        }
        else {
            res.render("genericlist", {h2: "Vanasõnad", listData: data.split(";")});
        }
    });
});

//registreerimise marsruudid
const regvisitRouter = require("./routes/regvisitRoutes");
app.use("/regvisit", regvisitRouter);

//eestifilmi marsruudid
const eestifilmRouter = require("./routes/eestifilmRoutes");
app.use("/eestifilm", eestifilmRouter);

//galeriipildi üles laadimise marsruudid
const galletyphotouploadRouter = require("./routes/galleryphotouploadRoutes");
app.use("/galleryphotoupload", galletyphotouploadRouter);

//fotogalerii marsruudid
const photogalleryRouter = require("./routes/photogalleryRoutes");
app.use("/photogallery", photogalleryRouter);

//uudiste lisamise lehe marsruudid
const newsAddRouter = require("./routes/newsAddRoutes");
app.use("/newsupload", newsAddRouter);

//uudiste kuvamise lehe marsruudid
const newsViewRouter = require("./routes/newsViewRoutes");
app.use("/news", newsViewRouter);

//Kasutajakonto loomise marsruudid
const signupRouter = require("./routes/signupRoutes");
app.use("/signup", signupRouter);

//Sisselogimise marsruudid
const signinRouter = require("./routes/signinRoutes");
app.use("/signin", signinRouter);

app.listen(5309);