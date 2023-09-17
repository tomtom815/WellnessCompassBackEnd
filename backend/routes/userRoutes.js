const express = require('express')
const router = express.Router()
const usersController = require('../controllers/usersController')
const verifyJWT = require('../middleware/verifyJWT');

router.route('/')
    .get(verifyJWT, usersController.getAllUsers) //read
    .post(usersController.createNewUser) //create
    .patch(usersController.updateUser) //update
    .delete(usersController.deleteUser) //delete

router.route('/:user')
    .get(usersController.getOneUser) //read one user


    module.exports = router;