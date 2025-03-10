// // uploadController.js
// const multer = require("multer");
// const admin = require("firebase-admin");
// const sharp = require("sharp");
// const { PDFDocument } = require('pdf-lib');
// const firestore = admin.firestore();

// const bucket = admin.storage().bucket('matchingjodiweb.appspot.com');

// const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 4 * 1024 * 1024 } }); // 2MB limit

// // async function compressImage(file) {
// //     return sharp(file.buffer)
// //         .resize({ width: 600 })
// //         .jpeg({ quality: 70 })
// //         .toBuffer();
// // }

// // async function compressPDF(file) {
// //     const pdfDoc = await PDFDocument.load(file.buffer);
// //     const pdfBytes = await pdfDoc.save();
// //     return pdfBytes;
// // }

// // async function compressFile(file, fileType) {
// //     if (fileType === "application/pdf") {
// //         return compressPDF(file);
// //     } else if (fileType.startsWith("image/")) {
// //         return compressImage(file);
// //     } else {
// //         return file.buffer;
// //     }
// // }

// async function uploadFile(file, folder, customerId, fileType) {
//     try {
//         // const compressedBuffer = await compressFile(file, file.mimetype);
//         const fileName = `${customerId}/${fileType}.${file.originalname.split('.').pop()}`;
//         const filePath = `${folder}/${fileName}`;
//         const fileUpload = bucket.file(filePath);

//         const fileStream = fileUpload.createWriteStream({
//             metadata: { contentType: file.mimetype },
//         });

//         await new Promise((resolve, reject) => {
//             fileStream.on('error', (error) => reject(error));
//             fileStream.on('finish', () => {
//                 fileUpload.makePublic()
//                     .then(() => resolve(fileUpload.publicUrl()))
//                     .catch((error) => reject(error));
//             });
//             // fileStream.end(compressedBuffer);
//             fileStream.end(file.buffer);
//         });

//         return fileUpload.publicUrl();
//     } catch (error) {
//         throw new Error(`Error uploading file: ${error.message}`);
//     }
// }





// const uploadFiles = async (req, res) => {
//     const customerId = req.query.customerId || req.body.customerId;
//     const folder = `customers`;
//     const files = req.files;
//     const kycDocumentType = req.body.kycDocumentType; // Retrieve kycDocumentType from request body


//     if (!customerId) {
//         return res.status(400).json({ message: "CustomerId is required" });
//     }

//     const appUsersRef = firestore.collection('appusers').doc(customerId);

//     try {
//         // Fetch current document data
//         const userDoc = await appUsersRef.get();
//         const userData = userDoc.data();

//         // Initialize updateData with existing imgList to ensure no overwriting
//         const updateData = { ...userData };
//         // const sessionData = await fetchSessionData();

//         // console.log('sessions: ', sessionData)

//         const timeStamp = new Date();
//         // const uploadedByData = `${req.user.name}/${req.user.id}/${timeStamp}`;
//         const uploadedByData = `sandeep/7989175345/${timeStamp}`;

//         for (const [key, value] of Object.entries(files)) {
//             const file = value[0];
//             const fileUrl = await uploadFile(file, folder, customerId, key);

//             if (key.startsWith('kycDocument')) {
//                 if (!updateData.kyc) updateData.kyc = {};
//                 const fieldKey = key === 'kycDocumentFront' ? 'kycDocumentFrontUrl' : 'kycDocumentBackUrl';
//                 updateData.kyc[fieldKey] = fileUrl;
//                 if (key === 'kycDocumentFront') {
//                     updateData.kyc.kycFrontDocUploadedBy = uploadedByData;
//                 } else {
//                     updateData.kyc.kycBackDocUploadedBy = uploadedByData;
//                 }
//                 updateData.kyc.kycVerificationStatus = "pending";
//                 updateData.kyc.kycVerifiedBy = "";
//                 if (kycDocumentType) {
//                   updateData.kyc.kycDocumentType = kycDocumentType; // Set the kycDocumentType if provided
//               }
//             } else {
//                 const imgIndex = key === 'profileImage' ? 5 : parseInt(key.replace('image', '')) - 1;
//                 if (!updateData.imgList) updateData.imgList = Array(6).fill({ imgUrl: "", imgVerificationBy: "", imgVerificationStatus: "pending", imgUploadedBy: "" });
//                 updateData.imgList[imgIndex] = {
//                     imgUrl: fileUrl,
//                     imgUploadedBy: uploadedByData,
//                     imgVerificationStatus: "pending",
//                     imgVerificationBy: ""
//                 };
//             }
//         }

//         // console.log('updatedData: ', updateData)
//         await appUsersRef.set(updateData, { merge: true });

//         res.status(200).json({ message: "Files uploaded and data updated successfully." });
//     } catch (error) {
//         console.error("Error uploading files or updating data:", error);
//         res.status(500).json({ message: "Error uploading files or updating data", error: error.message });
//     }
// };

// const uploadMiddleware = upload.fields([
//     { name: 'kycDocumentFront', maxCount: 1 },
//     { name: 'kycDocumentBack', maxCount: 1 },
//     { name: 'image1', maxCount: 1 },
//     { name: 'image2', maxCount: 1 },
//     { name: 'image3', maxCount: 1 },
//     { name: 'image4', maxCount: 1 },
//     { name: 'image5', maxCount: 1 },
//     { name: 'profileImage', maxCount: 1 }
// ]);



// const deleteFile = async (req, res) => {
//   const { customerId, context } = req.body || req.query;

//   if (!customerId || !context) {
//       return res.status(400).json({ message: "CustomerId and context are required" });
//   }

//   const appUsersRef = firestore.collection('appusers').doc(customerId);

//   try {
//       // Fetch current document data
//       const userDoc = await appUsersRef.get();
//       const userData = userDoc.data();

//       const updateData = { ...userData };

//       let filePath;
//       if (context.startsWith('kycDocument')) {
//           if (updateData.kyc) {
//               const fieldKey = context === 'kycDocumentFront' ? 'kycDocumentFrontUrl' : 'kycDocumentBackUrl';
//               const fileUrl = updateData.kyc[fieldKey];
//               if (fileUrl) {
//                   const fileName = fileUrl.split('/').pop();
//                   filePath = `customers/${customerId}/${context}.${fileName.split('.').pop()}`;
//               }
//               updateData.kyc[fieldKey] = "";
//               if (context === 'kycDocumentFront') {
//                   updateData.kyc.kycFrontDocUploadedBy = "";
//               } else {
//                   updateData.kyc.kycBackDocUploadedBy = "";
//               }
//               updateData.kyc.kycVerificationStatus = "pending";
//               updateData.kyc.kycVerifiedBy = "";
//           }
//       } else {
//           const imgIndex = context === 'profileImage' ? 5 : parseInt(context.replace('image', '')) - 1;
//           if (updateData.imgList && updateData.imgList[imgIndex]) {
//               const fileUrl = updateData.imgList[imgIndex].imgUrl;
//               if (fileUrl) {
//                   const fileName = fileUrl.split('/').pop();
//                   filePath = `customers/${customerId}/${context}.${fileName.split('.').pop()}`;
//               }
//               updateData.imgList[imgIndex] = {
//                   imgUrl: "",
//                   imgUploadedBy: "",
//                   imgVerificationStatus: "pending",
//                   imgVerificationBy: ""
//               };
//           }
//       }

//       if (filePath) {
//           const file = bucket.file(filePath);
//           await file.delete();
//       }

//       await appUsersRef.set(updateData, { merge: true });

//       res.status(200).json({ message: "File deleted and data updated successfully." });
//   } catch (error) {
//       console.error("Error deleting file or updating data:", error);
//       res.status(500).json({ message: "Error deleting file or updating data" });
//   }
// };


// module.exports = {
//   uploadFiles,
//   uploadMiddleware,
//   deleteFile
// };

const dotenv = require("dotenv");
dotenv.config();
const admin = require("firebase-admin");
const formidable = require('formidable-serverless');
const UUID = require("uuid-v4");
const firestore = admin.firestore();
const bucket = admin.storage().bucket(process.env.STORAGE_BUCKET)
const { formatTimestamp } = require("../utilities/dateTime");


async function uploadFile(file, folder, customerId, fileType) {
    try {
        const token = UUID();
        const fileName = `${customerId}/${fileType}.${file.name.split('.').pop()}`;
        const filePath = `${folder}/${fileName}`;

        // Check file object and path
        // console.log('File object:', file);
        // console.log('File path:', file.path); // Use file.path instead of file.filepath

        if (!file.path) {
            throw new Error("File path is undefined. Ensure the file is correctly parsed.");
        }

        // Upload the file to Firebase Storage with appropriate metadata
        const [uploadedFile] = await bucket.upload(file.path, {
            destination: filePath,
            metadata: {
                contentType: file.type,
                metadata: {
                    firebaseStorageDownloadTokens: token,
                    // Set Content-Disposition to 'inline' to open in the browser
                    'Content-Disposition': `inline; filename="${fileName}"`,

                     // Set Content-Disposition to 'attachment' to download such as software, archives.
                    // 'Content-Disposition': `attachment; filename="${fileName}"`,
                },

                // acl: [
                //     {
                //         entity: 'allUsers',
                //         role: 'READER',
                //     },
                // ],
            },
        });

        // // Get metadata
        // const [metadata] = await uploadedFile.getMetadata();
        // const mediaLink = metadata.mediaLink;
        // console.log('metadata: ', metadata)
        // console.log('Image uploaded and can be viewed at:', mediaLink);


        // Generate a signed URL for accessing the file
        const [signedUrl] = await uploadedFile.getSignedUrl({
            action: 'read',
            expires: Date.now() + 20 * 365 * 24 * 60 * 60 * 1000, // 20 years expiration
        });

        // console.log('Signed URL:', signedUrl);
        return signedUrl;
    } catch (error) {
        console.error("Error uploading file:", error);
        throw new Error(`Error uploading file: ${error.message}`);
    }
}


const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE = MAX_FILE_SIZE_MB * 1024 * 1024;

const uploadFiles = async (req, res) => {
    const form = new formidable.IncomingForm();
    form.maxFileSize = MAX_FILE_SIZE
    form.multiples = true;

    form.parse(req, async (err, fields, files) => {
        if (err) {
            if (err.message.includes("maxFileSize")) {
                return res.status(400).json({ message: `File size limit exceeded (max ${MAX_FILE_SIZE_MB} MB)` });
            }
            console.error("Error uploading files:", err);
            return res.status(400).json({ message: "Error uploading files" });

        }

        const customerId = fields.customerId;
        // console.log('customerId: ', customerId);

        if (!customerId) {
            return res.status(400).json({ message: "CustomerId is required" });
        }

        const appUsersRef = firestore.collection('appusers').doc(customerId);
        const kycDocumentType = fields.kycDocumentType;

        try {
            const userDoc = await appUsersRef.get();
            const userData = userDoc.data();

            const updateData = { ...userData };
            // const timeStamp = formatTimestamp();
            const timeStamp = new Date().toString();
            // const uploadedByData = `sandeep/7989175345/${timeStamp}`;
            const uploadedByData = `${req.user.name}/${req.user.id}/${timeStamp}`;

            for (const [key, value] of Object.entries(files)) {
                const file = Array.isArray(value) ? value[0] : value;
                const fileUrl = await uploadFile(file, 'customers', customerId, key);

                if (key.startsWith('kycDocument')) {
                    if (!updateData.kyc) updateData.kyc = {};
                    const fieldKey = key === 'kycDocumentFront' ? 'kycDocumentFrontUrl' : 'kycDocumentBackUrl';
                    updateData.kyc[fieldKey] = fileUrl;
                    if (key === 'kycDocumentFront') {
                        updateData.kyc.kycFrontDocUploadedBy = uploadedByData;
                    } else {
                        updateData.kyc.kycBackDocUploadedBy = uploadedByData;
                    }
                    updateData.kyc.kycVerificationStatus = "pending";
                    updateData.kyc.kycVerifiedBy = "";
                    if (kycDocumentType) {
                        updateData.kyc.kycDocumentType = kycDocumentType;
                    }
                } else {
                    const imgIndex = key === 'profileImage' ? 5 : parseInt(key.replace('image', '')) - 1;
                    if (!updateData.imgList) updateData.imgList = Array(6).fill({ imgUrl: "", imgVerificationBy: "", imgVerificationStatus: "pending", imgUploadedBy: "" });
                    updateData.imgList[imgIndex] = {
                        imgUrl: fileUrl,
                        imgUploadedBy: uploadedByData,
                        imgVerificationStatus: "pending",
                        imgVerificationBy: ""
                    };
                }
            }

            await appUsersRef.set(updateData, { merge: true });

            res.status(200).json({ message: "Files uploaded and data updated successfully." });
        } catch (error) {
            console.error("Error uploading files or updating data:", error);
            res.status(500).json({ message: "Error uploading files or updating data", error: error.message });
        }
    });
};





const deleteFile = async (req, res) => {
    const { customerId, context } = req.body || req.query;

    if (!customerId || !context) {
        return res.status(400).json({ message: "CustomerId and context are required" });
    }

    const appUsersRef = firestore.collection('appusers').doc(customerId);

    try {
        // Fetch current document data
        const userDoc = await appUsersRef.get();
        const userData = userDoc.data();
        const updateData = { ...userData };

        let filePath;
        if (context.startsWith('kycDocument')) {
            if (updateData.kyc) {
                const fieldKey = context === 'kycDocumentFront' ? 'kycDocumentFrontUrl' : 'kycDocumentBackUrl';
                const fileUrl = updateData.kyc[fieldKey];
                if (fileUrl) {
                    const fileName = fileUrl.split('/').pop().split('?')[0]; // Remove any query parameters
                    filePath = `customers/${customerId}/${context}.${fileName.split('.').pop()}`;
                }
                updateData.kyc[fieldKey] = "";
                if (context === 'kycDocumentFront') {
                    updateData.kyc.kycFrontDocUploadedBy = "";
                } else {
                    updateData.kyc.kycBackDocUploadedBy = "";
                }
                updateData.kyc.kycVerificationStatus = "pending";
                updateData.kyc.kycVerifiedBy = "";
            }
        } else {
            const imgIndex = context === 'profileImage' ? 5 : parseInt(context.replace('image', '')) - 1;
            if (updateData.imgList && updateData.imgList[imgIndex]) {
                const fileUrl = updateData.imgList[imgIndex].imgUrl;
                if (fileUrl) {
                    const fileName = fileUrl.split('/').pop().split('?')[0]; // Remove any query parameters
                    filePath = `customers/${customerId}/${context}.${fileName.split('.').pop()}`;
                }
                updateData.imgList[imgIndex] = {
                    imgUrl: "",
                    imgUploadedBy: "",
                    imgVerificationStatus: "pending",
                    imgVerificationBy: ""
                };
            }
        }

        if (filePath) {
            const file = bucket.file(filePath);
            console.log("Attempting to delete file at path:", filePath); // Log path before deletion
            await file.delete();
        }

        await appUsersRef.set(updateData, { merge: true });
        res.status(200).json({ message: "File deleted and data updated successfully." });
    } catch (error) {
        console.error("Error deleting file or updating data:", error);
        res.status(500).json({ message: "Error deleting file or updating data", error: error.message });
    }
};


module.exports = {
    uploadFiles,
    deleteFile
};
