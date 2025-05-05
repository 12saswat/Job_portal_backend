const mongoose = require("mongoose");

const jobSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user", // Reference to the User model
    required: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  PhoneNo: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  role: {
    type: String,
    enum: ["developer", "designer", "ui/ux"],
    required: true,
  },
  resume: {
    data: Buffer,
    contentType: String,
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending",
  },
});

module.exports = mongoose.model("Job", jobSchema);
