const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const JWT = require("jsonwebtoken");

//Register
router.post("/register", async (req, res) => {
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASSWORD_SECRET
    ).toString(),
  });

  try {
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post("/login", async (req, res) => {
  const user = await User.findOne({ username: req.body.username });
  const originalPassword = CryptoJS.AES.decrypt(
    user.password,
    process.env.PASSWORD_SECRET
  ).toString(CryptoJS.enc.Utf8);

  originalPassword !== req.body.password &&
    res.status(401).json("wrong credentials!");

  const access_token = JWT.sign(
    {
      id: user._id,
      isAdmin: user.isAdmin,
    },
    process.env.JWT_SECRET,
    { expiresIn: "3d" }
  );

  const { password, ...others } = user._doc;
  res.status(200).json({ ...others, access_token });
});

module.exports = router;
