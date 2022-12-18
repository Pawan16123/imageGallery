const express = require('express');
const router = express.Router();



// Require controllers
const {profilePage, createUser, getAllUsers, multerLogic, getUser, deleteUser, updateUser} = require('../controller/user.js');
const upload = multerLogic();

router.param('userId', getUser );

// router.get('/', profilePage);

router.get('/getallusers', getAllUsers);

router.post('/create', upload.single('image') ,createUser);

router.delete('/delete/:userId', deleteUser);

router.post('/update/:userId', updateUser);

module.exports = router;