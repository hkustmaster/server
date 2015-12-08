var express = require('express');
var router = express.Router();
var activity = require('../controllers/activity');
var intereact = require('../controllers/intereact');

/* GET all list page. */
router.post('/all', activity.showAll);
/* GET all list page. */
router.get('/edit/:id', activity.editOne);
//post an edit
router.post('/postEdit', activity.postEdit);

//delete by id
//router.get('/delete/:id', activity.delete);
//create a activity
router.get('/create', activity.createPage);

router.post('/new', activity.new);

router.post('/detail', activity.showDetail);

router.post('/showmine', activity.showMine);

router.post('/showaround', activity.showAround);

router.post('/join',intereact.joinActivity);

router.post('/leave',intereact.leaveActivity);

router.post('vote',intereact.vote)

module.exports = router;
