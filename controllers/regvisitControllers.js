const fs = require("fs").promises;
const textRef2 = "public/txt/visitlog.txt";
const dateEt = require("../src/dateTimeET");

//@desc Home page for registering a visit
//@route GET /regvisit
//access public

const visitRegistrationPage = (req, res)=>{
    res.render("regvisit");
};

//@desc Home page for submiting a visit registration
//@route GET /regvisit
//access public

const visitRegistrationPost = async (req, res)=>{
    const sisend = req.body.firstNameInput + " " + req.body.lastNameInput + ", " + dateEt.longDate() + " kell " + dateEt.time() + ";" + "\n";
    let file;
    try {
        file = await fs.open(textRef2, "a");
        await file.appendFile(sisend, "utf-8"); 
        //console.log("Salvestatud!")
        res.render("visitregistered", {külastaja: req.body.firstNameInput + " " + req.body.lastNameInput});
    }
     catch(err) {
        console.log("Kahjuks tekkis viga " + err)
    }
    finally {
        if (file) await file.close();
    }
};

//@desc Home page for viewing visit log
//@route GET /vistlog
//access public

const visitLogPage = async (req, res)=>{
    let listData = [];
    let file;
    try {
        file = await fs.readFile(textRef2, "utf8");
        let tempListData = file.split(";");
            for (let i = 0; i < tempListData.length - 1; i ++) {
                listData.push(tempListData[i]); //push 
            }
        res.render("genericlist", {h2: "Külastajad", listData: listData});
    }
    catch(err){
        res.render("genericlist", {h2: "Külastajad", listData: ["Vabandame, hetkel ühtki külastajat ei leitud"]});
    }
};

module.exports = {
    visitRegistrationPage,
    visitRegistrationPost,
    visitLogPage
};