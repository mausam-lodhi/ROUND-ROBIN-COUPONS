import { useState, useEffect } from "react";
import { claimCoupon } from "../api/api";
import { toast } from "react-toastify";

export default function ClaimCoupon() {
	const [claimed, setClaimed] = useState(false);
	const [cooldown, setCooldown] = useState(0);

	useEffect(() => {
		const storedCooldown = localStorage.getItem("cooldownTime");
		if (storedCooldown) {
			const remainingTime = Math.max(0, storedCooldown - Date.now());
			if (remainingTime > 0) {
				setCooldown(remainingTime);
				const timer = setInterval(() => {
					setCooldown((prev) => (prev > 1000 ? prev - 1000 : 0));
				}, 1000);
				return () => clearInterval(timer);
			}
		}
	}, []);

	const handleClaim = async () => {
		if (cooldown > 0) {
			toast.error(`Please wait ${Math.ceil(cooldown / 1000)} seconds.`);
			return;
		}

		try {
			const response = await claimCoupon();
			toast.success(`Coupon claimed: ${response.data.code}`);
			setClaimed(true);
			const newCooldown = Date.now() + 60000; // 1-minute cooldown
			localStorage.setItem("cooldownTime", newCooldown);
			setCooldown(60000);

			const timer = setInterval(() => {
				setCooldown((prev) => (prev > 1000 ? prev - 1000 : 0));
			}, 1000);
			return () => clearInterval(timer);
		} catch (error) {
			toast.error("Failed to claim coupon");
		}
	};

	return (
		<div className='p-6 text-center'>
			<h2 className='text-xl font-bold mb-4'>Claim Your Coupon</h2>
			<button onClick={handleClaim} className='bg-blue-500 text-white px-4 py-2 rounded' disabled={cooldown > 0}>
				{cooldown > 0 ? `Wait ${Math.ceil(cooldown / 1000)}s` : "Claim Coupon"}
			</button>
			{claimed && <p className='mt-4 text-green-500'>You have successfully claimed a coupon!</p>}
		</div>
	);
}
