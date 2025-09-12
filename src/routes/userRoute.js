;const express = require("express");
const { register, deleteuser, getUserById, getAllUsers } = require("../controllers/userController.js");
const verifyToken = require("../Middlwares/verifytokenMiddleware.js");

const router = express.Router();

router.post("/signup", register);
router.delete('/userdelete',deleteuser)

router.get('/',getAllUsers)
router.get('/getuser',verifyToken, getUserById)
            
module.exports = router;