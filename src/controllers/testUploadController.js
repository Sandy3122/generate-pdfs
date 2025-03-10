// controllers/testUploadController.js
const multer = require('multer');
const admin = require("firebase-admin");

// Initialize Firebase storage bucket
const bucket = admin.storage().bucket();
  
const handleTestUpload = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.error("Error uploading file:", err);
      return res.status(500).json({ message: "Error uploading file" });
    }
    
    const file = req.file;
    console.log("File:", file);

    if (!file) {
      return res.status(400).send("File not uploaded");
    }

    const fileName = `test/${file.originalname}`;

    try {
      const fileUpload = bucket.file(fileName);

      const fileStream = fileUpload.createWriteStream({
        metadata: { contentType: file.mimetype },
      });

      await new Promise((resolve, reject) => {
        fileStream.on("error", (error) => reject(error));
        fileStream.on("finish", () => {
          fileUpload.makePublic()
            .then(() => resolve(fileUpload.publicUrl()))
            .catch((error) => reject(error));
        });
        fileStream.end(file.buffer);
      });

      return res.status(200).json({ message: "File uploaded successfully", url: fileUpload.publicUrl() });
    } catch (error) {
      console.error("Error saving file to Firebase Storage:", error);
      return res.status(500).json({ message: "Error saving file to Firebase Storage" });
    }
  });
};

module.exports = {
  handleTestUpload,
};
