require("dotenv").config();
const express = require("express");
const bcrypt = require("bcryptjs");
const LoginRouter = express.Router();
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const isAuth = require("../utils/Utils");
const userModel = require("../models/userModel");
const { body, validationResult } = require("express-validator");
function generateToken(user) {
  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      enrollment: user.enrollment,
      division: user.division,
      department: user.department,
      semester: user.semester,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "30d",
    }
  );
}

LoginRouter.get("/", (req, res) => {
  res.status(200).json({ message: "connected to login  route" });
});

LoginRouter.post(
  "/login",
  [
    body("email").isEmail().normalizeEmail(),
    body("password").isString().trim(),
  ],
  asyncHandler(async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log("from login malcious", errors.errors);
        return res
          .status(401)
          .json({ message: `${errors.errors[0].msg} ${errors.errors[0].path}` });
      }
      if (!req.body.email || !req.body.password) {
        res.status(401).json({ message: "Invalid request body " });
      } else {
        const user = await userModel.findOne({ email: req.body.email });
        if (user) {
          if (bcrypt.compareSync(req.body.password, user.password)) {
            res.status(200).json({ access: generateToken(user) });
          } else {
            res.status(401).json({ message: "wrong credentials" });
          }
        } else {
          res.status(401).json({ message: "wrong credentials" });
        }
      }
    } catch (error) {
      console.log(error);
      res.status(500).send("server failed");
    }
  })
);

LoginRouter.post("/isAuth", isAuth, (req, res) => {
  res.json({ message: true });
});
module.exports = LoginRouter;
