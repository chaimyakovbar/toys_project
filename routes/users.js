const express = require("express");
const bcrypt = require("bcrypt");
const {
  usersModel,
  validateUsers,
  creatToken,
} = require("../models/userModel");
const { auth } = require("../middleware/auth");
const router = express.Router();
router.get("/", async (req, res) => {
  res.json({ msg: "server is running" });
});
router.get("/userInfo", auth, async (req, res) => {
  try {
    const data = await usersModel.findOne(
      { _id: req.tokenData._id },
      { password: 0 }
    );
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(502).json({ err });
  }
});
router.post("/", async (req, res) => {
  try {
    const user = new usersModel(req.body);
    user.password = await bcrypt.hash(user.password, 10);
    await user.save();
    user.password = "*********";
    res.json(user);
  } catch (err) {
    if (err.code == 11000) {
      return res
        .status(400)
        .json({ err: "Email already in system", code: 11000 });
    }
    console.log(err);
    res.status(502).json({ err });
  }
});
router.post("/login", async (req, res) => {
  try {
    const validBody = validateUsers(req.body);
    if (validBody.error) {
      return res.status(400).json(validBody.error.details);
    }
    const user = await usersModel.findOne({ email: req.body.email });
    if (!user) {
      return res.status(401).json({ err: "Email not match" });
    }
    const password = await bcrypt.compare(req.body.password, user.password);
    if (!password) {
      return res.status(401).json({ err: "Password not match" });
    }
    const token = creatToken(user._id, user.role);
    res.json({ token });
  } catch (err) {
    console.log(err);
    res.status(502).json({ err });
  }
});
module.exports = router;
