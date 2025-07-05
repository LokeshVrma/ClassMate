import { useState } from "react";
import { useNavigate } from "react-router";
import axios from "../utils/axiosInstance";
import toast, { Toaster } from "react-hot-toast";
import authMainImage from "../assets/images/auth-main-img.svg";

const ForgotPasswordPage = () => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ email: "", otp: "", password: "" });
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const sendOtp = async () => {
    setLoading(true);
    try {
      const res = await axios.post("/auth/forgot-password", { email: form.email });
      toast.success("OTP sent to your email");
      setUserId(res.data.userId);
      setStep(2);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    setLoading(true);
    try {
      await axios.post("/auth/verify-otp", { userId, otp: form.otp });
      toast.success("OTP verified");
      setStep(3);
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async () => {
    setLoading(true);
    try {
      await axios.post("/auth/reset-password", { userId, password: form.password });
      toast.success("Password reset successfully");
      setForm({ email: "", otp: "", password: "" });
      setUserId(null);
      setTimeout(() => navigate("/login"), 1500); 
    } catch (err) {
      toast.error(err.response?.data?.message || "Reset failed");
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
          <img src={authMainImage} alt="Forgot Password" className="w-3/4" />
        </div>

        {/* Right Side Form */}
        <div className="p-8 sm:p-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-blue-600 mb-6 text-center">
            {step === 1 && "Forgot Password"}
            {step === 2 && "Enter OTP"}
            {step === 3 && "Set New Password"}
          </h2>

          {step === 1 && (
            <>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@college.ac.in"
                className="w-full px-4 py-2 mb-4 border rounded-lg"
              />
              <button
                onClick={sendOtp}
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 cursor-pointer"
              >
                {loading ? "Sending OTP..." : "Send OTP"}
              </button>
              <p className="text-sm text-center text-gray-600 mt-4">
                Remembered your password?{" "}
                <span
                  onClick={() => navigate("/login")}
                  className="text-blue-500 hover:underline font-medium cursor-pointer"
                >
                  Go to Login
                </span>
              </p>
            </>
          )}

          {step === 2 && (
            <>
              <input
                type="text"
                name="otp"
                value={form.otp}
                onChange={handleChange}
                placeholder="Enter OTP"
                className="w-full px-4 py-2 mb-4 border rounded-lg"
              />
              <button
                onClick={verifyOtp}
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 cursor-pointer"
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
            </>
          )}

          {step === 3 && (
            <>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="New Password"
                className="w-full px-4 py-2 mb-4 border rounded-lg"
              />
              <button
                onClick={resetPassword}
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 cursor-pointer"
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
