import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserInterface from "./components/UserInterface";
import AdminPanel from "./components/AdminPanel";
import AdminLogin from "./pages/AdminLogin";
import AdminProtectedRoute from "./components/AdminProtectedRoute";
import HomePage from "./pages/HomePage";
import NotFound from "./pages/NotFound";
import AdminRegister from "./pages/AdminRegister";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
	return (
		<Router>
			<ToastContainer position='top-right' />
			<Routes>
				<Route path='/' element={<HomePage />} />
				<Route path='/claim' element={<UserInterface />} />
				<Route path='/admin-login' element={<AdminLogin />} />
				<Route path='/admin-register' element={<AdminRegister />} />
				<Route element={<AdminProtectedRoute />}>
					<Route path='/admin' element={<AdminPanel />} />
				</Route>
				<Route path='*' element={<NotFound />} />
			</Routes>
		</Router>
	);
}
