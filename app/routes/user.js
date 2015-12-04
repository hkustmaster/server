var express = require('express')
var router =express.Router()
var User= require('../controllers/user')

router.post('/edit',User.edit)

module.exports =router
