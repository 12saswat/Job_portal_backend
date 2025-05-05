const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModels");
const jobModel = require("../models/jobModel");
const jobPostModel = require("../models/jobPostModel");

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    const existingEmail = await userModel.findOne({ email });
    if (existingEmail) {
      return res.status(409).json({ msg: "User already exists" });
    }

    const hashpassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      name,
      email,
      password: hashpassword,
      role,
    });

    return res.status(200).json({ msg: "User created", user });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "Internal server error" });
  }
};

// Get all users
exports.getUsers = async (req, res) => {
  try {
    const users = await userModel.find();
    if (!users || users.length === 0) {
      return res.status(404).json({ msg: "No users found" });
    }
    return res.status(200).json({ msg: "Users found", users });
  } catch (err) {
    return res.status(500).json({ msg: "Server error" });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(401).json({ msg: "Invalid credentials" });
    }

    const isMatchedPassword = await bcrypt.compare(password, user.password);
    if (!isMatchedPassword) {
      return res.status(401).json({ msg: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.SECRETE_KEY
    );

    return res.status(200).json({
      msg: "Login successful",
      user: { email: user.email, role: user.role },
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// for prifile
exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await userModel.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const appliedJob = await jobModel
      .find({ user: userId })
      .select("-resume.data");

    res.status(200).json({ msg: "User profile fetched", user, appliedJob });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// For apply form
exports.applyJob = async (req, res) => {
  try {
    const { fullName, email, PhoneNo, description, role, resume } = req.body;

    // ✅ Prevent crash if file is missing
    if (!req.file) {
      return res.status(400).json({ error: "Resume file is missing" });
    }

    const newApplication = new jobModel({
      user: req.user._id,
      fullName,
      PhoneNo,
      email,
      description,
      role,
      status: "pending",
      resume: {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      },
    });

    await newApplication.save();
    res.status(201).json({ message: "Application submitted successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to submit job application" });
  }
};

// for application Lists
exports.getAllApplications = async (req, res) => {
  try {
    const applications = await jobModel
      .find()
      .select("role") // Select only the job role (not full application)
      .populate("user", "name email"); // Populate user name and email only

    // Simplify the response
    const formatted = applications.map((app) => ({
      name: app.user?.name || "Unknown",
      email: app.user?.email || "Unknown",
      jobRole: app.role,
    }));

    res.json({ applications: formatted });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch applications" });
  }
};

// To view the application
exports.getSelectApplication = async (req, res) => {
  try {
    const applicationId = req.params.id;

    const application = await jobModel
      .findById(applicationId)
      .select("-resume.data")
      .populate("user", "name email");

    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }

    res.status(200).json({ message: "Application found", application });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch application" });
  }
};

// To accept the job application
exports.ToAcceptApplication = async (req, res) => {
  try {
    const updated = await jobModel
      .findByIdAndUpdate(req.params.id, { status: "accepted" }, { new: true })
      .select("status");
    if (!updated) {
      return res.status(404).json({ error: "Application not found" });
    }
    res.json({ message: "Application accepted", application: updated });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "internal server error" });
  }
};

// To reject the job application
exports.ToRejectApplication = async (req, res) => {
  try {
    const updated = await jobModel
      .findByIdAndUpdate(req.params.id, { status: "rejected" }, { new: true })
      .select("status");
    if (!updated) {
      return res.status(404).json({ error: "Application not found" });
    }
    res.json({ message: "Application accepted", application: updated });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "internal server error" });
  }
};

// for job posting (admin only)
exports.jobPosting = async (req, res) => {
  try {
    const {
      title,
      description,
      requirements,
      role,
      location,
      salaryRange,
      deadline,
    } = req.body;

    if (
      !title ||
      !description ||
      !requirements ||
      !role ||
      !location ||
      !salaryRange ||
      !deadline
    ) {
      return res.status(404).json({ msg: "All field are required" });
    }

    const user = await userModel.findById(req.user.id);
    if (!user || user.role !== "admin") {
      return res
        .status(403)
        .json({ msg: "Access denied. Only admin can post a job " });
    }
    const jobPost = await new jobPostModel({
      admin: user._id,
      title,
      description,
      requirements,
      role,
      location,
      salaryRange,
      deadline,
    });

    await jobPost.save();
    return res.status(200).json({ msg: "Job posted success", jobPost });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Internal server error" });
  }
};

exports.jobLists = async (req, res) => {
  try {
    const jobs = await jobPostModel
      .find()
      .select("title description role location"); // show admin's name and email
    res.status(200).json({ jobs });
  } catch (error) {
    console.error("Error fetching job posts:", error);
    res.status(500).json({ message: "Server error while fetching jobs" });
  }
};
