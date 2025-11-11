const express = require('express')
const {WantHiring} = require('../controllers/hireController')

const router = express.Router()

router.post("/wanthiring",WantHiring)

module.exports = router