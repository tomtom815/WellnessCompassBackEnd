const usersDB = {
  users: require('../models/User'),
  setUsers: function (data) { this.users = data }
}

const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');
require('dotenv').config();
const fsPromises = require('fs').promises();
const path = require('path');


const handleLogin = async (request, res) => {
  const { username, password } = request.body;

  if (!username || !password) return res.status(400).json({ message: 'Username and password are required.' });

  try {
    const foundUser = await usersDB.users.findOne({ username }).exec();

    if (!foundUser) return res.sendStatus(401).json({ message: 'Authentication failed' }); // Unauthorized

    // Compare passwords/perform authentication
    const isPasswordMatch = await bcrypt.compareSync(password, foundUser.password);

    if (isPasswordMatch) {

      return res.status(200).json({ message: 'Login successful' });
    } else {
      return res.status(401).json({ message: 'Authentication failed' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};


module.exports = { handleLogin };