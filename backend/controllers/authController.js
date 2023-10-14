const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
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
    const foundUser = await User.findOne({ username }).exec();
    if (!foundUser) {
      return res.status(401).json({ message: 'Authentication failed' }); // Unauthorized
    }
    // Compare passwords/perform authentication
    const isPasswordMatch = await bcrypt.compare(password, foundUser.password);

    if (isPasswordMatch) {
      // Create JWTs
      const accessToken = jwt.sign(
        { "username": foundUser.username },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '2m' }
      );
      const refreshToken = jwt.sign(
        { "username": foundUser.username },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '1d' }
      );

      // Saving refreshToken with current user
      foundUser.refreshToken = refreshToken;
      const result = await foundUser.save();
      console.log(result); // Delete for production
      
      res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 }); //secure: true, (remove to be compatible with thunder client)
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