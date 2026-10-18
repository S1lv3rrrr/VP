const express = require('express')
const router = express.Router();

//kontrollerid
const{
	regvisit,
	regvisitPost,
	lastvisit} = require('../controllers/visitControllers');
	
router.route('/').get(regvisit);

router.route('/').post(regvisitPost);

router.route('/lastvisit').get(lastvisit);

module.exports = router;