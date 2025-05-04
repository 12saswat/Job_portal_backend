const mongoose = require("mongoose");

const jobSchema = mongoose.Schema({
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
});

module.exports = mongoose.model("Job", jobSchema);
