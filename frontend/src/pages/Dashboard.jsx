import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold">Hi, {user?.name}</h1>
      <p className="text-gray-600 mt-2">You're logged in as {user?.role}</p>
      <button
        onClick={handleLogout}
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition cursor-pointer"
      >
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
