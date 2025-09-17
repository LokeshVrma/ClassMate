import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import toast, { Toaster } from "react-hot-toast";
import axios from "../utils/axiosInstance";

const OtpVerifyPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { userId, email } = location.state || {};

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  if (!userId || !email) {
    return (
      <div className="flex flex-col justify-center items-center h-screen text-center px-4">
        <h2 className="text-xl font-semibold text-gray-800">
          Missing information!
        </h2>
        <p className="text-sm text-gray-600 mt-2">
          Please register again or go back to the login page.
        </p>
        <a
          href="/register"
          className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 cursor-pointer"
        >
          Go to Register
        </a>
      </div>
    );
  }

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    toast.dismiss();

    try {
      const res = await axios.post("/auth/verify", { userId, otp });

      toast.success(res.data.message);
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      toast.error(err.response?.data?.message || "OTP verification failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <Toaster />
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-blue-600 mb-4">
          Verify Your Email
        </h2>
        <p className="text-sm text-gray-600 mb-6">
          We've sent a 6-digit OTP to <span className="font-medium">{email}</span>.
          Please enter it below to activate your account.
        </p>

        <form onSubmit={handleVerify} className="space-y-4">
          <input
            type="text"
            name="otp"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
            className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
            maxLength={6}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition cursor-pointer"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default OtpVerifyPage;
