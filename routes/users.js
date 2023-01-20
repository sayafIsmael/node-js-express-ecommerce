const { verifyTokenAndAuth } = require("../services/jwt/verifyToken");

const router = require("express").Router();

router.get("/test", (req, res, next) => {
  res.next("Hello World!");
});

router.post("/posttest", (req, res, next) => {
  const { username } = req.body;
  res.send("username: " + username);
});

router.put(":/id", verifyTokenAndAuth, (req, res, next) => {
  
})

module.exports = router;
