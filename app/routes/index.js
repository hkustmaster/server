var express = require('express');
var router = express.Router();
//var Index = require('../controllers/index')
var User = require('../controllers/user')
//var Movie = require('../controllers/movie')
//var Comment = require('../controllers/comment')
//var Category = require('../controllers/category')
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('pages/index', { title: 'Express' });
});
router.post('/signup', User.signup)
router.post('/signin', User.signin)
router.get('/signin', User.showSignin)
router.get('/signup', User.showSignup)
router.post('/edit',User.edit)
//router.get('/logout', User.logout)

module.exports = router;
