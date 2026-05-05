const path = require('path');
const fs = require('fs').promises;
const bcrypt = require('bcrypt');

const authFile = path.join(__dirname, '../../data/auth_user.json');
const saltRounds = 10;

const readUsers = async () => {
  const text = await fs.readFile(authFile, 'utf8');
  return JSON.parse(text || '[]');
};

const writeUsers = async (users) => {
  await fs.writeFile(authFile, JSON.stringify(users, null, 2), 'utf8');
};

exports.findUserByUsername = async (username) => {
  const users = await readUsers();
  return users.find((user) => user.username.toLowerCase() === username.toLowerCase());
};

exports.createUser = async ({ username, password, first_name }) => {
  const users = await readUsers();
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  const newUser = {
    username,
    password: hashedPassword,
    first_name,
    date_of_registration: new Date().toISOString().slice(0, 10)
  };
  users.push(newUser);
  await writeUsers(users);
  return newUser;
};

exports.verifyPassword = async (plainTextPassword, hashedPassword) => {
  return bcrypt.compare(plainTextPassword, hashedPassword);
};
