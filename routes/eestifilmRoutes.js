const express = require('express')
const router = express.Router();

//kontrollerid
const{
	eestifilm,
	inimesed,
	inimesedAdd,
	inimesedAddPost,
	filmid,
	ametid,
	seosedAdd,
	seosedAddPost,
	seosed} = require('../controllers/eestifilmControllers');


router.route('/').get(eestifilm);

router.route('/inimesed').get(inimesed);

router.route('/inimesed_add').get(inimesedAdd);

router.route('/inimesed_add').post(inimesedAddPost);

router.route('/eestifilmid').get(filmid);

router.route('/eestifilmiametid').get(ametid);

router.route('/seosed_add').get(seosedAdd);

router.route('/seosed_add').post(seosedAddPost);

router.route('/seosed').get(seosed);

module.exports = router;