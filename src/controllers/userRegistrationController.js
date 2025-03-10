// userRegistrationController.js

const { saveUserRegistrationData } = require("../models/userRegistrationModel"); // Import user registration model
const {
  checkExistingByEmail,
  checkExistingByPhoneNumber,
} = require("../utilities/userExistenceCheck");
const bcrypt = require("bcryptjs");
const { generateNumericId } = require("../utilities/generateIds");
const jwt = require("jsonwebtoken");
// Define secret key for JWT
const secretKey = process.env.SECRET_KEY;
const admin = require("firebase-admin");

const db = admin.firestore();

module.exports = {
  handleUserRegistration: async function (req, res) {
    const {
      firstName,
      lastName,
      gender,
      profileFor,
      email,
      phoneNumber,
      pin,
    } = req.body;
    console.log("req.body: ", req.body);
    try {

      const userId = "app" + generateNumericId();
      const timestamp = new Date().toString(); // Create a new Date object to represent the current timestamp

      // Hash the pin/password
      const hashedPin = await bcrypt.hash(pin, 10);
      console.log("pin", hashedPin)


      // Convert relevant fields to lowercase
      const lowerCaseFirstName = firstName ? firstName.toLowerCase().trim() : '';
      const lowerCaseLastName = lastName ? lastName.toLowerCase().trim() : '';
      const lowerCaseGender = gender ? gender.toLowerCase().trim() : '';
      const lowerCaseEmail = email ? email.toLowerCase().trim() : '';
      const lowerCaseProfileFor = profileFor ? profileFor.toLowerCase().trim() : '';
      const generatedCustomerId = userId.substring(3);

      // Check for existing user by email
      const duplicateEmailSnapshot = await db.collection('appusers').where('email', '==', lowerCaseEmail).limit(1).get();
      // Check for existing user by phone number
      const duplicatePhoneNumberSnapshot = await db.collection('appusers').where('registeredMobileNumber', '==', phoneNumber).limit(1).get();

      if (!duplicateEmailSnapshot.empty && !duplicatePhoneNumberSnapshot.empty) {
        return res.status(400).json({ message: "User with the same email and phone number already exists." });
      } else if (!duplicateEmailSnapshot.empty) {
        return res.status(400).json({ message: "User with the same email already exists." });
      } else if (!duplicatePhoneNumberSnapshot.empty) {
        return res.status(400).json({ message: "User with the phone number already exists." });
      }

      // Prepare user data object
      const userData = {
        // profile
        customerId: generatedCustomerId,
        firstName: lowerCaseFirstName,
        lastName: lowerCaseLastName,
        gender: lowerCaseGender,
        profileFor: lowerCaseProfileFor,
        registeredMobileNumber: phoneNumber,
        email: lowerCaseEmail,
        pin: hashedPin,
        dateOfBirth: req.body.dateOfBirth || "",
        maritalStatus: req.body.maritalStatus || "",
        religion: req.body.religion || "",
        height: req.body.height || "",
        bodyType: req.body.bodyType || "",
        diet: req.body.dietType || "",
        drink: req.body.drink || "",
        smoke: req.body.smoke || "",
        languagesKnown: req.body.language || "",
        aboutMeDescription: req.body.aboutMeDescription || '',
        lastLoginDateTime: "",

        // marital status
        noOfChild: req.body.noOfChild,
        livingWithChild: req.body.livingWithChild,

        // disability
        anyDisability: req.body.disability || "",
        disabilityDescription: req.body.disabilityDescription || "",

        // Account
        accountCreatedByWebOrApp: 'web',
        accountCreatedBy: `${req.user?.name}/${req.user?.id}/${req.user?.phoneNumber}/${timestamp}`, // wrapped at one place

        // Account Verification
        accountVerificationStatus: req.body.verificationStatus || "pending",
        accountVerifiedBy: "", // In Formate: name/Id/phoneNumber/dateTime
        agreedToTermsAndPrivacyPolicy: "",
        blockProfile: "",
        hideProfile: "",
        profileStatus: req.body.profileStatus || "pending",       // ex: hide profile or block profile
        agreedToTermsAndPrivacyPolicy: req.body.termsAndConditions || "",
        
        // Kyc
        kyc: {
          kycDocumentType: "",
          kycDocumentFrontUrl: req.body.documentFrontUrl || "",
          kycDocumentBackUrl: req.body.documentBackUrl || "",
          kycVerificationStatus: "pending",
          kycVerifiedBy: "",          // Ex: name/id/dateTime
          kycFrontDocUploadedBy:"",   // Ex: name/id/dateTime
          kycBackDocUploadedBy: "",   // Ex: name/id/dateTime
        },
        
        // Current Address
        currentAddress: {
          currentCity: "",
          currentCountry: "",
          currentState: "",
          currentTown: ""
        },

        // Permanent Address
        permanentAddress: {
          permanentCity: "",
          permanentCountry: "",
          permanentState: "",
          permanentTown: ""
        },

        // Primary Guardian
        primaryGuardian: {
          primaryGuardianName: "",
          primaryGuardianRelation: "",
          primaryGuardianPhoneNumber: "",
          primaryGuardianOccupation: ""
        },

        // Secondary Guardian
        secondaryGuardian: {
          secondaryGuardianName: "",
          secondaryGuardianRelation: "",
          secondaryGuardianPhoneNumber: "",
          secondaryGuardianOccupation: ""
        },
        
        // Siblings
        noOfBrothers: req.body.noOfBrother || "",
        noOfSisters: req.body.noOfSister || "",
        noOfBrothersMarried: req.body.brotherMarried || "",
        noOfSistersMarried: req.body.sisterMarried || "",
        
        // Education and Work Details
        educationLevel: req.body.educationLevel || "",
        educationField: req.body.educationField || "",
        workingWith: req.body.workingWith || "",
        designation: req.body.designation || "",
        annualIncome: req.body.annualIncome || "",

        // Religion & Astro
        caste: req.body.caste || "",
        subCaste: req.body.subCaste || "",
        manglikStatus: req.body.manglikStatus || "",
        rashi: req.body.rashi || "",
        timeOfBirth: req.body.timeOfBirth || "",
        birthPlace: req.body.birthPlace || "",

        // Array of objects with the specified fields
        imgList: Array(6).fill({
          imgUrl: "",
          imgVerificationBy: "",
          imgVerificationStatus: "pending",
          imgUploadedBy: "",    // ex: name/Id/dateTime
        }),

        // Partner Deatils
        partnerDetails:{
          partnerEducationLevel: [],
          partnerWorkingWith: [],
          partnerAnnualIncome: "",

          partnerMinAge: "",
          partnerMaxAge: "",

          partnerMinHeight: "",
          partnerMaxHeight: "",
          
          partnerMaritalStatus: [],
          partnerReligion: [],
          partnerCaste: "",
          partnerSubCaste: "",
          partnerManglikStatus: "",
          partnerLanguage: [],

          partnerDiet: [],
          partnerSmoke: "",
          partnerDrink: "",
          partnerDisability: "",
          
          partnerCountry: [],
          partnerState: [],
          partnerCity: [],
        },

        // Delete Account
        deleteProfile: "",
        reasonForDelete: "",
      };

      // Save user data to the database
      await saveUserRegistrationData(userId, userData);

      // Generate JWT token
      const token = jwt.sign({ userId }, secretKey, { expiresIn: "30m" });

      // Send response with token
      return res
        .status(200)
        .json({ message: "Data sent successfully.", token });
    } catch (error) {
      console.error("Error creating the user, Please try again later:", error);
      return res
        .status(500)
        .json({ message: "Error creating the user, Please try again later" });
    }
  },
};
