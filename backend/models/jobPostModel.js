const mongoose = require("mongoose");

const jobPostSchema = mongoose.Schema({
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user", // Ensure this references a user with role 'admin'
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  requirements: {
    type: [String], // Array of requirement strings
    required: true,
  },
  role: {
    type: String,
    enum: ["developer", "designer", "ui/ux"],
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  salaryRange: {
    type: String, // e.g., "$50k - $70k"
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  deadline: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model("JobPost", jobPostSchema);
