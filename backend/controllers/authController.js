const usersDB = {
  users: require('../models/User'),
  setUsers: function (data) { this.users = data }
}

const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');
require('dotenv').config();
const fsPromises = require('fs').promises;
const path = require('path');


const handleLogin = async (request, res) => {
  /**
   * Handles the login process.
   * 
   * @param {object} request - The request object containing the username and password in the request body.
   * @param {object} res - The response object.
   * @returns {object} - If the login is successful, the function sends a JSON response containing the access token.
   *                    If the username or password is missing, the function sends a 400 status with an error message.
   *                    If the user is not found or the password does not match, the function sends a 401 status with an error message.
   *                    If there is an internal server error, the function sends a 500 status with an error message.
  */
  const { username, password } = request.body;

  if (!username || !password) return res.status(400).json({ message: 'Username and password are required.' });

  try {
    const foundUser = await usersDB.users.findOne({ username }).exec();

    if (!foundUser) return res.sendStatus(401).json({ message: 'Authentication failed' }); // Unauthorized

    // Compare passwords/perform authentication
    const isPasswordMatch = await bcrypt.compare(password, foundUser.password);

    if (isPasswordMatch) {
      // Create JWTs
      const accessToken = jwt.sign(
        { "username": foundUser.username },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '30s' }
      );
      const refreshToken = jwt.sign(
        { "username": foundUser.username },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '1d' }
      );

      // Saving refreshToken with current user
      console.log(usersDB.users);
      const otherUsers = usersDB.users.filter(person => person.username !== foundUser.username);
      const currentUser = { ...foundUser, refreshToken };
      usersDB.setUsers([...otherUsers, currentUser]);
      await fsPromises.writeFile(
        path.join(__dirname, '..', 'model', 'users.json'),
        JSON.stringify(usersDB.users)
      );
      
      res.cookie('jwt', refreshToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 })
      res.json({ accessToken });
    } else {
      return res.status(401).json({ message: 'Authentication failed' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}


module.exports = { handleLogin };