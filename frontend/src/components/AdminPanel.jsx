import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { fetchAdminCoupons, addBulkCoupons, toggleCouponStatus, fetchClaimHistory } from "../api/api";
import Loading from "./Loading";

export default function AdminPanel() {
	const [coupons, setCoupons] = useState([]);
	const [claims, setClaims] = useState([]);
	const [view, setView] = useState("coupons"); // 'coupons' or 'claims'
	const [loading, setLoading] = useState(true);
	const [newCoupons, setNewCoupons] = useState("");
	const navigate = useNavigate();

	useEffect(() => {
		loadData();
	}, [view]);

	const loadData = async () => {
		setLoading(true);
		try {
			if (view === "coupons") {
				const response = await fetchAdminCoupons();
				setCoupons(response.data);
			} else {
				const response = await fetchClaimHistory();
				setClaims(response.data);
			}
		} catch (error) {
			console.error("Error fetching data:", error);
			if (error.response?.status === 401) {
				localStorage.removeItem("adminToken");
				navigate("/admin-login");
			} else {
				toast.error("Failed to load data");
			}
		} finally {
			setLoading(false);
		}
	};

	const handleLogout = () => {
		localStorage.removeItem("adminToken");
		toast.info("Logged out successfully");
		navigate("/admin-login");
	};

	const handleBulkAdd = async () => {
		try {
			const codes = newCoupons.split("\n").filter((code) => code.trim());
			const response = await addBulkCoupons(codes);
			toast.success(`Added ${response.data.coupons.length} coupons`);
			loadData();
			setNewCoupons("");
		} catch (error) {
			toast.error(error.response?.data?.message || "Error adding coupons");
		}
	};

	const handleToggleStatus = async (id) => {
		try {
			const response = await toggleCouponStatus(id);
			toast.success(response.data.message);
			loadData();
		} catch (error) {
			toast.error(error.response?.data?.message || "Error toggling coupon status");
		}
	};

	if (loading) {
		return <Loading fullScreen={true} />;
	}

	return (
		<div className='container mx-auto py-8'>
			<div className='card'>
				<div className='flex justify-between items-center mb-8'>
					<h1 className='page-title mb-0'>Admin Dashboard</h1>
					<button onClick={handleLogout} className='btn-secondary bg-red-500 hover:bg-red-600'>
						Logout
					</button>
				</div>

				<div className='mb-6 flex gap-4'>
					<button
						onClick={() => setView("coupons")}
						className={`px-6 py-3 rounded-lg transition-colors ${view === "coupons" ? "bg-indigo-600 text-white" : "bg-gray-100 hover:bg-gray-200"}`}>
						Coupons
					</button>
					<button
						onClick={() => setView("claims")}
						className={`px-6 py-3 rounded-lg transition-colors ${view === "claims" ? "bg-indigo-600 text-white" : "bg-gray-100 hover:bg-gray-200"}`}>
						Claim History
					</button>
				</div>

				{view === "coupons" ? (
					<div className='grid gap-4'>
						{coupons.map((coupon) => (
							<div key={coupon._id} className='p-4 bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow flex justify-between items-center'>
								<div>
									<p className='font-semibold text-lg'>{coupon.code}</p>
									<p className={`text-sm ${coupon.status === "available" ? "text-green-600" : "text-red-600"}`}>Status: {coupon.status}</p>
								</div>
								<button
									onClick={() => handleToggleStatus(coupon._id)}
									className={`btn-secondary ${
										coupon.status === "available" ? "bg-yellow-500 hover:bg-yellow-600" : "bg-green-500 hover:bg-green-600"
									}`}>
									{coupon.status === "available" ? "Disable" : "Enable"}
								</button>
							</div>
						))}
					</div>
				) : (
					<div className='grid gap-4'>
						{claims.map((claim) => (
							<div key={claim._id} className='p-4 border rounded'>
								{claim.couponId ? (
									<>
										<p className='font-semibold'>{claim.couponId.code}</p>
										<p className='text-sm text-gray-600'>Claimed by IP: {claim.ip}</p>
										<p className='text-sm text-gray-600'>Claimed at: {new Date(claim.lastClaim).toLocaleString()}</p>
									</>
								) : (
									<p className='text-sm text-red-600'>Coupon data not available</p>
								)}
							</div>
						))}
					</div>
				)}
			</div>

			<div className='card mt-8'>
				<h2 className='section-title'>Add Multiple Coupons</h2>
				<textarea
					className='input-field min-h-[120px] mb-4'
					placeholder='Enter coupon codes (one per line)'
					value={newCoupons}
					onChange={(e) => setNewCoupons(e.target.value)}
				/>
				<button onClick={handleBulkAdd} className='btn-primary bg-green-600 hover:bg-green-700'>
					Add Bulk Coupons
				</button>
			</div>
		</div>
	);
}
