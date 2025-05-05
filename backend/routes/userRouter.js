const express = require("express");
const router = express.Router();
const verifyToken = require("../middlesware/auth");
const {
  registerUser,
  getUsers,
  loginUser,
  getUserProfile,
  applyJob,
  getAllApplications,
  ToAcceptApplication,
  ToRejectApplication,
  getSelectApplication,
  jobPosting,
  jobLists,
} = require("../controllers/userController");
const requireRole = require("../middlesware/role");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

// for registrtaion
router.post("/register", registerUser);

// for get all Users
router.get("/getUsers", verifyToken, requireRole("admin"), getUsers);

// For login
router.post("/login", loginUser);

// For profile
router.get("/profile", verifyToken, getUserProfile);

// For Job form
router.post(
  "/apply_job",
  verifyToken,
  requireRole("employee"),
  upload.single("resume"),
  applyJob
);
router.get(
  "/applications",
  verifyToken,
  requireRole("admin"),
  getAllApplications
);
router.get(
  "/view_appliction/:id",
  verifyToken,
  requireRole("admin"),
  getSelectApplication
);
router.patch(
  "/accepted/:id",
  verifyToken,
  requireRole("admin"),
  ToAcceptApplication
);
router.patch(
  "/rejected/:id",
  verifyToken,
  requireRole("admin"),
  ToRejectApplication
);

// For posting the jobs
router.post("/post_job", verifyToken, requireRole("admin"), jobPosting);

// To get the jobs
router.get("/jobs", verifyToken, jobLists);

module.exports = router;
