import { Route, Routes, Navigate, useLocation, Outlet } from "react-router-dom";
import { useEffect } from "react";

import Sidebar from "./components/common/Sidebar";

import OverviewPage from "./pages/OverviewPage";
import ProductsPage from "./pages/ProductsPage";
import UsersPage from "./pages/UsersPage";
import SalesPage from "./pages/SalesPage";
import OrdersPage from "./pages/OrdersPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import SettingsPage from "./pages/SettingsPage";
import LoginPage from "./pages/LoginPage";
import { useAuth } from "./context/AuthContext";

// Protected route component
const ProtectedRoute = ({ children }) => {
	const { isAuthenticated, isLoading } = useAuth();
	const location = useLocation();

	// Show loading state if authentication is still being checked
	if (isLoading) {
		return <div className="flex items-center justify-center h-screen bg-gray-900">
			<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
		</div>;
	}

	if (!isAuthenticated) {
		return <Navigate to="/login" state={{ from: location }} replace />;
	}

	return children;
};

// Layout component for authenticated pages
const DashboardLayout = () => {
	return (
		<div className='flex h-screen bg-gray-900 text-gray-100 overflow-hidden'>
			{/* BG */}
			<div className='fixed inset-0 z-0'>
				<div className='absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-80' />
				<div className='absolute inset-0 backdrop-blur-sm' />
			</div>

			<Sidebar />
			<main className="flex-1 overflow-auto">
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
			
			{/* Protected routes */}
			<Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
				<Route path="/" element={<OverviewPage />} />
				{/* <Route path="/products" element={<ProductsPage />} /> */}
				<Route path="/users" element={<UsersPage />} />
				<Route path="/sales" element={<SalesPage />} />
				<Route path="/orders" element={<OrdersPage />} />
				<Route path="/analytics" element={<AnalyticsPage />} />
				<Route path="/settings" element={<SettingsPage />} />
			</Route>
			
			{/* Catch all route - redirect to login */}
			<Route path="*" element={<Navigate to="/login" replace />} />
		</Routes>
	);
}

export default App;
