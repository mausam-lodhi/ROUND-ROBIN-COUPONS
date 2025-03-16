import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserInterface from "./components/UserInterface";
import AdminPanel from "./components/AdminPanel";
import AdminLogin from "./pages/AdminLogin";
import AdminProtectedRoute from "./components/AdminProtectedRoute";

export default function App() {
	return (
		<Router>
			<Routes>
				<Route path='/' element={<UserInterface />} />
				<Route path='/admin-login' element={<AdminLogin />} />
				<Route element={<AdminProtectedRoute />}>
					<Route path='/admin' element={<AdminPanel />} />
				</Route>
			</Routes>
		</Router>
	);
}
