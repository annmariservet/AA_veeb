const fs = require("fs").promises; //kuna me tahame hakkata ootama kuni see tegevus on tegtud paneme promises
const dbInfo = require("../../../vp2025config");
const mysql = require("mysql2/promise");
const dbConf = dbInfo.configData;

//@desc Home page for photo gallery
//@route GET /photogallery
//access public

const newsViewPage = async (req, res)=>{
    let conn;
   
    try {
        conn = await mysql.createConnection(dbConf);
        const [news] = await conn.execute(
            "SELECT title, content, photo, photo_alt, added FROM news WHERE expire > NOW() ORDER BY added DESC"
        );
        
        res.render("news", {newsData: news});
    }
    catch(err) {
        console.log(err);
        res.render("news", {newsData: [], notice: "Uudiste laadimine ebaõnnestus!"});
    }
    finally {
        if(conn) {
            await conn.end();
        }
    }
   //res.render("news")
};

module.exports = {
    newsViewPage
};