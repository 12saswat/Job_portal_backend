const jwt = require("jsonwebtoken");
const userModel = require("../models/userModels");

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({ error: "Missing authorization header" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Missing token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRETE_KEY);
    const user = await userModel.findById(decoded.id); // assuming your token payload contains { id: user._id }

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    req.user = user; // 👈 Now this contains the actual user document
    next();
  } catch (err) {
    return res.status(403).json({ error: "Invalid token" });
  }
};

module.exports = verifyToken;
