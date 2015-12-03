var express = require('express');
var router = express.Router();
var activity = require('../controllers/activity');
var intereact = require('../controllers/intereact');

/* GET all list page. */
router.get('/all', activity.showAll);
/* GET all list page. */
router.get('/edit/:id', activity.editOne);
//post an edit
router.post('/postEdit', activity.postEdit);

//delete by id
//router.get('/delete/:id', activity.delete);
//create a activity
router.get('/create', activity.createPage);

router.post('/new', activity.new);

router.post('/detail/:id', activity.showDetail);

router.get('/join/:id',intereact.joinActivity);

router.get('/leave/:id',intereact.leaveActivity);

module.exports = router;
