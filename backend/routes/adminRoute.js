const router = require('express').Router()
const adminController = require("../controllers/adminController")
// router.post("/login", )

router.post("/createUser",adminController.CreateUser)
router.post("/adminLogin",adminController.AdminLogin)

module.exports = router