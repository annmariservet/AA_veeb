const express = require("express");
const fs = require("fs");
const bodyparser = require("body-parser");
//lisan andmebaasiga suhtlemise paketi
const mysql = require("mysql2");
const dateEt = require("./src/dateTimeET");
//lisan andmebaasi juurdepääsu info
const dbInfo = require("../../vp2025config");
const textRef = "public/txt/vanasonad.txt";
const textRef2 = "public/txt/visitlog.txt";
//loome rakenduse, mis käivitab express raamistiku
const app = express();
//määran lehtede renderdaja (view engine)
app.set("view engine", "ejs");
//muudame  public kataloogi veebiserverile kättesaadavaks
app.use(express.static("public"));
//asun päringut parsima. parameetri lõpus on false, kui ainult tekst ja true, kui muud infot ka
app.use(bodyparser.urlencoded({extended: false}));

//loome andmebaasiühenduse conn on connection
const conn = mysql.createConnection({
    host: dbInfo.configData.host,
    user: dbInfo.configData.user,
    password: dbInfo.configData.passWord,
    database: dbInfo.configData.dataBase
});


app.get("/", (req, res)=>{
    //res.send("Express.js rakendus läks käima!");
    res.render("index");
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

app.get("/regvisit", (req, res)=>{
    res.render("regvisit");
});

app.post("/regvisit", (req, res)=>{
    console.log(req.body);
    //avan tekstifaili kirjutamiseks sellisel moel, et kui teda pole, luuakse (parameeter "a")
	fs.open("public/txt/visitlog.txt", "a", (err, file)=>{ //a täht tähendab ava või kui ei ole tekita
		if(err){
			throw(err);
		}
		else {
			//faili senisele sisule lisamine
			fs.appendFile("public/txt/visitlog.txt", req.body.firstNameInput + " " + req.body.lastNameInput + ", " + dateEt.longDate() + " kell " + dateEt.time() + ";" + "\n", (err)=>{
				if(err){
					throw(err);
				}
				else {
					console.log("Salvestatud!");
					res.render("visitregistered", {külastaja: req.body.firstNameInput + " " + req.body.lastNameInput});
				}
			});
		}
	});
});

app.get("/visitlog", (req, res)=>{
    let listData = [];
    fs.readFile(textRef2, "utf8", (err, data)=>{
        if(err){
            res.render("genericlist", {h2: "Külastajad", listData: ["Vabandame, hetkel ühtki külastajat ei leitud"]});
        }
        else {
            let tempListData = data.split(";");
            for (let i = 0; i < tempListData.length - 1; i ++) {
                listData.push(tempListData[i]); //push 
            }
            res.render("genericlist", {h2: "Külastajad", listData: listData});
        }
    });
});

app.get("/eestifilm", (req, res)=>{
    res.render("eestifilm");
});

app.get("/eestifilm/filmiinimesed", (req, res)=>{
    const sqlReq = "select * from person";
    //conn.query
    conn.execute(sqlReq, (err, sqlRes)=>{
        if (err) {
            console.log(err);
            res.render("filmiinimesed", {personList: []}); //[] tühi list
        }
        else {
            console.log(sqlRes);
            res.render("filmiinimesed", {personList: sqlRes});
        }
    });
});

app.get("/eestifilm/filmiinimesed_add", (req, res)=>{
    res.render("filmiinimesed_add", {notice: "Kirjuta ometi midagi!"});
});

app.post("/eestifilm/filmiinimesed_add", (req, res)=>{
	console.log(req.body);
    //kontrollin kas andmed on olemas
    if(!req.body.firstNameInput || !req.body.lastNameInput || !req.body.bornInput || req.body.bornInput > new Date()) {
        res.render("filmiinimesed_add", {notice: "Andmed on vigased!"});
    }
    else {
        let deceasedDate = null;
        if(req.body.deceasedInput != ""){
            deceasedDate = req.body.deceasedInput;
        }

        let sqlReq = "insert into person (first_name, last_name, born, deceased) values (?,?,?,?)";
        conn.execute(sqlReq, [req.body.firstNameInput, req.body.lastNameInput, req.body.bornInput, deceasedDate], (err, sqlRes)=>{
            if (err){
                console.log(err)
                res.render("filmiinimesed_add", {notice: "Tekkis tehniline viga: " + err});
            }
            else {
                res.render("filmiinimesed_add", {notice: "Andmed on salvestatud!"});
            }
        });
    }
});

app.get("/eestifilm/position_add", (req, res)=>{
    res.render("position_add");
});

app.post("/eestifilm/position_add", (req, res)=>{
    console.log(req.body);
    if(!req.body.positionNameInput){
        res.render("position_add", {notice: "Andmed on vigased!"});
    }
    else {
        let description = null;
        if(req.body.descriptionInput != ""){
            description = req.body.descriptionInput;
        }

        let sqlReq = "insert into position (position_name, description) values (?,?)";
        conn.execute(sqlReq, [req.body.positionNameInput, description], (err, sqlRes)=>{
            if(err){
                res.render("position_add", {notice: "Andmed on vigased!"});
            }
            else {
                res.render("position_add", {notice: "Andmed on salvestatud!"});
            }
        });
    }
});

app.listen(5309);