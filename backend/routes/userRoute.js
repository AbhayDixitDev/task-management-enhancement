const router = require('express').Router();
const userController = require("../controllers/userController");
const upload = require('../utils/storage'); 



router.post("/userLogin", userController.UserLogin);
router.post("/showUserTasks", userController.ShowUserTasks);
router.post("/submitTaskReport",upload.array('files'), userController.SubmitTaskReport);
router.get("/taskReports/:id", userController.TaskReports);
router.put("/changePassword/:id", userController.ChangePassword);
router.post("/resetPassword/sendOtp", userController.ResetSendOtp);
router.post("/resetPassword/confirmOtp", userController.ConfirmOtp);
router.post("/resetPassword/newPassword", userController.NewPassword);

module.exports = router;