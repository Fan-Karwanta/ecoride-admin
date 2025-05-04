import axios from 'axios';
import { API_BASE_URL } from '../config';

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('admin_access_token');
};

// Create axios instance with auth header
const createAuthenticatedRequest = () => {
  const token = getAuthToken();
  console.log('Using auth token:', token ? 'Token exists' : 'No token');
  return axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json'
    }
  });
};

export const userService = {
  // Get all users with optional filters
  getAllUsers: async (filters = {}) => {
    try {
      const request = createAuthenticatedRequest();
      
      // Build query params
      let queryParams = new URLSearchParams();
      if (filters.role) queryParams.append('role', filters.role);
      if (filters.approved !== undefined) queryParams.append('approved', filters.approved);
      if (filters.search) queryParams.append('search', filters.search);
      
      const queryString = queryParams.toString();
      const url = `/admin/users${queryString ? `?${queryString}` : ''}`;
      
      console.log('Fetching users with URL:', url);
      
      const response = await request.get(url);
      console.log('User data received:', response.data);
      
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error.response?.data || error.message);
      throw error;
    }
  },
  
  // Get user by ID
  getUserById: async (userId) => {
    try {
      const request = createAuthenticatedRequest();
      const response = await request.get(`/admin/users/${userId}`);
      return response.data.user;
    } catch (error) {
      console.error(`Error fetching user ${userId}:`, error.response?.data || error.message);
      throw error;
    }
  },
  
  // Approve user
  approveUser: async (userId) => {
    try {
      console.log(`Approving user with ID: ${userId}`);
      const request = createAuthenticatedRequest();
      const response = await request.put(`/admin/users/${userId}/approve`);
      console.log('Approve response:', response.data);
      return response.data.user;
    } catch (error) {
      console.error(`Error approving user ${userId}:`, error.response?.data || error.message);
      throw error;
    }
  },
  
  // Disapprove user
  disapproveUser: async (userId, data = {}) => {
    try {
      console.log(`Disapproving user with ID: ${userId}`, data);
      const request = createAuthenticatedRequest();
      const response = await request.put(`/admin/users/${userId}/disapprove`, data);
      console.log('Disapprove response:', response.data);
      return response.data.user;
    } catch (error) {
      console.error(`Error disapproving user ${userId}:`, error.response?.data || error.message);
      throw error;
    }
  },
  
  // Update user
  updateUser: async (userId, userData) => {
    try {
      const request = createAuthenticatedRequest();
      const response = await request.put(`/admin/users/${userId}`, userData);
      return response.data.user;
    } catch (error) {
      console.error(`Error updating user ${userId}:`, error.response?.data || error.message);
      throw error;
    }
  },
  
  // Delete user
  deleteUser: async (userId) => {
    try {
      console.log(`Deleting user with ID: ${userId}`);
      const request = createAuthenticatedRequest();
      const response = await request.delete(`/admin/users/${userId}`);
      console.log('Delete response:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Error deleting user ${userId}:`, error.response?.data || error.message);
      throw error;
    }
  }
};
