const express = require('express');
const fs = require('fs').promises;
//moodul URL-i lahtiharutamiseks, et saaks POST osad ka kättesaadavaks
const bodyparser = require('body-parser');
//moodul andbebaasiga suhtlemiseks, promises osaga async programmeerimise jaoks
const mysql = require('mysql2/promise');
//moodul .env faili lugemiseks, keskkonnamuutujate parsimiseks
require('dotenv').config();

const dateTimeET = require('./src/dateTimeET');

const textRef = 'public/txt/vanasonad.txt';
const regTextRef = 'public/txt/visits.txt';

//käivitan express.js funktsiooni ja annan nimeks 'app'
const app = express();
//määrame veebilehtedele mallide renderdamise mootori
app.set('view engine', 'ejs');
//määran ühe päis kataloogi virtuaalses serveris kättesaadavaks
app.use(express.static('public'));
app.use(bodyparser.urlencoded({extended: false}));

//loon andmebaasiühenduse
/*const conn = mysql.createConnection ({
	host: 'localhost',
	user: 'if26',
	password: 'ifikas26',
	database: 'if26_silver'
});*/

//marsruudid
app.get('/', (req, res)=>{
	//res.send('Express.js läks käima ja serveerib meile veebi.');
	const dayNow = dateTimeET.day();
	const dateNow = dateTimeET.fullDate(0);
	const timeNow = dateTimeET.fullTime();
	res.render('index', {dayNow: dayNow, dateNow: dateNow, timeNow: timeNow});
});

app.get('/vanasona', async (req, res)=>{
	try {
		const data = await fs.readFile(textRef, 'utf8');
		let folkWisdom = data.split(';');
		res.render('vanasona', {wisdom: folkWisdom[Math.round(Math.random() * (folkWisdom.length - 1))]});
	}
	catch (err) {
		res.render('vanasona', {wisdom: 'Ei leidnud ühtegi vanasõna.'});
	}
});

app.get('/regvisit', (req, res)=>{
	res.render('regvisit');
});

app.get('/terraria', (req, res)=>{
	res.render('terraria');
});

app.post('/regvisit', async (req, res)=>{
	console.log(req.body);
	try {
		
		const dateNow = dateTimeET.fullDate(0);
		const timeNow = dateTimeET.fullTime();

		await fs.open(regTextRef, 'a');
		await fs.appendFile(regTextRef, req.body.nameInput + ';' + dateNow + ',' +  timeNow +';');
		res.render('regvisit');
	}
	catch (err){
		console.log(err);
		res.render('regvisit');
	}
});

app.get('/lastvisit', async (req, res)=>{
	try {
		const lastVisit = await fs.readFile(regTextRef, "utf8");
		let displayVisit = lastVisit.split(";");
		res.render('lastvisit', {
			visit:
				displayVisit[displayVisit.length - 2].split(",")
		});
	}
	catch (err) {
		res.render('lastvisit', {wisdom: 'Ei ole külastusi!'});
	}

});

app.get('/eestifilm', (req,res)=>{
	res.render('eestifilm');
});

app.get('/eestifilm/inimesed', async (req,res)=>{
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
	
});

app.get('/eestifilm/inimesed_add', (req,res)=>{
	res.render('eestifilmiinimesed_add', {notice: 'Ootan sisestust!'});
});

app.post('/eestifilm/inimesed_add', async (req,res)=>{
	console.log(req.body);
	//kontrollime andmete olemasolu
	if(!req.body.firstNameInput || !req.body.lastNameInput || req.body.bornInput >= new Date()){
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
});

app.listen(5015);