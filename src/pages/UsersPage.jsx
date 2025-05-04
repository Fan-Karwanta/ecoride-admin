import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, UserCheck, UserX, Loader } from "lucide-react";
import UsersTable from "../components/users/UsersTable";
import { userService } from "../services/userService";

// Stat card component
const StatCard = ({ title, value, icon, color }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-6 rounded-lg shadow-lg ${color} text-white`}
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium opacity-90">{title}</h3>
          <p className="text-3xl font-bold mt-2">{value}</p>
        </div>
        <div className={`p-3 rounded-full bg-white bg-opacity-20`}>
          {icon}
        </div>
      </div>
    </motion.div>
  );
};

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    pending: 0,
    disapproved: 0,
    customers: 0,
    riders: 0
  });
  const [actionInProgress, setActionInProgress] = useState(null);

  // Fetch users from API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const data = await userService.getAllUsers();
        console.log("Fetched users:", data);
        
        setUsers(data.users);
        setFilteredUsers(data.users);
        
        // Calculate stats using the helper function
        updateStats(data.users);
        
        setError(null);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Failed to load users. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, []);

  // Handle user actions (approve, disapprove, delete)
  const handleUserAction = async (action, userId, data = {}) => {
    try {
      console.log(`Performing ${action} action on user ${userId}`, data);
      setActionInProgress(userId); // Track which user is being modified
      
      let updatedUser;
      
      switch (action) {
        case 'approve':
          console.log('Calling userService.approveUser');
          updatedUser = await userService.approveUser(userId);
          console.log('User approved:', updatedUser);
          break;
        case 'disapprove':
          console.log('Calling userService.disapproveUser');
          // If no reason is provided, use a default reason
          const disapproveData = data.reason ? data : { reason: 'Disapproved by administrator' };
          updatedUser = await userService.disapproveUser(userId, disapproveData);
          console.log('User disapproved:', updatedUser);
          break;
        case 'delete':
          console.log('Calling userService.deleteUser');
          await userService.deleteUser(userId);
          console.log('User deleted');
          // Remove user from state
          setUsers(prevUsers => {
            const updatedUsers = prevUsers.filter(user => user._id !== userId);
            // Recalculate stats based on updated users
            updateStats(updatedUsers);
            return updatedUsers;
          });
          setFilteredUsers(prevUsers => prevUsers.filter(user => user._id !== userId));
          setActionInProgress(null);
          return;
        default:
          setActionInProgress(null);
          return;
      }
      
      // Update user in state
      setUsers(prevUsers => {
        const updatedUsers = prevUsers.map(user => 
          user._id === userId ? updatedUser : user
        );
        // Recalculate stats based on updated users
        updateStats(updatedUsers);
        return updatedUsers;
      });
      
      setFilteredUsers(prevUsers => 
        prevUsers.map(user => 
          user._id === userId ? updatedUser : user
        )
      );
      
    } catch (err) {
      console.error(`Error performing ${action} action:`, err);
      setError(`Failed to ${action} user. Please try again.`);
    } finally {
      setActionInProgress(null);
    }
  };

  // Helper function to update stats based on current users
  const updateStats = (currentUsers) => {
    const total = currentUsers.length;
    const approved = currentUsers.filter(user => user.status === "approved").length;
    const pending = currentUsers.filter(user => user.status === "pending").length;
    const disapproved = currentUsers.filter(user => user.status === "disapproved").length;
    const customers = currentUsers.filter(user => user.role === 'customer').length;
    const riders = currentUsers.filter(user => user.role === 'rider').length;
    
    setStats({
      total,
      approved,
      pending,
      disapproved,
      customers,
      riders
    });
  };

  // Filter users
  const handleFilterChange = (filters) => {
    let result = [...users];
    
    // Filter by role
    if (filters.role) {
      result = result.filter(user => user.role === filters.role);
    }
    
    // Filter by status
    if (filters.status === 'approved') {
      result = result.filter(user => user.status === "approved");
    } else if (filters.status === 'pending') {
      result = result.filter(user => user.status === "pending");
    } else if (filters.status === 'disapproved') {
      result = result.filter(user => user.status === "disapproved");
    }
    
    // Filter by search term
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      result = result.filter(user => 
        user.firstName?.toLowerCase().includes(searchTerm) ||
        user.lastName?.toLowerCase().includes(searchTerm) ||
        user.email?.toLowerCase().includes(searchTerm) ||
        user.phone?.toLowerCase().includes(searchTerm)
      );
    }
    
    setFilteredUsers(result);
  };

  return (
    <div className="container mx-auto px-4 py-8 relative z-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">User Management</h1>
        <p className="text-gray-400">
          View and manage all users in the system
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
        <StatCard
          title="Total Users"
          value={loading ? <Loader size={24} className="animate-spin" /> : stats.total}
          icon={<Users size={24} />}
          color="bg-blue-600"
        />
        <StatCard
          title="Approved Users"
          value={loading ? <Loader size={24} className="animate-spin" /> : stats.approved}
          icon={<UserCheck size={24} />}
          color="bg-green-600"
        />
        <StatCard
          title="Pending Approval"
          value={loading ? <Loader size={24} className="animate-spin" /> : stats.pending}
          icon={<UserX size={24} />}
          color="bg-amber-600"
        />
        <StatCard
          title="Disapproved Users"
          value={loading ? <Loader size={24} className="animate-spin" /> : stats.disapproved}
          icon={<UserX size={24} />}
          color="bg-red-600"
        />
        <StatCard
          title="Customers"
          value={loading ? <Loader size={24} className="animate-spin" /> : stats.customers}
          icon={<Users size={24} />}
          color="bg-purple-600"
        />
        <StatCard
          title="Riders"
          value={loading ? <Loader size={24} className="animate-spin" /> : stats.riders}
          icon={<Users size={24} />}
          color="bg-indigo-600"
        />
      </div>

      {/* Users table */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader size={32} className="animate-spin text-indigo-500" />
          <span className="ml-2 text-gray-400">Loading users...</span>
        </div>
      ) : error ? (
        <div className="bg-red-500 bg-opacity-20 border border-red-500 text-red-200 p-4 rounded-md">
          {error}
        </div>
      ) : (
        <div className="relative z-10">
          <UsersTable 
            users={filteredUsers} 
            onFilterChange={handleFilterChange}
            onApprove={(id) => handleUserAction('approve', id)}
            onDisapprove={(id) => handleUserAction('disapprove', id)}
            onDelete={(id) => handleUserAction('delete', id)}
            actionInProgress={actionInProgress}
          />
        </div>
      )}
    </div>
  );
};

export default UsersPage;
