const express = require("express");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const router = express.Router();
const jwt = require("jsonwebtoken");
const fetchuser = require("../middleware/fetchuser");

// route 1 :  create a user using : POST "api/auth/createuser"   no login require
const JWT_SECRET = "Yogitaisveryprofessional";
let success = false;
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
      return res.send({ success, errors: result.array() });
    }
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({
            success,
            error: "sorry a user with this email already exists",
          });
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
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET);
      console.log(authToken);
      res.json({ success: true, authToken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("some error occured");
    }
  }
);

// route 2 : creating route for user login POST /api/auth/login -- login not required
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
      return res.send({ success: false, errors: result.array() });
    }
    try {
      const { email, password } = req.body;
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ success: false, error: "enter correct credentials " });
      }

      const checkPassword = await bcrypt.compare(password, user.password);
      if (!checkPassword) {
        return res
          .status(400)
          .json({ success: false, error: "enter correct credentials" });
      }
      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET);

      res.json({ success: true, authToken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("some error occured");
    }
  }
);

// route 3 : get loggedin user details usind : /api/auth/getuser -- login required
router.post("/getuser", fetchuser, async (req, res) => {
  try {
    const userId = req.user;

    const user = await User.findById(userId.id).select("-password");
    res.json(user);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, error: "some error occured" });
  }
});
module.exports = router;
