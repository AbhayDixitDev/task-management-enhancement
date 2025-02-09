const router = require('express').Router();
const adminController = require("../controllers/adminController");
const upload = require('../utils/storage'); 


router.post("/createUser",adminController.CreateUser );
router.post("/adminLogin", adminController.AdminLogin);
router.get("/showUsers", adminController.ShowUsers);
router.delete("/deleteUser /:id", adminController.DeleteUser );
router.get("/fetchUser /:id", adminController.FetchUser );
router.put("/editUser /:id", adminController.EditUser );
router.get("/showTasks", adminController.ShowTasks);
router.post("/assignTask", upload.array('files'), adminController.AssignTask);
router.delete("/deleteTask/:id", adminController.DeleteTask);
router.put("/updateTaskStatus/:id", adminController.UpdateTaskStatus);
router.put("/changePassword/:id", adminController.ChangePassword);
router.post("/resetPassword/sendOtp", adminController.ResetSendOtp);
router.post("/resetPassword/confirmOtp", adminController.ConfirmOtp);
router.post("/resetPassword/newPassword", adminController.NewPassword);
router.get("/taskReports/:id", adminController.TaskReports);
router.put("/feedback/:id", adminController.Feedback);

module.exports = router;