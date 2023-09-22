const express = require('express')
const router = express.Router()
const usersController = require('../controllers/usersController')

// Can be used to require JWT for a specific route by
// .route(verifyJWT, usersController.method)
// Not sure yet where it should be used
const verifyJWT = require('../middleware/verifyJWT');

router.route('/')
    .get(usersController.getAllUsers) //read
    //.post(usersController.createNewUser) //create
    .patch(usersController.updateUser) //update
    .delete(usersController.deleteUser) //delete

router.route('/:user')
    .get(usersController.getOneUser) //read one user


    module.exports = router;