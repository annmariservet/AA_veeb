const express = require("express");
const fs = require("fs");
const bodyparser = require("body-parser");
const mysql = require("mysql2/promise");
const dateEt = require("./src/dateTimeET");
const dbInfo = require("../../vp2025config");
const dbConf = dbInfo.configData;
const textRef = "public/txt/vanasonad.txt";
//const textRef2 = "public/txt/visitlog.txt";
const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyparser.urlencoded({extended: true}));

app.get("/", async (req, res)=>{
    let conn;
    let latestPhoto = null;
    try{
        conn = await mysql.createConnection(dbConf);
        const sqlReq = "SELECT filename, alttext FROM galleryphotos_aa WHERE id=(SELECT MAX(id) FROM galleryphotos_aa WHERE privacy=? AND deleted IS NULL)";
        const [photoResult] = await conn.execute(sqlReq, [3]);
        if(photoResult && photoResult.length > 0) {
            latestPhoto = photoResult[0];
        }
    }
    catch(err){
        console.log("Viga foto laadimisel: " + err);
    } 
    finally {
        if(conn) {
            await conn.end();
        }
    }
    res.render("index", {latestPhoto: latestPhoto});
});

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

app.listen(5309);