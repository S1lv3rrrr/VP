const express = require('express');
const multer = require('multer');
const router = express.Router();

//Seadistame multer vahevara (middleware) failide üleslaadimiseks
//Määran üleslaadimise kataloogi
const upload = multer({dest: './public/gallery/orig/'});
//Määrata saab veel näiteks lubatud failitüüpe, faili suuruse piirangut jne

//kontrollerid
const{
	galleryPhotoUpload,
	galleryPhotoUploadPost} = require('../controllers/galleryPhotoUploadControllers');


router.route('/').get(galleryPhotoUpload);

//Post osa suunatakse läbi vahevara - upload
router.route('/').post(upload.single('photoInput'), galleryPhotoUploadPost);

module.exports = router;