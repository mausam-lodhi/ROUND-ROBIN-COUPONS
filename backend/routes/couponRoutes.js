const express = require("express");
const Coupon = require("../models/Coupon");
const Claim = require("../models/Claim");
const authMiddleware = require("../middleware/auth");
const router = express.Router();
const mongoose = require("mongoose");

// Claim a coupon
router.post("/claim", async (req, res) => {
	try {
		const ip = req.ip;
		const browserSession = req.headers["user-agent"] || "unknown";

		// Check recent claims
		const recentClaim = await Claim.findOne({
			ip,
			browserSession,
			lastClaim: { $gt: new Date(Date.now() - 60000) },
		});

		if (recentClaim) {
			return res.status(429).json({
				message: "Please wait before claiming another coupon",
				remainingTime: 60000 - (Date.now() - recentClaim.lastClaim.getTime()),
			});
		}

		// Find and claim an available coupon
		const coupon = await Coupon.findOneAndUpdate(
			{ status: "available" },
			{
				status: "claimed",
				claimedBy: { ip, browserSession, claimedAt: new Date() },
			},
			{ new: true }
		);

		if (!coupon) {
			return res.status(404).json({ message: "No coupons available" });
		}

		// Record the claim
		await Claim.create({
			ip,
			browserSession,
			lastClaim: new Date(),
			couponId: coupon._id,
		});

		res.json({
			message: "Coupon claimed successfully",
			code: coupon.code,
		});
	} catch (error) {
		console.error("Claim error:", error);
		res.status(500).json({ message: "Error claiming coupon" });
	}
});

// Get all coupons
router.get("/list", async (req, res) => {
	try {
		const coupons = await Coupon.find();
		res.json(coupons);
	} catch (err) {
		res.status(500).json({ message: "Server error" });
	}
});

// Admin routes
router.get("/admin", authMiddleware, async (req, res) => {
	try {
		const coupons = await Coupon.find().sort({ createdAt: -1 });
		res.json(coupons);
	} catch (error) {
		res.status(500).json({ message: "Error fetching coupons" });
	}
});

router.get("/admin/claims", authMiddleware, async (req, res) => {
	try {
		const claims = await Claim.find().populate("couponId", "code").sort({ lastClaim: -1 });
		res.json(claims);
	} catch (error) {
		console.error("Error fetching claims:", error);
		res.status(500).json({ message: "Error fetching claim history" });
	}
});

router.post("/add", authMiddleware, async (req, res) => {
	try {
		const { code } = req.body;
		const newCoupon = new Coupon({ code });
		await newCoupon.save();
		res.status(201).json(newCoupon);
	} catch (error) {
		res.status(400).json({ message: "Error adding coupon" });
	}
});

// Add bulk coupons
router.post("/bulk-add", authMiddleware, async (req, res) => {
	try {
		const { codes } = req.body;
		if (!Array.isArray(codes) || codes.length === 0) {
			return res.status(400).json({ message: "Please provide an array of coupon codes" });
		}

		const coupons = codes.map((code) => ({
			code: code.trim(),
			status: "available",
		}));

		const insertedCoupons = await Coupon.insertMany(coupons, { ordered: false });
		res.status(201).json({
			message: `Successfully added ${insertedCoupons.length} coupons`,
			coupons: insertedCoupons,
		});
	} catch (error) {
		if (error.code === 11000) {
			// Duplicate key error
			res.status(400).json({ message: "Some coupon codes are duplicates" });
		} else {
			res.status(500).json({ message: "Error adding coupons" });
		}
	}
});

// Toggle coupon availability
router.patch("/toggle/:id", authMiddleware, async (req, res) => {
	try {
		const coupon = await Coupon.findById(req.params.id);
		if (!coupon) {
			return res.status(404).json({ message: "Coupon not found" });
		}
		coupon.status = coupon.status === "available" ? "disabled" : "available";
		await coupon.save();
		res.json({ message: "Coupon status updated", coupon });
	} catch (error) {
		console.error("Error toggling coupon status:", error);
		res.status(500).json({ message: "Error toggling coupon status" });
	}
});

router.delete("/:id", authMiddleware, async (req, res) => {
	try {
		await Coupon.findByIdAndDelete(req.params.id);
		res.json({ message: "Coupon deleted successfully" });
	} catch (error) {
		res.status(500).json({ message: "Error deleting coupon" });
	}
});

module.exports = router;
