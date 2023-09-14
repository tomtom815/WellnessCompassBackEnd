const usersDB = {
  users: require('../models/User'),
  setUsers: function (data) { this.users = data }
}

const bcrypt = require('bcrypt');
const res = require('express/lib/response');

const handleLogin = async (request, response) => {
  const { username, password } = request.body;

  if (!username || !password) return res.status(400).json({ 'message': 'Username and password are required.' });
  const foundUser = usersDB.users.find(person => person.username === user);
  if (!foundUser) return response.sendStatus(401); // Unauthorized

  // Evaluated password
  const match = await bcrypt.compare(password, foundUser.password);
  if (match) {
    // Create JWT
    response.json({ 'success': `User ${user} is logged in!` });
  } else {
    response.sendStatus(401);
  }
}

module.exports = { handleLogin };