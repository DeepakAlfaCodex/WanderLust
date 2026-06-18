const express = require("express");
const router = express.Router();
const wrapAsync = require("../utills/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

// --- 1. Root Route ("/") ---
// Isme Index aur Create dono ko ek sath chain kar diya
router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(isLoggedIn, upload.single("listing[image]"), validateListing, wrapAsync(listingController.createListing));


// --- 2. New Route ("/new") ---
// Iska koi joda nahi hai, toh ise alag hi rakhna padega
router.get("/new", isLoggedIn, listingController.renderForm);

// --- 3. ID Route ("/:id") ---
// Isme Show, Update aur Delete teeno ko ek sath chain kar diya
router
  .route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"), 
    validateListing,
    wrapAsync(listingController.updateListing),
  )
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

// --- 4. Edit Route ("/:id/edit") ---
// Ye bhi unique URL hai, toh ise alag rakha hai
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm),
);

module.exports = router;
