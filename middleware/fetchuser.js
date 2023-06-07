const jwt = require("jsonwebtoken");
const JWT_SECRET = "Yogitaisveryprofessional";

const fetchuser = (req, res, next) => {
  const token = req.header("auth-token");
  //   console.log("token  ", token);

  if (!token) {
    res.status(401).json({ error: "please authenticate using valid token" });
  }
  try {
    const decode = jwt.verify(token, JWT_SECRET);

    req.user = decode.user;

    console.log("from fetchuser file ", req.user);

    next();
  } catch (error) {
    res.status(401).json({ error: "please authenticate using valid token" });
  }
};
module.exports = fetchuser;
