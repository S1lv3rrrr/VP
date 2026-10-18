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
			conn = await mysql.createConnection ({
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
			conn = await mysql.createConnection ({
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
			conn = await mysql.createConnection ({
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

//abifunktsioon rippmenüüde andmete lugemiseks
const loadRelationLists = async (conn) => {
	const [persons] = await conn.execute('SELECT id, first_name, last_name FROM person ORDER BY last_name');
	const [movies] = await conn.execute('SELECT id, title FROM movie ORDER BY title');
	const [professions] = await conn.execute('SELECT id, title FROM profession ORDER BY title');
	return { persons, movies, professions };
};

//@desc page for adding relations
//@route GET /eestifilm/seosed_add
//@access public
const seosedAdd = async (req, res) => {
	let conn;
	try {
		conn = await mysql.createConnection({
			host: process.env.DB_HOST,
			user: process.env.DB_USER,
			password: process.env.DB_PASS,
			database: process.env.DB_NAME
		});
		const lists = await loadRelationLists(conn);
		res.render('eestifilmiseosed_add', { ...lists, notice: 'Ootan sisestust!' });
	}
	catch (err) {
		console.log('Viga andmebaasist lugemisel: ' + err);
		res.render('eestifilmiseosed_add', { persons: [], movies: [], professions: [], notice: 'Tekkis viga!' });
	}
	finally {
		if (conn) { await conn.end(); }
	}
};

//@desc saving a relation
//@route POST /eestifilm/seosed_add
//@access public
const seosedAddPost = async (req, res) => {
	let conn;
	let notice = '';
	try {
		conn = await mysql.createConnection({
			host: process.env.DB_HOST,
			user: process.env.DB_USER,
			password: process.env.DB_PASS,
			database: process.env.DB_NAME
		});
		const personId = req.body.personInput;
		const movieId = req.body.movieInput;
		const professionId = req.body.professionInput;

		if (!personId || !movieId || !professionId) {
			notice = 'Vali kõik rippmenüüd!';
		} else {
			//kas valitud amet on näitleja?
			const [profRows] = await conn.execute('SELECT title FROM profession WHERE id = ?', [professionId]);
			const isActor = profRows.length > 0 && profRows[0].title.toLowerCase() === 'näitleja';

			let role = null;
			if (isActor) {
				role = req.body.roleInput ? req.body.roleInput.trim() : '';
				if (role === '') {
					notice = 'Näitleja puhul tuleb sisestada tegelaskuju nimi!';
				}
			}

			if (notice === '') {
				//kontrollime, kas täpselt sama seos on juba olemas (<=> töötab ka NULL-iga)
				const [existing] = await conn.execute(
					'SELECT id FROM person_in_movie WHERE person_id = ? AND movie_id = ? AND profession_id = ? AND role <=> ?',
					[personId, movieId, professionId, role]
				);
				if (existing.length > 0) {
					notice = 'Selline seos on juba olemas, ei salvestatud!';
				} else {
					await conn.execute(
						'INSERT INTO person_in_movie (person_id, movie_id, profession_id, role) VALUES (?,?,?,?)',
						[personId, movieId, professionId, role]
					);
					notice = 'Seos salvestati, ootan uut sisestust!';
				}
			}
		}
		const lists = await loadRelationLists(conn);
		res.render('eestifilmiseosed_add', { ...lists, notice });
	}
	catch (err) {
		console.log('Viga andmebaasiga suhtlemisel: ' + err);
		res.render('eestifilmiseosed_add', { persons: [], movies: [], professions: [], notice: 'Tekkis viga, andmeid ei salvestatud!' });
	}
	finally {
		if (conn) { await conn.end(); }
	}
};

//@desc list of relations
//@route GET /eestifilm/seosed
//@access public
const seosed = async (req, res) => {
	let conn;
	try {
		conn = await mysql.createConnection({
			host: process.env.DB_HOST,
			user: process.env.DB_USER,
			password: process.env.DB_PASS,
			database: process.env.DB_NAME
		});
		const sqlReq = `SELECT p.first_name, p.last_name, m.title AS movie_title, pr.title AS profession_title, pim.role
			FROM person_in_movie pim
			JOIN person p ON pim.person_id = p.id
			JOIN movie m ON pim.movie_id = m.id
			JOIN profession pr ON pim.profession_id = pr.id
			ORDER BY m.title, p.last_name`;
		const [sqlRes] = await conn.execute(sqlReq);
		res.render('eestifilmiseosed', { relationList: sqlRes });
	}
	catch (err) {
		console.log('Viga andmebaasist lugemisel: ' + err);
		res.render('eestifilmiseosed', { relationList: [] });
	}
	finally {
		if (conn) { await conn.end(); }
	}
};

module.exports = {
	eestifilm,
	inimesed,
	inimesedAdd,
	inimesedAddPost,
	filmid,
	ametid,
	seosedAdd,
	seosedAddPost,
	seosed
}