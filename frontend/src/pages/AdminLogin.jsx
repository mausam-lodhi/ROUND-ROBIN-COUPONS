import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { adminLogin } from "../api/api";
import { toast } from "react-toastify";

export default function AdminLogin() {
	const [formData, setFormData] = useState({ username: "", password: "" });
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	const handleLogin = async (e) => {
		e.preventDefault();
		if (loading) return;

		setLoading(true);
		try {
			const response = await adminLogin(formData.username, formData.password);
			if (response?.data?.token) {
				localStorage.setItem("adminToken", response.data.token);
				// Wait for token to be saved
				await new Promise((resolve) => setTimeout(resolve, 100));
				toast.success("Login successful!");
				navigate("/admin", { replace: true });
			}
		} catch (error) {
			toast.error(error?.response?.data?.message || "Login failed");
			localStorage.removeItem("adminToken"); // Clear any invalid token
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
			<div className='max-w-md w-full space-y-8 bg-white p-6 rounded-lg shadow-md'>
				<h1 className='section-title text-center'>Admin Login</h1>
				<form onSubmit={handleLogin} className='space-y-4'>
					<input
						type='text'
						placeholder='Username'
						className='input-field'
						value={formData.username}
						onChange={(e) => setFormData({ ...formData, username: e.target.value })}
						disabled={loading}
						required
					/>
					<input
						type='password'
						placeholder='Password'
						className='input-field'
						value={formData.password}
						onChange={(e) => setFormData({ ...formData, password: e.target.value })}
						disabled={loading}
						required
					/>
					<button type='submit' className={`btn-primary w-full ${loading ? "opacity-50 cursor-not-allowed" : ""}`} disabled={loading}>
						{loading ? (
							<div className='flex items-center justify-center'>
								<div className='animate-spin h-5 w-5 mr-3 border-2 border-white border-t-transparent rounded-full'></div>
								Logging in...
							</div>
						) : (
							"Login"
						)}
					</button>
				</form>
				<p className='mt-4 text-center'>
					Need an account?{" "}
					<Link to='/admin-register' className='text-blue-500 hover:underline'>
						Register here
					</Link>
				</p>
			</div>
		</div>
	);
}
