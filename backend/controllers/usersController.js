const User = require('../models/User');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');

// @desc Get all users
// @route GET /users
// @access Private

const getAllUsers = asyncHandler(async(req, res) =>{
    const users = await User.find().select('-password').lean();
    if(!users?.length){
        return res.status(400).json({message: 'No users found'})
    }
    res.json(users);
});

//get a single user @route /users/USERNAMEHERE

const getOneUser = asyncHandler(async(req, res) => {
    //get param from browser
    const userSearch = req.params.user
    const user = await User.find({
        //search param
            username : userSearch
        }
    );
    if(!user?.length){
        //no user
        return res.status(400).json({message: 'No user found'})
    }
    res.json(user);
});

// @desc Create new user
// @route POST /users
// @access Private

const createNewUser = asyncHandler(async(req, res) =>{
    const { firstName, lastName, username, password } = req.body
   
    // confirm data
    if(!username || !password || !firstName){
        return res.status(400).json({ message: 'Required fields missing' })
    }

    // check duplicates
    const duplicate = await User.findOne({username}).lean().exec()
    if(duplicate){
        return res.status(409).json({message: 'Duplicate username'})
    }

    // Hash password
    const hashedPwd = await bcrypt.hash(password, 10) // salt rounds
    const userObject = { username, "password": hashedPwd, firstName, lastName};

    // Create and store user
    const user = await User.create(userObject);
    if(user){
        res.status(201).json({message: `New user ${username} created`})
    }else{
        res.status(400).json({message: 'Invalid user data received'})
    }
});

// @desc update user
// @route PATCH /users
// @access Private

const updateUser = asyncHandler(async(req, res) =>{
    const {id,username, firstName, lastName, password, weight, height, steps, activeMinutes, hoursSlept, dailyMeals, age, gender, userConsent} = req.body

    // confirm data
    if(!username){
        return res.status(400).json({message: 'Required info missing'})
    }

    const user = await User.findById(id).exec()

    if(!user){
        return res.status(400).json({message: 'User not found'})
    }

    //check duplicate
    const duplicate = await User.findOne({ username }).lean().exec()

    //Allow updates to the original user
    if(duplicate && duplicate?._id.toString() !== id){
        return res.status409.json({message: 'Duplicate username'})
    }

    if(username){
        user.username = username
    }
    if(firstName){
        user.firstName = firstName
    }
    if(lastName){
        user.lastName = lastName
    }
    if(weight){
        user.weight.push(weight)
    }
    if(height){
        user.height.push(height) 
    }
    if(steps){
        user.steps.push(steps)
    }
    if(activeMinutes){
        user.activeMinutes.push(activeMinutes)
    }
    if(hoursSlept){
        user.hoursSlept.push(hoursSlept)
    }
    if(dailyMeals){
        user.dailyMeals.push(dailyMeals);
    }
    if(gender){
        user.gender = gender
    }
    if(age){
        user.age = age
    }

    if(userConsent !== 'undefined'){
        user.userConsent = userConsent;
    }

    if(password){
        //Hash password
        user.password = await bcrypt.hash(password, 10)
    }
    const updatedUser = await user.save()

    res.json(updatedUser)
});

// @desc delete user
// @route DELETE /users
// @access Private

const deleteUser = asyncHandler(async(req, res) =>{
    const { id } = req.body
    if(!id){
        return res.status(400).json({message: 'User ID Required'})
    }

    const user = await User.findById(id).exec()

    if(!user){
        return res.status(400).json({message: 'User not found'})
    }

    const result = await user.deleteOne()

    const reply = `Username ${result.username} with ID ${result._id} deleted`

    res.json(reply)
});


module.exports = {
    getAllUsers,
    getOneUser,
    deleteUser,
    updateUser,
    createNewUser
}
