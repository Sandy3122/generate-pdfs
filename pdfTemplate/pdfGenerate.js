const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const db = admin.firestore();
const fs = require('fs');

const { generatePdfFunction } = require('./pdfGenerators'); // Assuming you have implemented these functions for PDF generation

// Helper function: Formats a date to 'DD-MMM-YYYY'
function formatDateOfBirth(dateOfBirth) {
    const date = new Date(dateOfBirth);
    const day = String(date.getDate()).padStart(2, '0');
    const month = date.toLocaleString('en-US', { month: 'short' });
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
}

// Helper function: Calculates age from date of birth
function calculateAge(dateOfBirth) {
    const birthDate = new Date(dateOfBirth);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();

    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
        age--;
    }

    return age;
}

// Helper function: Capitalizes the first letter of each word in a string
function capitalizeName(name) {
    return name
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

// Helper function: Converts camelCase strings to normal strings
function camelCaseToNormal(value) {
    if (!value) return "null";

    if (Array.isArray(value)) {
        return value
            .map(item => formatString(item))
            .join(', ');
    }

    return formatString(value);
}

// Formats a string for camelCase, uppercase, or hyphenated strings
function formatString(str) {
     // If string is entirely uppercase or hyphenated, return as-is
    if (/^[A-Z0-9\-]+$/.test(str)) {
        return str;
    }

    return str
        .replace(/([a-z])([A-Z])/g, '$1 $2') // Add space between camelCase
        .toLowerCase() // Convert to lowercase
        .replace(/^./, char => char.toUpperCase()); // Capitalize first letter
}

// Encodes content by replacing '\\n' with '\n' and truncates based on lines
function truncateContent(content, maxLines) {
    if (typeof content !== 'string') {
        throw new TypeError('Content must be a string');
    }

    // Decode newlines
    const decodedContent = content.replace(/\\n/g, '\n');

    // Split content into lines
    const lines = decodedContent.split('\n');

    // Truncate to the desired number of lines
    if (lines.length > maxLines) {
        // Append '...' to the last truncated line
        lines[maxLines - 1] = lines[maxLines - 1] + ' ...';
        return lines.slice(0, maxLines).join('\n');
    }

    return decodedContent; // No truncation needed if lines are within limit
}

const checkImageUrl = async (url) => {
    try {
        if (!url) return false;
        const response = await fetch(url, { method: 'HEAD' });
        return response.ok; // Returns true if the status code is 200-299
    } catch (error) {
        return false; // If fetch fails, consider the URL invalid
    }
};

const getProfilePhoto = async (imgList) => {
    const profileUrl = imgList?.[5]?.imgUrl;
    const isViewable = await checkImageUrl(profileUrl);
    return isViewable ? profileUrl : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';
};

router.get('/generateProfilesPdf/:id?', async (req, res) => {
    try {
        console.log('Testing PDF generation...');
        res.setTimeout(540000); // 9 minutes timeout
        const { id } = req.params;

        // Reference Firestore collection
        const collectionRef = db.collection('appusers');
        let snapshot;

        if (id) {
            const docRef = collectionRef.doc(id);
            snapshot = await docRef.get();
            if (!snapshot.exists) {
                return res.status(404).json({ error: "Record not found for the provided ID." });
            }
            snapshot = [snapshot]; // Convert to array for consistency
        } else {
            snapshot = await collectionRef.get();
            if (snapshot.empty) {
                return res.status(404).json({ error: "No records found in the 'appusers' collection." });
            }
        }

        const fieldNames = ['id', 'aboutMeDescription', 'customerId', 'firstName', 'lastName', 'permanentAddress', 'dateOfBirth', 'birthPlace', 'manglikStatus', 'maritalStatus', 'timeOfBirth', 'height', 'religion', 'caste', 'diet', 'drink', 'smoke', 'primaryGuardian', 'primaryGuardianRelation', 'secondaryGuardian', 'secondaryGuardianRelation', 'noOfBrothers', 'noOfSisters', 'noOfBrothersMarried', 'noOfSistersMarried', 'educationLevel', 'educationField', 'workingWith', 'designation', 'annualIncome', 'partnerDetails', 'imgList'];
        
        const retrievedDataArray = [];
        snapshot.forEach(doc => {
            const data = doc.data();
            const filteredData = { id: doc.id };
            fieldNames.forEach(fieldName => {
                if (data[fieldName] !== undefined) {
                    filteredData[fieldName] = data[fieldName];
                }
            });
            retrievedDataArray.push(filteredData);
        });

        // Function to process profile data
        const processProfileData = async (retrievedDataArray) => {
            return await Promise.all(retrievedDataArray.map(async (data) => ({
                aboutMe: truncateContent(data.aboutMeDescription, 8) || "-",
                fullName: `${capitalizeName(data.firstName || '')} ${capitalizeName(data.lastName || '')}` || "-",
                customerId: capitalizeName(data.id) || "-",
                age: calculateAge(data.dateOfBirth) || "-",
                birthDate: formatDateOfBirth(data.dateOfBirth) || "-",
                maritalStatus: camelCaseToNormal(data.maritalStatus || "-"),
                height: data.height || "-",
                religion: data.religion || "-",
                caste: data.caste || "-",
                manglik: camelCaseToNormal(data.manglikStatus || "-"),
                timeOfBirth: data.timeOfBirth || "-",
                placeOfBirth: data.birthPlace || "-",
                diet: camelCaseToNormal(data.diet || "-"),
                drink: camelCaseToNormal(data.drink || "-"),
                smoke: camelCaseToNormal(data.smoke || "-"),
                fatherName: data.primaryGuardian?.primaryGuardianRelation === 'father' ? data.primaryGuardian.primaryGuardianName : '-' || "-",
                motherName: data.secondaryGuardian?.secondaryGuardianRelation === 'mother' ? data.secondaryGuardian.secondaryGuardianName : '-' || "-",
                fatherOccupation: data.primaryGuardian?.primaryGuardianRelation === 'father' ? camelCaseToNormal(data.primaryGuardian.primaryGuardianOccupation) : '-' || "-",
                motherOccupation: data.secondaryGuardian?.secondaryGuardianRelation === 'mother' ? camelCaseToNormal(data.secondaryGuardian.secondaryGuardianOccupation) : '-' || "-",
                noOfSisters: data.noOfSisters || "-",
                noOfSistersMarried: data.noOfSistersMarried || "-",
                noOfBrothers: data.noOfBrothers || "-",
                noOfBrothersMarried: data.noOfBrothersMarried || "-",
                education: camelCaseToNormal(data.educationLevel || "-"),
                workingWith: camelCaseToNormal(data.workingWith || "-"),
                income: data.annualIncome || "-",
                profilePhoto: await getProfilePhoto(data.imgList), // Validate the profile image
                stateAndCity: `${camelCaseToNormal(data.permanentAddress?.permanentState || "-")}, ${camelCaseToNormal(data.permanentAddress?.permanentCity || "-")}`,
                partnerAge: `${data.partnerDetails?.partnerMinAge || "-"} - ${data.partnerDetails?.partnerMaxAge || "-"}`,
                partnerReligion: camelCaseToNormal(data.partnerDetails?.partnerReligion || "-"),
                partnerMaritalStatus: camelCaseToNormal(data.partnerDetails?.partnerMaritalStatus || "-"),
                partnerCaste: camelCaseToNormal(data.partnerDetails?.partnerCaste || "-"),
                partnerLocation: camelCaseToNormal(data.partnerDetails?.partnerState || "-"),
                partnerEducationLevel: camelCaseToNormal(data.partnerDetails?.partnerEducationLevel || "-"),
                partnerWorkingWith: camelCaseToNormal(data.partnerDetails?.partnerWorkingWith || "-"),
                partnerManglik: camelCaseToNormal(data.partnerDetails?.partnerManglikStatus || "-"),
                partnerDiet: camelCaseToNormal(data.partnerDetails?.partnerDiet || "-"),
                partnerDrink: camelCaseToNormal(data.partnerDetails?.partnerDrink || "-"),
                partnerSmoke: camelCaseToNormal(data.partnerDetails?.partnerSmoke || "-"),
            })));
        };

        // Wait for profile data processing
        const profileDataArray = await processProfileData(retrievedDataArray);

        let outputPath;
        if (profileDataArray.length === 1) {
            outputPath = await generatePdfFunction(profileDataArray);
        } else {
            const maxProfiles = profileDataArray.length; // Adjust if needed
            const limitedProfiles = profileDataArray.slice(0, maxProfiles);
            outputPath = await generatePdfFunction(limitedProfiles);
        }

        // Send PDF response
        res.download(outputPath.path, 'profiles.pdf', (err) => {
            if (err) {
                console.error('Error during file download:', err);
                // Clean up file even if download fails
                fs.unlink(outputPath.path, (unlinkErr) => {
                    if (unlinkErr) console.error('Error deleting file:', unlinkErr);
                });
                return res.status(500).json({ error: "Failed to download the PDF file." });
            }
            
            // Clean up both original and compressed files
            const originalPath = outputPath.path.replace('_compressed.pdf', '.pdf');
            fs.unlink(originalPath, (unlinkErr) => {
                if (unlinkErr) console.error('Error deleting original file:', unlinkErr);
            });
            
            fs.unlink(outputPath.path, (unlinkErr) => {
                if (unlinkErr) console.error('Error deleting compressed file:', unlinkErr);
            });
        });

    } catch (error) {
        console.error("Error generating PDF:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});


module.exports = router;