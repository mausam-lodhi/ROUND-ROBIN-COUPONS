const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema({
	code: {
		type: String,
		required: true,
		unique: true,
		trim: true,
	},
	isUsed: {
		type: Boolean,
		default: false,
	},
	status: {
		type: String,
		enum: ["available", "claimed", "disabled"], // Add "disabled" here
		default: "available",
	},
	claimedBy: {
		ip: String,
		browserSession: String,
		claimedAt: Date,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

module.exports = mongoose.model("Coupon", couponSchema);
