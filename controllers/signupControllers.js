const dbInfo = require("../../../vp2025config");
const argon2 = require("argon2");
const mysql = require("mysql2/promise");
const dbConf = dbInfo.configData;

//@desc Page for creating user account
//@route GET /signup
//@access public

const signupPage = (req, res)=>{
	res.render("signup", {notice: "Ootan andmeid!"});
};

//@desc creating user account
//@route POST /signup
//@access public

const signupPagePost = async (req, res)=>{
	let conn;
	console.log(req.body);
	//Andmete lihtsam valideerimine
	if(
	  !req.body.firstNameInput ||
	  !req.body.lastNameInput ||
	  !req.body.birthDateInput ||
	  !req.body.genderInput ||
	  !req.body.emailInput ||
	  req.body.passwordInput.length < 8 ||
	  req.body.passwordInput !== req.body.confirmPasswordInput
	){
	  let notice = "Andmeid on puudu vÃµi need pole korrektsed!";
	  //console.log(notice);
	  return res.render("signup", {notice: notice});
	}
	try {
		conn = await mysql.createConnection(dbConf);
		//kontrollime, ega sellise emailiga kasutajat juba olemas ole
		let sqlReq = "SELECT id FROM users WHERE email = ?";
		const [users] = await conn.execute(sqlReq, [req.body.emailInput]);
		if(users.length > 0){
		  let notice = "Sellise e-maili aadressiga kasutaja on juba olemas!!";
	      //console.log(notice);
	      return res.render("signup", {notice: notice});
		}
		//krÃ¼pteerime parooli
		const pwdHash = await argon2.hash(req.body.passwordInput);
		sqlReq = "INSERT INTO users (first_name, last_name, birth_date, gender, email, password) VALUES (?,?,?,?,?,?)";
		const [result] = await conn.execute(sqlReq, [
		  req.body.firstNameInput,
	      req.body.lastNameInput,
	      req.body.birthDateInput,
	      req.body.genderInput,
	      req.body.emailInput,
		  pwdHash
		]);
		//console.log("Lisati foto id: " + result.insertId);
		res.render("signup", {notice: "Konto loodud!"});
	}
	catch(err){
		console.log(err);
		res.render("signup", {notice: "Tehniline viga!"});
	}
	finally {
		if(conn){
			await conn.end();
			console.log("AndmebaasiÃ¼hendus suletud!");
		}
	}
};

module.exports = {
	signupPage,
	signupPagePost
};
