const fs = require("fs").promises; //kuna me tahame hakkata ootama kuni see tegevus on tegtud paneme promises
const dbInfo = require("../../../vp2025config");
const mysql = require("mysql2/promise");
const dbConf = dbInfo.configData;

//@desc Home page for photo gallery
//@route GET /photogallery
//access private

const photogalleryPage = async (req, res)=>{
    let conn;
   
    try {
        conn = await mysql.createConnection(dbConf);
        let sqlReq = "SELECT filename, alttext FROM galleryphotos_aa WHERE privacy >= ? AND deleted IS NULL";
        const privacy = 2;
        const [rows, fields] = await conn.execute(sqlReq, [privacy]);
        console.log(rows);
        let galleryData = [];
        for (let i= 0; i < rows.length; i ++) {
            let altText = "Galeriipilt";
            if(rows[i].alttext != ""){
                altText = rows[i].alttext;
            }
            galleryData.push({src: rows[i].filename, alt: altText});
        }
        res.render("photogallery", {galleryData: galleryData, imagehref: "/gallery/thumbs/"});
    }
    catch(err){
        console.log(err);
        res.render("photogallery", {galleryData: [], imagehref: "/gallery/thumbs/"});
    }
    finally {
        if(conn){
            await conn.end();
            console.log("Andmebaasi ühendus suletud.");
        }
    }
};

module.exports = {
    photogalleryPage
};