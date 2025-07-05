import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router";
import { Toaster, toast } from "react-hot-toast";
import { useEffect, useState } from "react";
import axios from "../utils/axiosInstance";
import BottomNav from "../components/BottomNav";
import {
  FaClipboardList,
  FaBook,
  FaPenFancy,
  FaComments,
  FaSignOutAlt,
  FaUserCircle,
} from "react-icons/fa";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [counts, setCounts] = useState({
    assignments: 0,
    studyPlans: 0,
    sharedNotes: 0,
    forums: 0,
  });
  const [upcomingAssignment, setUpcomingAssignment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [
          profileRes,
          assignmentsRes,
          studyPlansRes,
          sharedNotesRes,
          forumsRes,
        ] = await Promise.all([
          axios.get("/users/profile"),
          axios.get("/assignments"),
          axios.get("/study-plans"),
          axios.get("/notes/shared"),
          axios.get("/forums"),
        ]);

        setProfile(profileRes.data);
        const assignments = assignmentsRes.data.allAssignments || [];
        const studyPlans = studyPlansRes.data.studyPlan || [];
        const sharedNotes = sharedNotesRes.data.sharedNotes || [];
        const forums = forumsRes.data.length || 0;

        setCounts({
          assignments: assignments.length,
          studyPlans: studyPlans.length,
          sharedNotes: sharedNotes.length,
          forums,
        });

        const next = assignments
          .filter((a) => a.status !== "completed")
          .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))[0];
        setUpcomingAssignment(next || null);
      } catch (err) {
        console.error(err);
        toast.error("Error loading dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully!");
    navigate("/login");
  };

  const features = [
    { title: "Study Plans", icon: <FaClipboardList />, link: "/study-plans" },
    { title: "Assignments", icon: <FaPenFancy />, link: "/assignments" },
    { title: "Notes", icon: <FaBook />, link: "/notes" },
    { title: "Forums", icon: <FaComments />, link: "/forums" },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 px-3 sm:px-6 py-4 pb-24">
      <Toaster />
      <div className="max-w-4xl mx-auto w-full">
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-3">
            {profile?.profileImage ? (
              <img
                src={profile.profileImage}
                alt="Profile"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/fallback-avatar.png";
                }}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <FaUserCircle className="w-12 h-12 text-gray-400" />
            )}
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-blue-800">
                Welcome, {profile?.name?.split(" ")[0] || user?.name} 
              </h1>
              <p className="text-xs sm:text-sm text-gray-600">
                Role: {profile?.role || user?.role}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm sm:text-base bg-red-500 text-white rounded-lg hover:bg-red-600 transition cursor-pointer"
            aria-label="Logout"
          >
            <FaSignOutAlt />
            Logout
          </button>
        </header>

        {loading ? (
          <>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4 mb-8">
              {[...Array(4)].map((_, i) => (
                <StatSkeleton key={i} />
              ))}
            </div>
            <AssignmentSkeleton />
          </>
        ) : (
          <>
            {/* Stats */}
            <section className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4 mb-8">
              <StatCard label="Assignments" value={counts.assignments} />
              <StatCard label="Study Plans" value={counts.studyPlans} />
              <StatCard label="Shared Notes" value={counts.sharedNotes} />
              <StatCard label="Forum Threads" value={counts.forums} />
            </section>

            {/* Upcoming Assignment */}
            <section className="bg-white p-4 sm:p-6 rounded-xl shadow mb-8">
              <h2 className="text-lg sm:text-xl font-bold text-blue-800 mb-3">
                📌 Upcoming Assignment
              </h2>
              {upcomingAssignment ? (
                <AssignmentCard assignment={upcomingAssignment} />
              ) : (
                <p className="text-gray-600">No upcoming assignments.</p>
              )}
            </section>

            {/* Feature Grid */}
            <section className="hidden sm:grid grid-cols-4 gap-4 ">
              {features.map((f) => (
                <div
                  key={f.title}
                  onClick={() => navigate(f.link)}
                  className="bg-white min-w-[120px] cursor-pointer rounded-xl shadow-md p-3 sm:p-5 flex flex-col items-center gap-2 hover:shadow-lg hover:scale-105 transition transform duration-200 ease-in-out"
                  aria-label={`Navigate to ${f.title}`}
                >
                  <div className="text-3xl sm:text-4xl text-blue-600">{f.icon}</div>
                  <p className="text-sm sm:text-base font-semibold text-gray-800">{f.title}</p>
                </div>
              ))}
            </section>
          </>
        )}
      </div>
      <BottomNav />
    </main>
  );
};

// Skeletons
const StatSkeleton = () => (
  <div className="p-4 rounded-lg shadow text-center bg-white animate-pulse">
    <div className="h-6 bg-gray-300 rounded w-12 mx-auto mb-2" />
    <div className="h-4 bg-gray-200 rounded w-20 mx-auto" />
  </div>
);

const AssignmentSkeleton = () => (
  <div className="border rounded-lg p-4 shadow animate-pulse mb-8">
    <div className="h-5 bg-gray-300 rounded w-1/2 mb-2" />
    <div className="h-4 bg-gray-200 rounded w-1/3" />
  </div>
);

const StatCard = ({ label, value }) => (
  <div className="p-4 rounded-lg shadow text-center bg-white">
    <p className="text-2xl font-bold text-gray-800">{value}</p>
    <p className="text-xs sm:text-sm text-gray-600 mt-1">{label}</p>
  </div>
);

const AssignmentCard = ({ assignment }) => (
  <div className="border rounded-lg p-4 shadow flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
    <div>
      <h3 className="text-base sm:text-lg font-semibold text-gray-800">{assignment.title}</h3>
      <p className="text-sm text-gray-600 mt-1">
        {assignment.subject || "No subject"}
      </p>
    </div>
    <p className="text-sm text-red-500 mt-1 sm:mt-3">
      Due: {new Date(assignment.dueDate).toLocaleDateString()}
    </p>
  </div>
);

export default Dashboard;
