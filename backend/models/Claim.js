const mongoose = require("mongoose");

const claimSchema = new mongoose.Schema({
	ip: String,
	browserSession: String,
	lastClaim: {
		type: Date,
		default: Date.now,
	},
	couponId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Coupon",
	},
});

module.exports = mongoose.model("Claim", claimSchema);
