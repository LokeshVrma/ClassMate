import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import toast, { Toaster } from "react-hot-toast";
import axios from "../utils/axiosInstance";
import authMainImage from "../assets/images/auth-main-img.svg";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    studentID: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/dashboard");
    }
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    toast.dismiss();

    try {
      const res = await axios.post("/auth/register", formData);

      toast.success(res.data.message);
      navigate("/verify", {
        state: { userId: res.data.userId, email: formData.email },
      });
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Registration failed, try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
      <Toaster />
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg grid grid-cols-1 md:grid-cols-2 overflow-hidden">
        {/* Left Side Image */}
        <div className="hidden md:flex items-center justify-center bg-blue-100 p-6">
          <img src={authMainImage} alt="Register" className="w-3/4" />
        </div>

        {/* Form Section */}
        <div className="p-8 sm:p-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-blue-600 mb-4">
            Create Your ClassMate Account
          </h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="text-sm text-gray-700">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Priya Sharma"
                className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="text-sm text-gray-700">Student ID</label>
              <input
                type="text"
                name="studentID"
                value={formData.studentID}
                onChange={handleChange}
                placeholder="e.g., 23BCS1034"
                className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="text-sm text-gray-700">Email ID</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@college.ac.in"
                className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="text-sm text-gray-700">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-300 cursor-pointer"
            >
              {loading ? "Creating Account..." : "Register"}
            </button>

            <p className="text-sm text-center text-gray-600 mt-3">
              Already have an account?{" "}
              <a
                href="/login"
                className="text-blue-500 hover:underline font-medium"
              >
                Login
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
