const dbInfo = require("../../../vp2025config");
const argon2 = require("argon2");
const mysql = require("mysql2/promise");
const dbConf = dbInfo.configData;

//@desc Page for logging in
//@route GET /signin
//@access public

const signinPage = (req, res)=>{
	res.render("signin", {notice: "Sisesta oma kasutajatunnus ja parool!"});
};

//@desc Log in
//@route POST /signin
//@access public

const signinPagePost = async (req, res)=>{
	let conn;
	console.log(req.body);
	if(
	  !req.body.emailInput ||
	  !req.body.passwordInput
	){
	  let notice = "Sisselogimise andmed on puudulikud!";
	  //console.log(notice);
	  return res.render("signin", {notice: notice});
	}
	try {
		conn = await mysql.createConnection(dbConf);
		//küsime andmebaasist sisestatud kasutajatunnusega kasutaja id ja parooli
		let sqlReq = "SELECT id, password FROM users WHERE email = ?";
		const [users] = await conn.execute(sqlReq, [req.body.emailInput]);
		if(users.length === 0){
			let notice = "Kasutajatunnus ja/või parool on vale"
			//console.log(notice);
	      	return res.render("signin", {notice: notice});
		}
		const user = users[0];
		//kontrollime, kas sisestatud paroolist saab sellise räsi nagu andmebaasis
		const match = await argon2.verify(user.password, req.body.passwordInput);
		//kui parool ja räsi matchivad
		if (match){
			//logisime edukalt sisse
			//let notice = "Oled sisse logitud"
			//return res.render("signin", {notice: notice});
			//võtame kasutusele sessioonimuutujad
			req.session.userId = user.id;
			sqlReq = "SELECT first_name, last_name FROM users WHERE id = ?";
			const [users] = await conn.execute(sqlReq, [req.session.userId]);
			req.session.userFirstname = users[0].first_name;
			req.session.userLastname = users[0].last_name;
			return res.redirect("/home");
		}
		else {
			//ei loginud sisse
			let notice = "Sisselogimise andmed on puudulikud!";
	  		//console.log(notice);
	  		return res.render("signin", {notice: notice});
		}
		res.render("signin", {notice: "Miski läks valesti"});
	}
	catch(err){
		console.log(err);
		res.render("signin", {notice: "Tehniline viga!"});
	}
	finally {
		if(conn){
			await conn.end();
			console.log("AndmebaasiÃ¼hendus suletud!");
		}
	}
};

module.exports = {
	signinPage,
	signinPagePost
};
