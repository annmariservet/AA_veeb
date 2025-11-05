const fs = require("fs").promises; //kuna me tahame hakkata ootama kuni see tegevus on tegtud paneme promises
const dbInfo = require("../../../vp2025config");
const sharp = require("sharp");
const mysql = require("mysql2/promise");
const dbConf = dbInfo.configData;

//@desc Home page for uploading gallery photos
//@route GET /galeryphotoupload
//access public

const galleryphotouploadPage = (req, res)=>{
    res.render("galleryphotoupload");
};

//@desc Home page for adding gallery photos
//@route GET /galleryphotoupload
//access public

const galleryphotouploadPagePost = async (req, res)=>{
    let conn;
    console.log(req.body);
    console.log(req.file);
    try {
        const fileName = "vp_" + Date.now() + ".jpg";
        console.log(fileName);
        await fs.rename(req.file.path, req.file.destination + fileName);
        //loon normaal mõõdus foto (800x600)
        await sharp(req.file.destination + fileName).resize(800,600).jpeg({quality: 90}).toFile("./public/gallery/normal/" + fileName);
        //loon pisipildi mõõdus foto (100x100)
        await sharp(req.file.destination + fileName).resize(100,100).jpeg({quality: 90}).toFile("./public/gallery/thumbs/" + fileName);
        conn = await mysql.createConnection(dbConf);
        let sqlReq = "INSERT INTO galleryphotos_aa (filename, origname, alttext, privacy, userid) VALUES (?,?,?,?,?)";
        //kuna kasutaja kontorid ja nende idsid veel pole 
        const userId = 1;
        const [result] = await conn.execute(sqlReq, [fileName, req.file.originalname, req.body.altInput, req.body.privacyInput, userId]);
        console.log("Lisati foto id: " + result.insertId);
        res.render("galleryphotoupload"); //toob lehe ette
    }
    catch(err){
        console.log(err);
        res.render("galleryphotoupload");
    }
    finally {
        if(conn){
            await conn.end();
            console.log("Andmebaasi ühendus suletud.");
        }
    }
};

module.exports = {
    galleryphotouploadPage,
    galleryphotouploadPagePost
};