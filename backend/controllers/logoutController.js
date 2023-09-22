const User = require('../models/User');

const handleLogout = async (request, res) => {

  // On client, also delete the accessToken

  const cookies = request.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); // No content to send back
  const refreshToken = cookies.jwt;

  // Is refreshToken in db?
  const foundUser = await User.findOne({ refreshToken }).exec();

  if (!foundUser) {
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
    return res.sendStatus(204);
  }

  // Delete the refreshToken in db
  foundUser.refreshToken = '';
  const result = foundUser.save();
  console.log(result); // Delete before production
  
  res.clearCookie('jwt', { httpOnly: true }); // In production - would add secure: true - only serves on https
  res.sendStatus(204);
}

module.exports = { handleLogout }