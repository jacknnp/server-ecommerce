const express = require("express");
const router = express.Router();

//Validation---------------------------------------

const { validate } = require("../validation/auth");
//Validation---------------------------------------

//Controllers--------------------------------------
const {
  getReviews,
  getReviewBySlug,
  addReview,
  updateReview,
  updateReviewApprove,
  updateReviewReject,
  deleteReview,
} = require("../controller/review");
//Controllers--------------------------------------

router.get("/", getReviews);
router.get("/:slug", getReviewBySlug);

router.post("/add", validate.auth(), addReview);

router.put("/:id", updateReview);
router.put("/approve/:reviewId", validate.auth(), updateReviewApprove);
router.put("/reject/:reviewId", validate.auth(), updateReviewReject);

router.delete("/delete/:id", deleteReview);
module.exports = router;
