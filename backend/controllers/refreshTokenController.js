
const User = require('../models/User');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const handleRefreshToken = async (request, res) => {

  const cookies = request.cookies;
  if (!cookies?.jwt) return res.sendStatus(401);
  const refreshToken = cookies.jwt;

  const foundUser = await User.findOne({ refreshToken }).exec();
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