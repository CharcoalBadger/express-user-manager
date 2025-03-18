const usersStorage = require("../storages/usersStorage");
const { body, validationResult } = require("express-validator");

const validateUser = [
  body("firstName")
    .trim()
    .isAlpha()
    .withMessage("First name must contain only letters.")
    .isLength({ min: 1, max: 10 })
    .withMessage("First name must be 1-10 characters."),
  body("lastName")
    .trim()
    .isAlpha()
    .withMessage("Last name must contain only letters.")
    .isLength({ min: 1, max: 10 })
    .withMessage("Last name must be 1-10 characters."),
  body("email").trim().isEmail().withMessage("Email must be valid."),
  body("age")
    .optional()
    .isInt({ min: 18, max: 120 })
    .withMessage("Age must be between 18 and 120."),
  body("bio")
    .optional()
    .isLength({ max: 200 })
    .withMessage("Bio must be at most 200 characters."),
];

exports.usersListGet = (req, res) => {
  res.render("index", { title: "User list", users: usersStorage.getUsers() });
};

exports.usersCreateGet = (req, res) => {
  res.render("createUser", { title: "Create User", errors: [], user: {} });
};

exports.usersCreatePost = [
  validateUser,
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render("createUser", {
        title: "Create User",
        errors: errors.array(),
        user: req.body,
      });
    }
    usersStorage.addUser(req.body);
    res.redirect("/");
  },
];

exports.usersUpdateGet = (req, res) => {
  const user = usersStorage.getUserById(req.params.id);
  if (!user) return res.status(404).send("User not found");
  res.render("updateUser", { title: "Update User", user, errors: [] });
};

exports.usersUpdatePost = [
  validateUser,
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render("updateUser", {
        title: "Update User",
        user: req.body,
        errors: errors.array(),
      });
    }
    usersStorage.updateUser(req.params.id, req.body);
    res.redirect("/");
  },
];

exports.usersDeletePost = (req, res) => {
  usersStorage.deleteUser(req.params.id);
  res.redirect("/");
};

exports.usersSearchGet = (req, res) => {
  const { query } = req; // Get search query parameters (name or email)
  const users = usersStorage.getUsers(); // Retrieve all users

  // Filter users based on query (name or email)
  const filteredUsers = users.filter(
    (user) =>
      (query.name &&
        (user.firstName.toLowerCase().includes(query.name.toLowerCase()) ||
          user.lastName.toLowerCase().includes(query.name.toLowerCase()))) ||
      (query.email &&
        user.email &&
        user.email.toLowerCase().includes(query.email.toLowerCase()))
  );

  res.render("search", {
    title: "Search Results",
    users: filteredUsers, // Pass filtered results to view
    query: query, // Pass query back to prefill search input
  });
};
