const router = require('express').Router();
const adminController = require("../controllers/adminController");
const upload = require('../utils/storage'); 


router.post("/createUser ", adminController.CreateUser );
router.post("/adminLogin", adminController.AdminLogin);
router.get("/showUsers", adminController.ShowUsers);
router.delete("/deleteUser /:id", adminController.DeleteUser );
router.get("/fetchUser /:id", adminController.FetchUser );
router.put("/editUser /:id", adminController.EditUser );
router.post("/assignTask", upload.single('file'), adminController.AssignTask);
module.exports = router;