const mysql = require('mysql2/promise');
const validator = require('validator');
const argon = require('argon2');

//@desc page for creating user account
//@route GET /signUp
//@access public

const signUpPage = (req, res) => {
	res.render('signUp', {notice: 'Ootan andmeid!'});
};

//@desc page for creating user account
//@route POST /signUp
//@access public

const signUpPagePost = async (req, res) => {
	console.log(req.body);
	let conn;
	let notice = '';
	//puhastame andmeid ja valideerime (kontrollime)
	const firstName = validator.escape(req.body.firstNameInput.trim());
	const lastName = validator.escape(req.body.lastNameInput.trim());
	const birthDate = req.body.birthDateInput;
	const gender = req.body.genderInput;
	const email = req.body.emailInput.trim();
	const password = req.body.passwordInput;
	const confirmPassword = req.body.confirmPasswordInput;
	
	//Kontrollime kas kõik on olemas
	if(!firstName || !lastName || !birthDate || !gender || !email || !password || !confirmPassword){
		notice = 'Andmeid on puudu!';
		return res.render('signUp', {notice: notice});
	}
	
	//Kas on e-mail korrektne
	if(!validator.isEmail(email)){
		notice = 'Meiliaadress pole korrektne!';
		return res.render('signUp', {notice: notice});
	}
	
	//Kas sünnipäev on korrektne
	if(!validator.isDate(birthDate) || validator.isAfter(birthDate))
		notice = 'Sisestatud sünnikuupäev pole korrektne!';
		return res.render('signUp', {notice: notice});
	
	//Kas parool on piisavalt tugev
	const passwordOptions = {minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1};
	if(!validator.isStrongPassword(password, passwordOptions)){
		notice = 'Sisestatud parool pole piisavalt tugev!';
		return res.render('signUp', {notice: notice});
	}
	
	//Kas kaks tükki on ühesugused
	if(password != confirmPassword){
		notice = 'Sisestatud paroolid ei kattu!';
		return res.render('signUp', {notice: notice});
	}
	
	try {
		conn = await mysql.createConnection({
			host: process.env.DB_HOST,
			user: process.env.DB_USER,
			password: process.env.DB_PASS,
			database: process.env.DB_NAME
		});
		let sqlReq = 'SELECT id FROM users WHERE email = ?';
		const [users] = await conn.execute(sqlReq, [email]);
		if (users.length > 0){
			notice = 'Selline kasutaja on juba olemas!';
			return res.render('signUp', {notice: notice});
		}
		//Kui pole olemas, siis salvestame
		sqlReq = 'INSERT INTO users (firstname, lastname, birthdate, gender, email, password) VALUES (?, ?, ?, ?, ?, ?)';
		//Krüpteerime parool
		const pwdHash = await argon.hash(password);
		const [result] = await conn.execute(sqlReq, [
			firstName,
			lastName,
			birthDate,
			gender,
			email,
			pwdHash
		]);
		notice = 'Loodi kasutajakonto!';
		res.render('signUp', {notice: notice});
	}
	catch (err) {
		console.log('Viga: ' + err);
		return res.render('signUp', {notice: notice});
	}
	finally {
		if(conn){
			await conn.end();
		}
	}
}

module.exports = {
	signUpPage,
	signUpPagePost
}

//Uusima kindla privaatsusega pildi päring
//SELECT filename, alttext FROM tabelinimi WHERE id=SELECT MAX(id) FROM tabelinimi WHERE privacy=? AND deleted IS NULL