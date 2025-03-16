import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { adminRegister } from "../api/api";

export default function AdminRegister() {
	const [formData, setFormData] = useState({
		username: "",
		password: "",
		confirmPassword: "",
		secretKey: "",
	});
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (formData.password !== formData.confirmPassword) {
			toast.error("Passwords do not match");
			return;
		}

		setLoading(true);
		try {
			const { confirmPassword, ...registerData } = formData;
			await adminRegister(registerData);
			toast.success("Registration successful!");
			navigate("/admin-login");
		} catch (error) {
			console.error("Registration error:", error);
			toast.error(error.response?.data?.message || "Registration failed. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='container mx-auto py-12'>
			<div className='max-w-md mx-auto card'>
				<h1 className='section-title text-center'>Admin Registration</h1>
				<form onSubmit={handleSubmit} className='space-y-4'>
					<input
						type='text'
						placeholder='Username'
						className='input-field'
						value={formData.username}
						onChange={(e) => setFormData({ ...formData, username: e.target.value })}
						required
					/>
					<input
						type='password'
						placeholder='Password'
						className='input-field'
						value={formData.password}
						onChange={(e) => setFormData({ ...formData, password: e.target.value })}
						required
					/>
					<input
						type='password'
						placeholder='Confirm Password'
						className='input-field'
						value={formData.confirmPassword}
						onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
						required
					/>
					<input
						type='password'
						placeholder='Admin Secret Key'
						className='input-field'
						value={formData.secretKey}
						onChange={(e) => setFormData({ ...formData, secretKey: e.target.value })}
						required
					/>
					<button type='submit' className='btn-primary w-full' disabled={loading}>
						{loading ? "Registering..." : "Register"}
					</button>
				</form>
				<p className='mt-4 text-center'>
					Already have an account?{" "}
					<Link to='/admin-login' className='text-blue-500 hover:underline'>
						Login here
					</Link>
				</p>
			</div>
		</div>
	);
}
