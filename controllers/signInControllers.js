const mysql = require('mysql2/promise');
const argon = require('argon2');

//@desc page for logging in
//@route GET /signIn
//@access public

const signInPage = (req, res) => {
	res.render('signUp', {notice: 'Ootan andmeid!'});
};

//@desc page for logging in
//@route POST /signIn
//@access public

const signInPagePost = async (req, res) => {
	console.log(req.body);
	let conn;
	let notice = '';
	//puhastame andmeid ja valideerime (kontrollime)
	const email = req.body.emailInput.trim();
	
	//Kontrollime kas kõik on olemas
	if(!email || !req.body.passwordInput){
		notice = 'Andmeid on puudu!';
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
		if (users.length === 0){
			notice = 'Sisestatud kasutajatunnus ja/või parool oli vale!';
			return res.render('signUp', {notice: notice});
		}
		//Kui on olemas, kas parool klapib
		const match = await argon.verify(users[0].password, req.body.passwordInput);
		if(match){
			console.log('Oled sisse loginud kasutaja: ' + users[0].id);
			return res.redirect('/home');
		} else {
			notice = 'Sisestatud kasutajatunnus ja/või parool oli vale!';
			return res.render('signUp', {notice: notice});
		}
		
	}
	catch (err) {
		console.log('Viga: ' + err);
		return res.render('signUp', {notice: 'Sisselogimine ei õnnestunud!'});
	}
	finally {
		if(conn){
			await conn.end();
		}
	}
}

module.exports = {
	signInPage,
	signInPagePost
}

//Uusima kindla privaatsusega pildi päring
//SELECT filename, alttext FROM tabelinimi WHERE id=SELECT MAX(id) FROM tabelinimi WHERE privacy=? AND deleted IS NULL