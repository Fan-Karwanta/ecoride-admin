import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, Loader } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const [email, setEmail] = useState("admin@ecoride.com");
  const [password, setPassword] = useState("admin123456");
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("Invalid credentials");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(false);
    
    try {
      console.log("Attempting login with:", email, password);
      
      // Use the login function from AuthContext
      const success = await login(email, password);
      console.log("Login successful:", success);
      
      // Redirect to dashboard
      navigate("/");
    } catch (err) {
      console.error("Login error details:", err);
      let message = "Login failed. Please try again.";
      
      if (err.response) {
        console.error("Error response:", err.response.data);
        message = err.response.data?.message || message;
      }
      
      setErrorMessage(message);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-gray-900">
      {/* Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-90" />
      {/* Removed backdrop blur */}

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="z-10 w-full max-w-md p-8 rounded-lg bg-gray-800 border border-gray-700 shadow-xl"
      >
        <div className="flex flex-col items-center justify-center mb-6">
          <img 
            src="/ecoride_logo.png" 
            alt="Ecoride Admin Panel" 
            className="h-28 w-auto mb-4"
          />
          <h2 className="text-2xl font-bold text-white">Admin Login</h2>
          <p className="text-gray-300 mt-2">
            Login to manage users and system settings
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white"
              placeholder="admin@ecoride.com"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white"
              placeholder="Enter your password"
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800 flex items-center justify-center"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader size={18} className="animate-spin mr-2" />
                Signing In...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* Error notification */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-4 p-3 bg-red-500 bg-opacity-20 border border-red-500 rounded-md flex items-center text-red-200"
            >
              <AlertCircle size={18} className="mr-2" />
              <span>{errorMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default LoginPage;
