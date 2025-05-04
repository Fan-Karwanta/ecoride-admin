import { Route, Routes, Navigate, useLocation, Outlet } from "react-router-dom";

import Sidebar from "./components/common/Sidebar";
import ProtectedRoute from "./components/common/ProtectedRoute";

import OverviewPage from "./pages/OverviewPage";
import ProductsPage from "./pages/ProductsPage";
import UsersPage from "./pages/UsersPage";
import SalesPage from "./pages/SalesPage";
import OrdersPage from "./pages/OrdersPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import SettingsPage from "./pages/SettingsPage";
import LoginPage from "./pages/LoginPage";

// Layout component for authenticated pages
const DashboardLayout = () => {
	return (
		<div className='flex h-screen bg-gray-900 text-gray-100 overflow-hidden'>
			{/* BG */}
			<div className='fixed inset-0 z-0 pointer-events-none'>
				<div className='absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-80' />
				{/* Removed backdrop-blur-sm div */}
			</div>

			<Sidebar />
			<main className="flex-1 overflow-auto z-10">
				<Outlet />
			</main>
		</div>
	);
};

function App() {
	return (
		<Routes>
			{/* Public routes */}
			<Route path="/login" element={<LoginPage />} />
			
			{/* Protected routes using the new ProtectedRoute component */}
			<Route element={<ProtectedRoute />}>
				<Route element={<DashboardLayout />}>
					<Route path="/" element={<OverviewPage />} />
					<Route path="/users" element={<UsersPage />} />
					<Route path="/sales" element={<SalesPage />} />
					<Route path="/orders" element={<OrdersPage />} />
					<Route path="/analytics" element={<AnalyticsPage />} />
					<Route path="/settings" element={<SettingsPage />} />
				</Route>
			</Route>
			
			{/* Catch all route - redirect to login */}
			<Route path="*" element={<Navigate to="/login" replace />} />
		</Routes>
	);
}

export default App;
