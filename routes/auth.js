const express = require("express");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const router = express.Router();
const jwt = require("jsonwebtoken");

//  create a user using : POST "api/auth/createuser"   no login require
const JWT_SECRET = "Yogitaisveryprofessional";
router.post(
  "/createuser",
  [
    body("email", "Enter a valid email").isEmail(),
    body("name", "Enter a valid name").isLength({ min: 5 }),
    body("password", "please enter a password of length more than 5").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    // if there are error , return bed request and the error
    const result = validationResult(req);

    // check whether the user with email exixts already
    if (!result.isEmpty()) {
      return res.send({ errors: result.array() });
    }
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({ error: "sorry a user with this email already exists" });
      }

      // creating  hash code for the user password to store in mongodb
      const salt = await bcrypt.genSalt(10);
      const safePassword = await bcrypt.hashSync(req.body.password, salt);
      user = await User.create({
        name: req.body.name,
        password: safePassword,
        email: req.body.email,
      });

      // providing auth token when new user is created
      const data = {
        data: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET);
      console.log(authToken);
      res.json({ authToken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("some error occured");
    }
  }
);

// creating route for user login POST /api/auth/login -- login not required
router.post(
  "/login",
  [
    body("email", "Enter a valid email").isEmail(),

    body("password", "Enter password").exists(),
  ],
  async (req, res) => {
    // if there are error , return bed request and the error
    const result = validationResult(req);

    // check whether the user with email exixts already
    if (!result.isEmpty()) {
      return res.send({ errors: result.array() });
    }
    try {
      const { email, password } = req.body;
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ error: "enter correct credentials " });
      }

      const checkPassword = await bcrypt.compare(password, user.password);
      if (!checkPassword) {
        return res.status(400).json({ error: "enter correct credentials" });
      }
      const data = {
        data: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET);

      res.json({ authToken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("some error occured");
    }
  }
);

module.exports = router;
