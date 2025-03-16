import { useState } from "react";
import { claimCoupon as claimCouponApi } from "../api/api";
import { toast } from "react-toastify";

export default function UserInterface() {
	const [coupon, setCoupon] = useState(null);
	const [loading, setLoading] = useState(false);

	const claimCoupon = async () => {
		setLoading(true);
		try {
			const response = await claimCouponApi();
			if (response.data.code) {
				setCoupon(response.data.code);
				toast.success(response.data.message);
			}
		} catch (err) {
			console.error("API Error:", err);
			if (err.response?.status === 429) {
				const remainingTime = Math.ceil(err.response.data.remainingTime / 1000);
				toast.warning(`Please wait ${remainingTime} seconds before claiming again`);
			} else if (err.response?.status === 404) {
				toast.error("No coupons available");
			} else {
				toast.error(err.response?.data?.message || "Error claiming coupon");
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='container mx-auto py-12'>
			<h1 className='page-title'>Coupon Claiming System</h1>
			<div className='max-w-md mx-auto card'>
				<h2 className='section-title text-center'>Claim Your Coupon</h2>
				<div className='space-y-6'>
					<button onClick={claimCoupon} disabled={loading} className='btn-primary w-full flex items-center justify-center gap-2'>
						{loading ? (
							<>
								<div className='spinner w-5 h-5'></div>
								<span>Processing...</span>
							</>
						) : (
							"Claim Coupon"
						)}
					</button>

					{coupon && (
						<div className='mt-6 p-6 bg-green-50 border border-green-200 rounded-lg'>
							<p className='text-center text-green-800'>
								<span className='block text-sm mb-2'>Your Coupon Code:</span>
								<span className='font-mono text-lg font-bold'>{coupon}</span>
							</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
