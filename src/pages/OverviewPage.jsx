import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { UserCheck, UserPlus, UsersIcon, UserX, Car, MapPin, Loader, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { userService } from "../services/userService";

const StatCard = ({ name, icon: Icon, value, color }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm font-medium">{name}</p>
          <p className="text-2xl font-bold text-white mt-1">{value}</p>
        </div>
        <div
          className="p-3 rounded-full"
          style={{ backgroundColor: `${color}30`, color: color }}
        >
          <Icon size={24} />
        </div>
      </div>
    </motion.div>
  );
};

const OverviewPage = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDrivers: 0,
    totalPassengers: 0,
    approvedUsers: 0,
    unapprovedUsers: 0,
    loading: true,
    error: null
  });

  // Fetch statistics
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setStats(prev => ({ ...prev, loading: true, error: null }));
        
        // Fetch users for statistics
        const response = await userService.getAllUsers();
        console.log("Overview stats response:", response);
        const users = response.users || [];
        
        // Calculate statistics
        const totalUsers = users.length;
        const totalDrivers = users.filter(user => user.role === 'rider').length;
        const totalPassengers = users.filter(user => user.role === 'customer').length;
        const approvedUsers = users.filter(user => user.approved).length;
        const unapprovedUsers = totalUsers - approvedUsers;
        
        setStats({
          totalUsers,
          totalDrivers,
          totalPassengers,
          approvedUsers,
          unapprovedUsers,
          loading: false,
          error: null
        });
      } catch (error) {
        console.error("Error fetching statistics:", error);
        setStats(prev => ({ 
          ...prev, 
          loading: false, 
          error: "Failed to load statistics. Please try again later." 
        }));
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard Overview</h1>
        <p className="text-gray-400">
          Welcome to the EcoRide admin dashboard
        </p>
      </div>

      {stats.error && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-500 bg-opacity-20 border border-red-500 text-red-200 p-4 rounded-md mb-6 flex items-center"
        >
          <AlertCircle size={20} className="mr-2" />
          <span>{stats.error}</span>
        </motion.div>
      )}

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          name="Total Users"
          icon={UsersIcon}
          value={stats.loading ? <Loader size={24} className="animate-spin" /> : stats.totalUsers}
          color="#6366F1"
        />
        <StatCard 
          name="Total Drivers" 
          icon={Car} 
          value={stats.loading ? <Loader size={24} className="animate-spin" /> : stats.totalDrivers} 
          color="#10B981" 
        />
        <StatCard
          name="Total Passengers"
          icon={MapPin}
          value={stats.loading ? <Loader size={24} className="animate-spin" /> : stats.totalPassengers}
          color="#F59E0B"
        />
        <StatCard 
          name="Pending Approvals" 
          icon={UserX} 
          value={stats.loading ? <Loader size={24} className="animate-spin" /> : stats.unapprovedUsers} 
          color="#EF4444" 
        />
      </div>

      {/* WELCOME CARD */}
      <motion.div
        className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold text-white mb-4">Welcome to EcoRide Admin Dashboard</h2>
        <p className="text-gray-300 mb-4">
          This dashboard allows you to manage users, view statistics, and monitor the EcoRide platform.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-700 bg-opacity-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-2">Quick Actions</h3>
            <ul className="space-y-2 text-gray-300">
              <li>• <Link to="/users" className="text-blue-400 hover:underline">Manage Users</Link></li>
              <li>• <Link to="/settings" className="text-blue-400 hover:underline">System Settings</Link></li>
            </ul>
          </div>
          <div className="bg-gray-700 bg-opacity-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-2">User Management</h3>
            <p className="text-gray-300">
              You can approve new user registrations, manage existing users, and monitor user activity from the <Link to="/users" className="text-blue-400 hover:underline">Users</Link> page.
            </p>
          </div>
        </div>
      </motion.div>

      {/* SYSTEM STATUS */}
      <motion.div
        className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <h2 className="text-xl font-semibold text-white mb-4">System Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-900 bg-opacity-30 border border-green-700 p-4 rounded-lg">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <h3 className="text-green-400 font-medium">Database</h3>
            </div>
            <p className="text-gray-300 mt-2">MongoDB connection is active and healthy.</p>
          </div>
          <div className="bg-green-900 bg-opacity-30 border border-green-700 p-4 rounded-lg">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <h3 className="text-green-400 font-medium">API Server</h3>
            </div>
            <p className="text-gray-300 mt-2">Server is running and responding to requests.</p>
          </div>
          <div className="bg-green-900 bg-opacity-30 border border-green-700 p-4 rounded-lg">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <h3 className="text-green-400 font-medium">Authentication</h3>
            </div>
            <p className="text-gray-300 mt-2">Authentication services are functioning properly.</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default OverviewPage;
