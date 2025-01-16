const router = require('express').Router()
const adminController = require("../controllers/adminController")
// router.post("/login", )

router.post("/createUser",adminController.CreateUser)
router.post("/adminLogin",adminController.AdminLogin)
router.get("/showUsers",adminController.showUsers)
router.delete("/deleteUser/:id",adminController.deleteUser)
router.get("/fetchUser/:id",adminController.fetchUser)
router.put("/editUser/:id",adminController.editUser)

module.exports = router