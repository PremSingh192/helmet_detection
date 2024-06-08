const express = require("express");
require("dotenv").config();
const nodemailer = require("nodemailer");
const homerouter = express.Router();
const userModel = require("../models/userModel.js");
const asynchandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");
function generateRandomPassword(length) {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%";
  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  return password;
}
homerouter.get(
  "/",
  asynchandler(async (req, res) => {
    res.json({ message: "connected to register" });
  })
);

homerouter.post(
  "/",
  [body("email").isEmail().normalizeEmail(), body("name").isString().trim()],
  asynchandler(async (req, res) => {
    try {
      if (
        req.body.email &&
        req.body.name
      ) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          console.log("from register malcious", errors.errors);
          return res
            .status(401)
            .json({
              message: `${errors.errors[0].msg} ${errors.errors[0].path}`,
            });
        }
        const randomPassword = generateRandomPassword(12);
        const userdetails = {
          name: req.body.name,
          email: req.body.email,
          password: bcrypt.hashSync(randomPassword),
        };

        const user = await userModel.findOne({ email: req.body.email });

        if (user) {
          res.status(401).json({ message: "user already registered" });
          return;
        }

        let transporter = nodemailer.createTransport({
          service: "Gmail",
          auth: {
            user: process.env.MAIL_ID, // Your Gmail address
            pass: process.env.MAIL_PASS, // Your Gmail password or App Password if 2-Step Verification is enabled
          },
        });

        // // Setup email data
        let mailOptions = {
          from: `"Prem Singh" ${process.env.MAIL_ID}`, // sender address
          to: req.body.email, // list of receivers
          subject: "Successfully Registered ", // Subject line
          text: `Thanks ${req.body.name}  for registration`, // plain text body
          html: `name: ${req.body.name} <br/> email: ${req.body.email} <br/> Password: ${randomPassword} `, // html body
        };

        transporter.sendMail(mailOptions, (error, info) => {
          try {
            if (error) {
              if (error.responseCode && error.responseCode === 553) {
                throw new Error("Invalid recipient email address");
              } else {
                throw error;
              }
            } else {
              console.log("Email sent successfully:", info.response);
              userModel
                .create(userdetails)
                .then((response) => {
                  console.log("user inserted", response);
                })
                .catch((err) => {
                  console.log("db error", err);
                });
              res.status(200).json({ message: "user registered successfully" });
            }
          } catch (error) {
            console.log("Error sending email:", error.message);
            res
              .status(401)
              .json({ message: "Unable to send email Invalid  email address" });
          }
        });
      } else {
        res.status(401).json({ message: "wrong or empty input field" });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "server failed" });
    }
  })
);

module.exports = homerouter;
