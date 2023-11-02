const jwt = require("jsonwebtoken");

const authorize = async (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const token = auth.split(" ")[1];
  const decoded = jwt.verify(token, "somesupersecretkey");
  req.user = decoded;
  next();
};

module.exports = { authorize };
