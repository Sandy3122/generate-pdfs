// support request route

const express = require("express");
const router = express.Router();
const { sendSupportFormData } = require("../controllers/supportRequestController");

router.get("/env", (req, res) => {
  res.json({
    WIDGET_ID: process.env.WIDGET_ID,
    TOKEN_AUTH: process.env.TOKEN_AUTH,
  });
});

router.post("/sendSupportFormData", sendSupportFormData);

module.exports = router;


