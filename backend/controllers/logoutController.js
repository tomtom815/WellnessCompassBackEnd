const usersDB = {
  users: require('../models/User'),
  setUsers: function (data) { this.users = data }
}

const fsPromises = require('fs').promises;
const path = require('path');

const handleLogout = async (request, res) => {

  // On client, also delete the accessToken

  const cookies = request.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); // No content to send back
  const refreshToken = cookies.jwt;

  // Is refreshToken in db?
  const foundUser = await usersDB.users.findOne({ "refreshToken": refreshToken });

  if (!foundUser) {
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
    return res.sendStatus(204);
  }

  // Delete the refreshToken in db
  const otherUsers = usersDB.users.filter(person => person.refreshToken !== foundUser);
  const currentUser = { ...foundUser, refreshToken: '' };
  usersDB.setUsers([...otherUsers, currentUser]);
  await fsPromises.writeFile(
    path.join(__dirname, '..', 'model', 'users.json'),
    JSON.stringify(usersDB.users)
  );
  
  res.clearCookie('jwt', { httpOnly: true }); // In production - would add secure: true - only serves on https
  res.sendStatus(204);
}

module.exports = { handleLogout }