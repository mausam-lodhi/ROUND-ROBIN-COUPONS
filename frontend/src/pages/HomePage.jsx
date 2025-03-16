import { Link } from "react-router-dom";

export default function HomePage() {
	return (
		<div className='min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center px-4 py-8 p-20'>
			<div >
				<h1>Coupon Management System</h1>
				<br />
				<br />
				<Link to='/claim' className='btn-modern btn-primary w-full sm:w-auto px-6 py-3 text-base'>
					Claim a Coupon
				</Link>

				<Link to='/admin-login' className='btn-modern btn-secondary w-full sm:w-auto px-6 py-3 text-base'>
					Admin Login
				</Link>
			</div>
		</div>
	);
}
