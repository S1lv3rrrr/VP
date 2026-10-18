const mysql = require('mysql2/promise')
//@desc home page for Estonian Film section
//@route GET /eestifilm
//@access public

const eestifilm = (req, res) => {
	res.render('eestifilm');
};

//@desc home page for list of people involved in Estonian Film industry
//@route GET /eestifilm/inimesed
//@access public

//app.get('/eestifilm/inimesed', async (req,res)=>{
const inimesed = async (req, res) => {
	console.log('Andmebaasiserver on: ' + process.env.DB_HOST);
	let conn;
	try {
		const conn = await mysql.createConnection ({
			host: process.env.DB_HOST,
			user: process.env.DB_USER,
			password: process.env.DB_PASS,
			database: process.env.DB_NAME
		});
		const sqlReq = 'SELECT * FROM person ORDER by last_name';
		const [sqlRes] = await conn.execute(sqlReq);
		console.log(sqlRes);
		res.render('eestifilmiinimesed', {personList: sqlRes});
	}
	catch (err){
		console.log('Viga andmebaasist lugemisel: ' + err);
		res.render('eestifilmiinimesed', {personList: []});
	}
	finally {
		if(conn){
			await conn.end();
		}
	}
	
};

//@desc home page for adding people involved in Estonian Film industry
//@route GET /eestifilm/inimesed_add
//@access public

//app.get('/eestifilm/inimesed_add', (req,res)=>{
const inimesedAdd = (req, res) => { 
	res.render('eestifilmiinimesed_add', {notice: 'Ootan sisestust!'});
};

//@desc home page for adding people involved in Estonian Film industry
//@route POST /eestifilm/inimesed_add
//@access public

//app.post('/eestifilm/inimesed_add', async (req,res)=>{
const inimesedAddPost = async (req, res) => {
	console.log(req.body);
	//kontrollime andmete olemasolu
	const now = new Date(); //fikseerib praeguse hetke
	const bornDate = new Date(req.body.bornInput); //teeb sisestatud kuupäevast (tekst, mis peaks olema standardsel kasutataval kuupäeva kujul) ajaobjekti
	//if(!req.body.firstNameInput || !req.body.lastNameInput || req.body.bornInput >= new Date()){
	if(isNaN(bornDate.getTime()) || bornDate > now){
		console.log('Andmed pole korrektsed');
		return res.render('eestifilmiinimesed_add', {notice: 'Andmed on puudulikud!'});
	}
	let conn;
	try {
		conn = await mysql.createConnection ({
			host: process.env.DB_HOST,
			user: process.env.DB_USER,
			password: process.env.DB_PASS,
			database: process.env.DB_NAME
		});
		let sqlReq = 'INSERT INTO person (first_name, last_name, born, deceased) VALUES (?,?,?,?)';
		let deceasedDate = null;
		if(req.body.deceasedInput !=''){
			deceasedDate = req.body.deceasedInput;
		}
		await conn.execute(sqlReq, [
			req.body.firstNameInput,
			req.body.lastNameInput,
			req.body.bornInput,
			deceasedDate
		]);
		res.render('eestifilmiinimesed_add', {notice: 'Andmed salvestati, ootan uut sisestust!'});
	}
	catch (err) {
		console.log('Viga andmebaasiga suhtlemisel: ' + err)
		res.render('eestifilmiinimesed_add', {notice: 'Tekkis viga, andmeid ei salvestatud!'});
	}
	finally {
		if(conn){
			await conn.end();
		}
	}
};

//@desc home page for list of films in Estonian Film industry 
//@route GET /eestifilm/eestifilmid
//@access public

//app.get('/eestifilm/eestifilmid', (req,res)=>{
const filmid = async (req, res) => {
	console.log('Andmebaasiserver on: ' + process.env.DB_HOST);
	let conn;
	try {
		const conn = await mysql.createConnection ({
			host: process.env.DB_HOST,
			user: process.env.DB_USER,
			password: process.env.DB_PASS,
			database: process.env.DB_NAME
		});
		const sqlReq = 'SELECT * FROM movie ORDER by title';
		const [sqlRes] = await conn.execute(sqlReq);
		console.log(sqlRes);
		res.render('eestifilmid', {movieList: sqlRes});
	}
	catch (err){
		console.log('Viga andmebaasist lugemisel: ' + err);
		res.render('eestifilmid', {movieList: []});
	}
	finally {
		if(conn){
			await conn.end();
		}
	}
	
};

//@desc home page for list of professions in Estonian Film industry 
//@route GET /eestifilm/eestifilmiametid
//@access public

//app.get('/eestifilm/eestifilmiametid', (req,res)=>{
const ametid = async (req, res) => {
	console.log('Andmebaasiserver on: ' + process.env.DB_HOST);
	let conn;
	try {
		const conn = await mysql.createConnection ({
			host: process.env.DB_HOST,
			user: process.env.DB_USER,
			password: process.env.DB_PASS,
			database: process.env.DB_NAME
		});
		const sqlReq = 'SELECT * FROM profession ORDER by title';
		const [sqlRes] = await conn.execute(sqlReq);
		console.log(sqlRes);
		res.render('eestifilmiametid', {professionList: sqlRes});
	}
	catch (err){
		console.log('Viga andmebaasist lugemisel: ' + err);
		res.render('eestifilmiametid', {professionList: []});
	}
	finally {
		if(conn){
			await conn.end();
		}
	}
};

module.exports = {
	eestifilm,
	inimesed,
	inimesedAdd,
	inimesedAddPost,
	filmid,
	ametid
}