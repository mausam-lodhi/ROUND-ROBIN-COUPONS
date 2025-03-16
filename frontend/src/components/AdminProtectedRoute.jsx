import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchAdminCoupons } from "../api/api";
import Loading from "./Loading";

export default function AdminProtectedRoute() {
	const [isValid, setIsValid] = useState(null);
	const token = localStorage.getItem("adminToken");

	useEffect(() => {
		const validateToken = async () => {
			if (!token) {
				setIsValid(false);
				return;
			}

			try {
				await fetchAdminCoupons();
				setIsValid(true);
			} catch (error) {
				console.error("Token validation failed:", error);
				localStorage.removeItem("adminToken");
				setIsValid(false);
			}
		};

		validateToken();
	}, [token]);

	if (isValid === null) {
		return <Loading fullScreen={true} />;
	}

	return isValid ? <Outlet /> : <Navigate to='/admin-login' replace />;
}
