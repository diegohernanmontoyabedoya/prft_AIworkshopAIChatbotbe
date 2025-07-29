const users = [];

module.exports = {
  findByEmail: (email) => users.find(u => u.email === email),
  create: (user) => { users.push(user); return user; }
};