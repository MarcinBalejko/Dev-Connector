const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const { check, validationResult } = require("express-validator");

const User = require("../../models/User");

// @route   POST api/users
// @desc    Register user
// @access  Public
router.post(
  "/",
  [
    check("name", "Name is required")
      .not()
      .isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // if there are errors
      return res.status(400).json({ errors: errors.array() }); // 400 = bad request
    }

    const { name, email, password } = req.body;

    try {
      // See if user exists
      let user = await User.findOne({ email }); //since they're the same, we can just type single email instead of email: email

      if (user) {
        res.status(400).json({ errors: [{ msg: "User already exists" }] });
      }

      // Get users gravatar (based on their email)
      const avatar = gravatar.url(email, {
        s: "200", // size
        r: "pg", //rating
        d: "mm" // default
      });

      user = new User({
        name,
        email,
        avatar,
        password
        // doesn't save user yet, just  creating an instance
      });

      // Encrypt password (bcrypt)

      // Return jsonwebtoken
      res.send("User route");
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;
