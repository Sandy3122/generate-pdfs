// user routes

const express = require("express");
const router = express.Router();
const path = require("path");

router.get("/supportRequest", (req, res) => {
  console.log("Handling /supportRequest route");
  res.sendFile(path.join(__dirname, "..", "..", "public", "aboutUs.html"));
});

router.get("/privacyPolicies", (req, res) => {
  console.log("Handling /privacyPolicies route");
  res.sendFile(path.join(__dirname, "..", "..", "public", "user", "privacyPolicies.html"));
});


router.get("/termsAndConditions", (req, res) => {
  console.log("Handling /termsAndConditions route");
  res.sendFile(path.join(__dirname, "..", "..", "public", "user", "termsAndConditions.html"));
});


router.get("/staySafeWithUs", (req, res) => {
  console.log("Handling /staySafeWithUs route");
  res.sendFile(path.join(__dirname, "..", "..", "public", "user", "staySafeWithUs.html"));
});



module.exports = router;