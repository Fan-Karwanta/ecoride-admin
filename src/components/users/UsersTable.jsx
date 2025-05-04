import { useState, useEffect } from "react";
import { 
  Search, 
  Filter, 
  UserCheck, 
  UserX, 
  Edit, 
  Trash2, 
  Eye, 
  CheckCircle, 
  XCircle,
  AlertCircle,
  Loader
} from "lucide-react";
import UserDetailsModal from "./UserDetailsModal";

const UsersTable = ({ 
  users = [], 
  onFilterChange, 
  onApprove, 
  onDisapprove, 
  onDelete,
  actionInProgress
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  // Apply filters when they change - with proper dependency array
  useEffect(() => {
    if (onFilterChange) {
      onFilterChange({
        search: searchTerm,
        role: roleFilter,
        status: statusFilter
      });
    }
  }, [searchTerm, roleFilter, statusFilter, onFilterChange]);

  // Handle search input
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle role filter change
  const handleRoleFilter = (e) => {
    setRoleFilter(e.target.value);
  };

  // Handle status filter change
  const handleStatusFilter = (e) => {
    setStatusFilter(e.target.value);
  };

  // Open user details modal
  const openUserDetails = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  // Close user details modal
  const closeUserDetails = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  // Handle user approval
  const handleApprove = (userId) => {
    console.log('Approving user:', userId);
    if (onApprove) {
      onApprove(userId);
    }
  };

  // Handle user disapproval
  const handleDisapprove = (userId) => {
    console.log('Disapproving user:', userId);
    if (onDisapprove) {
      // For quick table actions, use a default reason
      onDisapprove(userId, { reason: 'Disapproved by administrator via quick action' });
    }
  };

  // Handle user deletion
  const handleDelete = (userId) => {
    console.log('Delete action for user:', userId);
    if (confirmDelete === userId) {
      console.log('Confirming delete for user:', userId);
      if (onDelete) {
        onDelete(userId);
      }
      setConfirmDelete(null);
    } else {
      setConfirmDelete(userId);
      // Auto-reset after 3 seconds
      setTimeout(() => setConfirmDelete(null), 3000);
    }
  };

  // Check if an action is in progress for a user
  const isActionInProgress = (userId) => {
    return actionInProgress === userId;
  };

  return (
    <div className="bg-gray-900 rounded-lg shadow-md overflow-hidden border border-gray-700">
      {/* Filters */}
      <div className="p-4 border-b border-gray-700 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search users..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-600 rounded-md bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>

        <div className="flex gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter size={18} className="text-gray-400" />
            </div>
            <select
              className="block w-full pl-10 pr-10 py-2 border border-gray-600 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none"
              value={roleFilter}
              onChange={handleRoleFilter}
            >
              <option value="">All Roles</option>
              <option value="customer">Customers</option>
              <option value="rider">Riders</option>
            </select>
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter size={18} className="text-gray-400" />
            </div>
            <select
              className="block w-full pl-10 pr-10 py-2 border border-gray-600 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none"
              value={statusFilter}
              onChange={handleStatusFilter}
            >
              <option value="">All Status</option>
              <option value="approved">Approved</option>
              <option value="disapproved">Disapproved</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-800 sticky top-0 z-10">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-gray-900 divide-y divide-gray-700">
            {users.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                  <div className="flex flex-col items-center justify-center">
                    <AlertCircle size={32} className="mb-2" />
                    <p>No users found matching your filters</p>
                  </div>
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-800">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-medium text-lg">
                        {user.firstName?.charAt(0) || user.email?.charAt(0) || "U"}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-white">
                          {user.firstName} {user.lastName}
                        </div>
                        <div className="text-sm text-gray-400">
                          Joined {new Date(user.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-white">{user.email}</div>
                    <div className="text-sm text-gray-400">{user.phone || "No phone"}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.role === "rider" ? "bg-indigo-100 text-indigo-800" : "bg-purple-100 text-purple-800"
                    }`}>
                      {user.role === "rider" ? "Rider" : "Customer"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.status === "approved" ? "bg-green-100 text-green-800" : 
                      user.status === "disapproved" ? "bg-red-100 text-red-800" : 
                      "bg-yellow-100 text-yellow-800"
                    }`}>
                      {user.status === "approved" ? "Approved" : 
                       user.status === "disapproved" ? "Disapproved" : 
                       "Pending"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      {isActionInProgress(user._id) ? (
                        <div className="p-1">
                          <Loader size={18} className="animate-spin text-indigo-500" />
                        </div>
                      ) : (
                        <>
                          <button
                            onClick={() => openUserDetails(user)}
                            className="text-indigo-400 hover:text-indigo-300 p-2 hover:bg-indigo-900 rounded-full transition-colors cursor-pointer z-20"
                            title="View Details"
                            type="button"
                          >
                            <Eye size={18} />
                          </button>
                          {user.status === "approved" ? (
                            <button
                              onClick={() => handleDisapprove(user._id)}
                              className="text-yellow-400 hover:text-yellow-300 p-2 hover:bg-yellow-900 rounded-full transition-colors cursor-pointer z-20"
                              title="Disapprove User"
                              type="button"
                            >
                              <UserX size={18} />
                            </button>
                          ) : (
                            <>
                              <button
                                onClick={() => handleApprove(user._id)}
                                className="text-green-400 hover:text-green-300 p-2 hover:bg-green-900 rounded-full transition-colors cursor-pointer z-20"
                                title="Approve User"
                                type="button"
                              >
                                <UserCheck size={18} />
                              </button>
                              <button
                                onClick={() => handleDisapprove(user._id)}
                                className="text-yellow-400 hover:text-yellow-300 p-2 hover:bg-yellow-900 rounded-full transition-colors cursor-pointer z-20"
                                title="Disapprove User"
                                type="button"
                              >
                                <UserX size={18} />
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => handleDelete(user._id)}
                            className={`p-2 rounded-full transition-colors cursor-pointer z-20 ${
                              confirmDelete === user._id
                                ? "text-red-500 hover:text-red-400 hover:bg-red-900"
                                : "text-gray-400 hover:text-gray-300 hover:bg-gray-800"
                            }`}
                            title={confirmDelete === user._id ? "Click again to confirm" : "Delete User"}
                            type="button"
                          >
                            {confirmDelete === user._id ? (
                              <CheckCircle size={18} />
                            ) : (
                              <Trash2 size={18} />
                            )}
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* User details modal */}
      {isModalOpen && selectedUser && (
        <UserDetailsModal
          user={selectedUser}
          onClose={closeUserDetails}
          onUserUpdated={(updatedUser) => {
            // If updatedUser is provided, it means the user was updated
            if (updatedUser) {
              console.log('User updated from modal:', updatedUser);
              // Call the appropriate parent function based on approval status
              if (updatedUser.status === "approved") {
                onApprove(updatedUser._id);
              } else if (updatedUser.status === "disapproved") {
                onDisapprove(updatedUser._id);
              }
            }
          }}
        />
      )}
    </div>
  );
};

export default UsersTable;
