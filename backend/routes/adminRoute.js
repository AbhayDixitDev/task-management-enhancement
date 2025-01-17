const router = require('express').Router();
const adminController = require("../controllers/adminController");
const upload = require('../utils/storage'); 


router.post("/createUser ", adminController.CreateUser );
router.post("/adminLogin", adminController.AdminLogin);
router.get("/showUsers", adminController.ShowUsers);
router.delete("/deleteUser /:id", adminController.DeleteUser );
router.get("/fetchUser /:id", adminController.FetchUser );
router.put("/editUser /:id", adminController.EditUser );
router.get("/showTasks", adminController.ShowTasks);
router.post("/assignTask", upload.single('file'), adminController.AssignTask);
router.delete("/deleteTask/:id", adminController.DeleteTask);
router.put("/updateTaskStatus/:id", adminController.UpdateTaskStatus);

module.exports = router;