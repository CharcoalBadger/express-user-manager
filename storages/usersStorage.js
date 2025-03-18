const { v4: uuidv4 } = require("uuid"); // For unique IDs

class UsersStorage {
  constructor() {
    this.storage = {};
  }

  addUser({ firstName, lastName, email, age, bio }) {
    const id = uuidv4(); // Generate unique user ID
    this.storage[id] = { id, firstName, lastName, email, age, bio };
  }

  getUsers() {
    return Object.values(this.storage);
  }

  getUserById(id) {
    return this.storage[id];
  }

  updateUser(id, { firstName, lastName, email, age, bio }) {
    if (this.storage[id]) {
      this.storage[id] = { id, firstName, lastName, email, age, bio };
    }
  }

  deleteUser(id) {
    delete this.storage[id];
  }

  searchUsers(query) {
    return this.getUsers().filter(
      (user) =>
        user.firstName.toLowerCase().includes(query.toLowerCase()) ||
        user.lastName.toLowerCase().includes(query.toLowerCase()) ||
        user.email.toLowerCase().includes(query.toLowerCase())
    );
  }
}

module.exports = new UsersStorage();
