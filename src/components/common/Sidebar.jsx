import { BarChart2, DollarSign, Menu, Settings, ShoppingBag, ShoppingCart, TrendingUp, Users, LogOut } from "lucide-react";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const SIDEBAR_ITEMS = [
	{
		name: "Overview",
		icon: BarChart2,
		color: "#6366f1",
		href: "/",
	},
	// { name: "Products", icon: ShoppingBag, color: "#8B5CF6", href: "/products" },
	{ name: "User Management", icon: Users, color: "#EC4899", href: "/users" },
	{ name: "Finance", icon: DollarSign, color: "#10B981", href: "/sales" },
	//{ name: "Orders", icon: ShoppingCart, color: "#F59E0B", href: "/orders" },
	//{ name: "Analytics", icon: TrendingUp, color: "#3B82F6", href: "/analytics" },
	{ name: "Settings", icon: Settings, color: "#6EE7B7", href: "/settings" },
];

const Sidebar = () => {
	const [isSidebarOpen, setIsSidebarOpen] = useState(true);
	const { logout } = useAuth();

	return (
		<motion.div
			className={`relative z-10 transition-all duration-300 ease-in-out flex-shrink-0 ${
				isSidebarOpen ? "w-64" : "w-20"
			}`}
			animate={{ width: isSidebarOpen ? 256 : 80 }}
		>
			<div className='h-full bg-gray-800 bg-opacity-50 backdrop-blur-md p-4 flex flex-col border-r border-gray-700'>
				<motion.button
					whileHover={{ scale: 1.1 }}
					whileTap={{ scale: 0.9 }}
					onClick={() => setIsSidebarOpen(!isSidebarOpen)}
					className='p-2 rounded-full hover:bg-gray-700 transition-colors max-w-fit'
				>
					<Menu size={24} />
				</motion.button>
				
				<AnimatePresence>
					{isSidebarOpen && (
						<motion.div
							initial={{ opacity: 0, scale: 0.8 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.8 }}
							className='flex items-center justify-center mb-2'
						>
							<img 
								src="/ecoride_logo.png" 
								alt="Ecoride Admin Panel" 
								className='h-24 w-auto'
							/>
						</motion.div>
					)}
				</AnimatePresence>

				<nav className='mt-2 flex-grow'>
					{SIDEBAR_ITEMS.map((item) => (
						<Link key={item.href} to={item.href}>
							<motion.div className='flex items-center p-4 text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors mb-2'>
								<item.icon size={20} style={{ color: item.color, minWidth: "20px" }} />
								<AnimatePresence>
									{isSidebarOpen && (
										<motion.span
											className='ml-4 whitespace-nowrap'
											initial={{ opacity: 0, width: 0 }}
											animate={{ opacity: 1, width: "auto" }}
											exit={{ opacity: 0, width: 0 }}
											transition={{ duration: 0.2, delay: 0.3 }}
										>
											{item.name}
										</motion.span>
									)}
								</AnimatePresence>
							</motion.div>
						</Link>
					))}
				</nav>

				{/* Logout button */}
				<button 
					onClick={logout}
					className='flex items-center p-4 text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors mt-auto'
				>
					<LogOut size={20} style={{ color: "#EF4444", minWidth: "20px" }} />
					<AnimatePresence>
						{isSidebarOpen && (
							<motion.span
								className='ml-4 whitespace-nowrap'
								initial={{ opacity: 0, width: 0 }}
								animate={{ opacity: 1, width: "auto" }}
								exit={{ opacity: 0, width: 0 }}
								transition={{ duration: 0.2, delay: 0.3 }}
							>
								Logout
							</motion.span>
						)}
					</AnimatePresence>
				</button>
			</div>
		</motion.div>
	);
};
export default Sidebar;
