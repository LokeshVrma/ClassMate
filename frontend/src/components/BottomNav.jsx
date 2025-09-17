import { useNavigate, useLocation } from "react-router";
import { useAuth } from "../context/AuthContext";
import {
  FaHome,
  FaClipboardList,
  FaPenFancy,
  FaBook,
  FaComments,
  FaSignOutAlt,
} from "react-icons/fa";
import { toast } from "react-hot-toast";

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const tabs = [
    { path: "/dashboard", icon: <FaHome />, label: "Home" },
    { path: "/study-plans", icon: <FaClipboardList />, label: "Plans" },
    { path: "/assignments", icon: <FaPenFancy />, label: "Tasks" },
    { path: "/notes", icon: <FaBook />, label: "Notes" },
    { path: "/forums", icon: <FaComments />, label: "Forums" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-md border-t border-gray-200 z-50 sm:hidden flex justify-around py-2">
      {tabs.map((tab) =>
        tab.path ? (
          <button
            key={tab.path}
            onClick={() => navigate(tab.path)}
            className={`flex flex-col items-center text-xs ${
              location.pathname === tab.path
                ? "text-blue-600 font-semibold"
                : "text-gray-500"
            }`}
          >
            <div className="text-lg">{tab.icon}</div>
            {tab.label}
          </button>
        ) : (
          <button
            key={tab.label}
            onClick={tab.action}
            className="flex flex-col items-center text-xs text-gray-500"
          >
            <div className="text-lg">{tab.icon}</div>
            {tab.label}
          </button>
        )
      )}
    </nav>
  );
};

export default BottomNav;
