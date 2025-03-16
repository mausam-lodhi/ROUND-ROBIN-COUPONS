import { Link } from "react-router-dom";

export default function NotFound() {
	return (
		<div className='flex flex-col items-center justify-center min-h-screen bg-gray-100'>
			<h1 className='text-6xl font-bold mb-4 text-red-600'>404</h1>
			<p className='text-2xl mb-8 text-gray-700'>Page Not Found</p>
			<Link to='/' className='px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors'>
				Return Home
			</Link>
		</div>
	);
}
