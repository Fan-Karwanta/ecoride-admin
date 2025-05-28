import { useState, useEffect } from 'react';
import { X, CheckCircle, XCircle, Trash2, Edit3 } from 'lucide-react';
import { motion } from 'framer-motion';
import { userService } from '../../services/userService';
import { useTheme } from '../../context/ThemeContext';

const UserDetailsModal = ({ user, onClose, onUserUpdated }) => {
  const { isDarkMode } = useTheme();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [showDisapproveReason, setShowDisapproveReason] = useState(false);
  const [disapproveReason, setDisapproveReason] = useState('');
  const [userData, setUserData] = useState({
    firstName: user?.firstName || '',
    middleName: user?.middleName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    role: user?.role || '',
    sex: user?.sex || '',
    schoolId: user?.schoolId || '',
    licenseId: user?.licenseId || '',
  });

  // Handle approve user
  const handleApprove = async () => {
    try {
      setLoading(true);
      setError(null);
      const updatedUser = await userService.approveUser(user._id);
      console.log('User approved successfully:', updatedUser);
      onUserUpdated(updatedUser);
      onClose();
    } catch (err) {
      console.error('Error in handleApprove:', err);
      setError('Failed to approve user. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Show disapprove reason form
  const showDisapproveForm = () => {
    setShowDisapproveReason(true);
  };

  // Handle disapprove user
  const handleDisapprove = async () => {
    if (!disapproveReason.trim()) {
      setError('Please provide a reason for disapproval');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const updatedUser = await userService.disapproveUser(user._id, { reason: disapproveReason });
      console.log('User disapproved successfully:', updatedUser);
      onUserUpdated(updatedUser);
      onClose();
    } catch (err) {
      console.error('Error in handleDisapprove:', err);
      setError('Failed to disapprove user. Please try again.');
    } finally {
      setLoading(false);
      setShowDisapproveReason(false);
    }
  };

  // Cancel disapprove
  const cancelDisapprove = () => {
    setShowDisapproveReason(false);
    setDisapproveReason('');
    setError(null);
  };

  // Handle delete user
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        setLoading(true);
        setError(null);
        await userService.deleteUser(user._id);
        onUserUpdated();
        onClose();
      } catch (err) {
        setError('Failed to delete user. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  // Handle update user
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      await userService.updateUser(user._id, userData);
      setEditMode(false);
      onUserUpdated();
    } catch (err) {
      setError('Failed to update user. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
      <motion.div 
        className={`rounded-xl p-6 max-w-2xl w-full mx-4 border shadow-xl ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} transition-colors duration-300`}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'} transition-colors duration-300`}>
            {editMode ? 'Edit User' : showDisapproveReason ? 'Disapprove User' : 'User Details'}
          </h2>
          <button 
            onClick={onClose}
            className={`${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-800'} transition-colors`}
          >
            <X size={24} />
          </button>
        </div>

        {error && (
          <div className={`p-3 rounded-lg mb-4 ${isDarkMode ? 'bg-red-900 text-red-100' : 'bg-red-100 text-red-800'} transition-colors duration-300`}>
            {error}
          </div>
        )}

        {showDisapproveReason ? (
          <div className="mb-6">
            <p className={`mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} transition-colors duration-300`}>
              Please provide a reason for disapproving this user. This information will be used for administrative purposes.
            </p>
            <div className="mb-4">
              <label className={`block mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} transition-colors duration-300`}>Reason for Disapproval</label>
              <textarea
                value={disapproveReason}
                onChange={(e) => setDisapproveReason(e.target.value)}
                className={`w-full rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px] ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-50 text-gray-900 border border-gray-300'} transition-colors duration-300`}
                placeholder="Enter detailed reason for disapproval..."
              />
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={cancelDisapprove}
                className={`px-4 py-2 rounded-lg transition-colors ${isDarkMode ? 'bg-gray-600 text-white hover:bg-gray-500' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleDisapprove}
                className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-500 transition-colors flex items-center"
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Confirm Disapproval'}
              </button>
            </div>
          </div>
        ) : editMode ? (
          <form onSubmit={handleUpdate}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className={`block mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} transition-colors duration-300`}>First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={userData.firstName}
                  onChange={handleChange}
                  className={`w-full rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-50 text-gray-900 border border-gray-300'} transition-colors duration-300`}
                />
              </div>
              <div>
                <label className={`block mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} transition-colors duration-300`}>Middle Name</label>
                <input
                  type="text"
                  name="middleName"
                  value={userData.middleName}
                  onChange={handleChange}
                  className={`w-full rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-50 text-gray-900 border border-gray-300'} transition-colors duration-300`}
                />
              </div>
              <div>
                <label className={`block mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} transition-colors duration-300`}>Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={userData.lastName}
                  onChange={handleChange}
                  className={`w-full rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-50 text-gray-900 border border-gray-300'} transition-colors duration-300`}
                />
              </div>
              <div>
                <label className={`block mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} transition-colors duration-300`}>Email</label>
                <input
                  type="email"
                  name="email"
                  value={userData.email}
                  onChange={handleChange}
                  className={`w-full rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-50 text-gray-900 border border-gray-300'} transition-colors duration-300`}
                />
              </div>
              <div>
                <label className={`block mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} transition-colors duration-300`}>Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={userData.phone}
                  onChange={handleChange}
                  className={`w-full rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-50 text-gray-900 border border-gray-300'} transition-colors duration-300`}
                />
              </div>
              <div>
                <label className={`block mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} transition-colors duration-300`}>Sex</label>
                <select
                  name="sex"
                  value={userData.sex}
                  onChange={handleChange}
                  className={`w-full rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-50 text-gray-900 border border-gray-300'} transition-colors duration-300`}
                >
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              {userData.role === 'customer' && (
                <div>
                  <label className="block text-gray-400 mb-1">School ID</label>
                  <input
                    type="text"
                    name="schoolId"
                    value={userData.schoolId}
                    onChange={handleChange}
                    className="w-full bg-gray-700 text-white rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}
              {userData.role === 'rider' && (
                <div>
                  <label className="block text-gray-400 mb-1">License ID</label>
                  <input
                    type="text"
                    name="licenseId"
                    value={userData.licenseId}
                    onChange={handleChange}
                    className="w-full bg-gray-700 text-white rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={() => setEditMode(false)}
                className={`px-4 py-2 rounded-lg transition-colors ${isDarkMode ? 'bg-gray-600 text-white hover:bg-gray-500' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors flex items-center"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        ) : (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="space-y-3">
                <div>
                  <h3 className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-300`}>Full Name</h3>
                  <p className={`${isDarkMode ? 'text-white' : 'text-gray-800'} transition-colors duration-300`}>
                    {user.firstName} {user.middleName && `${user.middleName} `}{user.lastName}
                  </p>
                </div>
                <div>
                  <h3 className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-300`}>Email</h3>
                  <p className={`${isDarkMode ? 'text-white' : 'text-gray-800'} transition-colors duration-300`}>{user.email}</p>
                </div>
                <div>
                  <h3 className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-300`}>Phone</h3>
                  <p className={`${isDarkMode ? 'text-white' : 'text-gray-800'} transition-colors duration-300`}>{user.phone || 'Not provided'}</p>
                </div>
                <div>
                  <h3 className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-300`}>Role</h3>
                  <p className={`capitalize ${isDarkMode ? 'text-white' : 'text-gray-800'} transition-colors duration-300`}>{user.role || 'N/A'}</p>
                </div>
                <div>
                  <h3 className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-300`}>Sex</h3>
                  <p className={`capitalize ${isDarkMode ? 'text-white' : 'text-gray-800'} transition-colors duration-300`}>{user.sex || 'Not specified'}</p>
                </div>
                <div>
                  <h3 className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-300`}>Status</h3>
                  <p className={`${isDarkMode ? 'text-white' : 'text-gray-800'} transition-colors duration-300`}>
                    {user.status === "approved" ? "Approved" : 
                     user.status === "disapproved" ? "Disapproved" : 
                     "Pending"}
                  </p>
                </div>
                {user.role === 'rider' && (
                  <div className={`mt-4 border-t pt-4 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} transition-colors duration-300`}>
                    <h3 className={`text-lg font-medium mb-3 ${isDarkMode ? 'text-white' : 'text-gray-800'} transition-colors duration-300`}>Rider Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-300`}>License ID</h3>
                        <p className={`${isDarkMode ? 'text-white' : 'text-gray-800'} transition-colors duration-300`}>{user.licenseId || 'Not provided'}</p>
                      </div>
                    </div>
                  </div>
                )}
                <div>
                  <h3 className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-300`}>Registered On</h3>
                  <p className={`${isDarkMode ? 'text-white' : 'text-gray-800'} transition-colors duration-300`}>
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setEditMode(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors flex items-center"
              >
                <Edit3 size={16} className="mr-1" />
                Edit
              </button>
              {!user.approved && !user.disapproved && (
                <button
                  onClick={handleApprove}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500 transition-colors flex items-center"
                  disabled={loading}
                >
                  <CheckCircle size={16} className="mr-1" />
                  Approve
                </button>
              )}
              {!user.disapproved && (
                <button
                  onClick={showDisapproveForm}
                  className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-500 transition-colors flex items-center"
                  disabled={loading}
                >
                  <XCircle size={16} className="mr-1" />
                  Disapprove
                </button>
              )}
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 transition-colors flex items-center"
                disabled={loading}
              >
                <Trash2 size={16} className="mr-1" />
                Delete
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default UserDetailsModal;
