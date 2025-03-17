class UsersStorage {
  constructor() {
    this.storage = {};
    this.id = 0;
  }

  addUser({ firstName, lastName }) {
    const id = this.id;
    this.storage[id] = { id, firstName, lastName };
    this.id++;
  }

  getUsers() {
    return Object.values(this.storage);
  }

  getUserById(id) {
    // ✅ Renamed function
    return this.storage[id];
  }

  updateUser(id, { firstName, lastName }) {
    if (this.storage[id]) {
      this.storage[id] = { id, firstName, lastName };
    }
  }

  deleteUser(id) {
    delete this.storage[id];
  }
}

module.exports = new UsersStorage();
