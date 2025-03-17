const usersStorage = require("../storages/usersStorage");
const { body, validationResult } = require("express-validator");

const alphaErr = "must only contain letters.";
const lengthErr = "must be between 1 and 10 characters.";

const validateUser = [
  body("firstName")
    .trim()
    .isAlpha()
    .withMessage(`First name ${alphaErr}`)
    .isLength({ min: 1, max: 10 })
    .withMessage(`First name ${lengthErr}`),
  body("lastName")
    .trim()
    .isAlpha()
    .withMessage(`Last name ${alphaErr}`)
    .isLength({ min: 1, max: 10 })
    .withMessage(`Last name ${lengthErr}`),
];

exports.usersListGet = (req, res) => {
  const users = usersStorage.getUsers();
  console.log("Users:", users); // Debugging
  res.render("index", {
    title: "User list",
    users,
  });
};

exports.usersCreateGet = (req, res) => {
  res.render("createUser", {
    title: "Create User",
    errors: [], // Ensure errors is always an empty array if not defined
  });
};

exports.usersCreatePost = [
  validateUser,
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("createUser", {
        title: "Create User",
        errors: errors.array(), // Pass errors correctly
      });
    }
    const { firstName, lastName } = req.body;
    usersStorage.addUser({ firstName, lastName });
    res.redirect("/");
  },
];

exports.usersUpdateGet = (req, res) => {
  const user = usersStorage.getUserById(req.params.id);
  if (!user) {
    return res.status(404).send("User not found");
  }
  res.render("updateUser", {
    title: "Update User",
    user: user,
    errors: [], // Ensure errors is always passed
  });
};

exports.usersUpdatePost = [
  validateUser,
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render("updateUser", {
        title: "Update User",
        user: req.body, // Ensuring user object is passed
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
