const router = require('express').Router();
const userController = require("../controllers/userController");
const upload = require('../utils/storage'); 



router.post("/userLogin", userController.UserLogin);
router.post("/showUserTasks", userController.ShowUserTasks);
router.post("/submitTaskReport",upload.array('files'), userController.SubmitTaskReport);

module.exports = router;