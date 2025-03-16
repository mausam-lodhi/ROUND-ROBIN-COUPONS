import { useEffect, useState } from "react";
import { fetchCoupons } from "../api/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CouponManagement from "./CouponManagement";

export default function AdminPanel() {
	const [coupons, setCoupons] = useState([]);
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();

	useEffect(() => {
		const loadCoupons = async () => {
			const token = localStorage.getItem("adminToken");
			if (!token) {
				navigate("/admin-login");
				return;
			}
			try {
				const response = await fetchCoupons(token);
				setCoupons(response.data);
				toast.success("Coupons loaded successfully");
			} catch (error) {
				console.error("Error fetching coupons", error);
				toast.error("Failed to load coupons");
			} finally {
				setLoading(false);
			}
		};
		loadCoupons();
	}, [navigate]);

	const handleLogout = () => {
		localStorage.removeItem("adminToken");
		toast.info("Logged out successfully");
		navigate("/admin-login");
	};

	return (
		<div className='p-6'>
			<div className='flex justify-between items-center mb-4'>
				<h1 className='text-2xl font-bold'>Admin Panel</h1>
				<button onClick={handleLogout} className='bg-red-500 text-white px-4 py-2 rounded'>
					Logout
				</button>
			</div>
			<CouponManagement coupons={coupons} setCoupons={setCoupons} />
			{loading ? (
				<p className='text-gray-500'>Loading coupons...</p>
			) : (
				<ul>
					{coupons.map((coupon, index) => (
						<li key={index} className='border p-2 mb-2'>
							{coupon.code}
						</li>
					))}
				</ul>
			)}
		</div>
	);
}
