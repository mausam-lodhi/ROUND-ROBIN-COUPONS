const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

const router = express.Router();

// Admin Registration
router.post("/register", async (req, res) => {
	const { username, password, secretKey } = req.body;

	try {
		// Verify secret key
		if (secretKey !== process.env.ADMIN_SECRET_KEY) {
			return res.status(401).json({ message: "Invalid secret key" });
		}

		// Check if admin exists
		const existingAdmin = await Admin.findOne({ username });
		if (existingAdmin) {
			return res.status(400).json({ message: "Username already exists" });
		}

		// Hash password
		const hashedPassword = await bcrypt.hash(password, 10);

		// Create new admin
		const admin = new Admin({
			username,
			password: hashedPassword,
		});

		await admin.save();
		res.status(201).json({ message: "Admin registered successfully" });
	} catch (error) {
		console.error("Registration error:", error);
		res.status(500).json({ message: "Error registering admin" });
	}
});

// Admin Login
router.post("/login", async (req, res) => {
	const { username, password } = req.body;

	try {
		// Validate input
		if (!username || !password) {
			return res.status(400).json({ message: "Username and password are required" });
		}

		// Find admin
		const admin = await Admin.findOne({ username });
		if (!admin) {
			return res.status(401).json({ message: "Invalid credentials" });
		}

		// Check password
		const isMatch = await bcrypt.compare(password, admin.password);
		if (!isMatch) {
			return res.status(401).json({ message: "Invalid credentials" });
		}

		// Generate token
		const token = jwt.sign({ id: admin._id, username: admin.username }, process.env.JWT_SECRET, { expiresIn: "24h" });

		res.json({
			token,
			message: "Login successful",
			user: { id: admin._id, username: admin.username },
		});
	} catch (error) {
		console.error("Login error:", error);
		res.status(500).json({
			message: "Server error during login",
			error: process.env.NODE_ENV === "development" ? error.message : undefined,
		});
	}
});

module.exports = router;
