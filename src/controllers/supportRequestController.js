const { saveSupportFormData } = require("../models/supportRequestModel");

async function sendSupportFormData(req, res) {
  console.log('Handling /sendSupportFormData route');
  try {
    const { phone, name, email, message } = req.body;

    if (!(phone && name && email && message)) {
      return res.status(400).json({ error: "Please fill in all fields." });
    }

    const result = await saveSupportFormData(phone, name, email, message);
    if (result.success) {
      res.status(200).json({ message: "Data sent successfully." });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  } catch (error) {
    console.error("Error handling /sendSupportFormData route:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = {
  sendSupportFormData
};
