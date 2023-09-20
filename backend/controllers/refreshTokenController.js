const usersDB = {
  users: require('../models/User'),
  setUsers: function (data) { this.users = data }
}

// Am accessing database
// According to authController console.logs, the users are being set up with
// a refresh token. 
// Why are they not being found by findOne with the refresh token?

const jwt = require('jsonwebtoken');
require('dotenv').config();

const handleRefreshToken = async (request, res) => {

  const cookies = request.cookies;

  if (!cookies?.jwt) return res.sendStatus(401);
  console.log(cookies.jwt);
  const refreshToken = cookies.jwt;
  const foundUser = await usersDB.users.findOne({ "refreshToken": refreshToken });
  console.log(foundUser);
  if (!foundUser) return res.sendStatus(401) // Unauthorized

  // Evaluate jwt
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    (err, decoded) => {
      console.log(foundUser, foundUser.username, decoded, decoded.username, cookies)
      if (err || foundUser.username !== decoded.username) return res.sendStatus(403);
      const accessToken = jwt.sign(
        { "username": decoded.username },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '1m' }
      );
      res.json({ accessToken });
    }
  );
}

module.exports = { handleRefreshToken }