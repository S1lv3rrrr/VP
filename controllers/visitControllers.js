const mysql = require('mysql2/promise')
const fs = require('fs').promises;
const path = require('path');
const dateTimeET = require('../src/dateTimeET');
const regTextRef = path.join(__dirname, '../public/txt/visitlog.txt');
//@desc home page for visitor logging
//@route GET /regvisit
//@access public

//app.get('/regvisit', (req, res)=>{
const regvisit = (req, res) => {
	res.render('regvisit');
};

//@desc home page for visitor logging
//@route POST /regvisit
//@access public

//app.post('/regvisit', async (req, res)=>{
const regvisitPost = async (req, res) => {
	console.log(req.body);
	try {
		
		const dateNow = dateTimeET.fullDate(0);
		const timeNow = dateTimeET.fullTime();

		await fs.appendFile(regTextRef, req.body.nameInput + ',' + dateNow + ',' +  timeNow +';');
		res.render('regvisit');
	}
	catch (err){
		console.log(err);
		res.render('regvisit');
	}
};

//@desc home page for checking last submitted visits
//@route GET /regvisit/lastvisit
//@access public

//app.get('/lastvisit', async (req, res)=>{
const lastvisit = async (req, res) => {
	try {
		const lastVisit = await fs.readFile(regTextRef, "utf8");
		let displayVisit = lastVisit.split(";");
		res.render('lastvisit', {
			visit:
				displayVisit[displayVisit.length - 2].split(",")
		});
	}
	catch (err) {
		console.log(err);
		res.render('lastvisit', {visit: null, wisdom: 'Ei ole külastusi!'});
	}

};

module.exports = {
	regvisit,
	regvisitPost,
	lastvisit
}