const mysql = require('mysql2/promise')
const fs = require('fs').promises;
const sharp = require('sharp');

//@desc home page for uploading gallery photos
//@route GET /galleryPhotoUpload
//@access public

const galleryPhotoUpload = (req, res) => {
	res.render('galleryPhotoUpload');
};

//@desc home page for uploading gallery photos
//@route GET /galleryPhotoUpload
//@access public

const galleryPhotoUploadPost = async (req, res) => {
	console.log(req.body);
	console.log(req.file);
	let conn;
	try {
		//genereerime oma failinime
		const fileName = 'vp_' + Date.now() + '.jpg';
		await fs.rename(req.file.path, req.file.destination + fileName);
		//Pildi suuruse muutmine (max 800x600)
		await sharp(req.file.destination + fileName).resize(800, 600).jpeg({quality: 90}).toFile('./public/gallery/normal/' + fileName);
		//Teeme pisipildi (100x100)
		await sharp(req.file.destination + fileName).resize(100, 100).jpeg({quality: 90}).toFile('./public/gallery/thumbs/' + fileName);
		let sqlReq = 'INSERT INTO galleryphotos (filename, origname, alttext, privacy, userid) VALUES (?,?,?,?,?)';
		const userId = 1; //See on ajutine, kuni päris kasutajakontod teeme
		conn = await mysql.createConnection({
			host: process.env.DB_HOST,
			user: process.env.DB_USER,
			password: process.env.DB_PASS,
			database: process.env.DB_NAME
		});
		const [result] = await conn.execute(sqlReq, [fileName, req.file.originalname, req.body.altInput, req.body.privacyInput, userId]);
		console.log('Salvestati kirje id: ' + result.insertId); //Teinekord kasulik teada
		res.render('galleryPhotoUpload');
	}
	catch (err) {
		console.log('Viga: ' + err);
		res.render('galleryPhotoUpload');
	}
	finally {
		if(conn){
			await conn.end();
		}
	}
	
};

module.exports = {
	galleryPhotoUpload,
	galleryPhotoUploadPost
}

//Uusima kindla privaatsusega pildi päring
//SELECT filename, alttext FROM tabelinimi WHERE id=SELECT MAX(id) FROM tabelinimi WHERE privacy=? AND deleted IS NULL