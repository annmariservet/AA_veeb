const express = require("express");
const fs = require("fs");
const bodyparser = require("body-parser");
//const mysql = require("mysql2/promise");
const dateEt = require("./src/dateTimeET");
//const dbInfo = require("../../vp2025config");
const textRef = "public/txt/vanasonad.txt";
const textRef2 = "public/txt/visitlog.txt";
const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyparser.urlencoded({extended: false}));

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

//eestifilmi marsruudid
const eestifilmRouter = require("./routes/eestifilmRoutes");
app.use("/eestifilm", eestifilmRouter);

app.listen(5309);