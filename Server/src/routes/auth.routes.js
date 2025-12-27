const express = require('express')
const {registerUser,loginUser,logoutUser, updateDietaryPreferences} = require('../controllers/auth.controller')
const {authUser} = require('../middlewares/auth.middleware')

const router = express.Router()


router.post('/register',registerUser)
router.post('/login',loginUser)
router.post('/logout',logoutUser)
router.put('/dietary-preferences', authUser, updateDietaryPreferences)




module.exports = router