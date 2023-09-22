const User = {
    users: require('../models/User'),
    setUsers: function (data) { this.users = data }
}

const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');

const handleNewUser = asyncHandler(async(req, res) =>{
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

module.exports = { handleNewUser };