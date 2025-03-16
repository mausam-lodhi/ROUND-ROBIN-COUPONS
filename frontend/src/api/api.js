import axios from "axios";
import { toast } from "react-toastify";

const API_URL = "http://localhost:5000/api";

// Create axios instance with defaults
const api = axios.create({
	baseURL: API_URL,
	timeout: 5000,
	headers: {
		"Content-Type": "application/json",
	},
});

// Add request interceptor
api.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem("adminToken");
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

// Add response interceptor
api.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.code === "ECONNABORTED") {
			toast.error("Request timed out. Please try again.");
		}
		return Promise.reject(error);
	}
);

// Export api instance
export { api };

// Public endpoints
export const fetchCoupons = () => api.get("/coupons");
export const claimCoupon = () => api.post("/coupons/claim");

// Admin endpoints
export const adminLogin = (username, password) => api.post("/auth/login", { username, password });

export const adminRegister = ({ username, password, secretKey }) => api.post("/auth/register", { username, password, secretKey });

export const fetchAdminCoupons = (endpoint = "") => {
	const path = endpoint ? `/coupons/admin${endpoint}` : "/coupons/admin";
	return api.get(path);
};

export const fetchClaimHistory = () => api.get("/coupons/admin/claims");

export const addCoupon = (code) => api.post("/coupons/add", { code });

export const addBulkCoupons = (codes) => api.post("/coupons/bulk-add", { codes });

export const deleteCoupon = (id) => api.delete(`/coupons/${id}`);

export const toggleCouponStatus = (id) => api.patch(`/coupons/toggle/${id}`);
