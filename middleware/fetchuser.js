const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

const fetchuser = (req, res, next) => {
  const token = req.header("auth-token");
  //   console.log("token  ", token);
  // res.json({ token: token });
  if (!token) {
    res.status(401).json({ error: "please authenticate using valid token" });
  }
  try {
    const decode = jwt.verify(token, JWT_SECRET);

    req.user = decode.user;

    next();
  } catch (error) {
    res.status(401).json({ error: "please authenticate using valid token" });
  }
};
module.exports = fetchuser;
