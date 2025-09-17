import { useEffect } from "react";
import { useNavigate } from "react-router";
import AOS from "aos";
import {
  FaClipboardList,
  FaCalendarCheck,
  FaBookOpen,
  FaSmileBeam,
} from "react-icons/fa";

const LandingPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col text-center px-6 py-10">
      {/* Header */}
      <header className="w-full max-w-6xl mx-auto flex justify-between items-center mb-20">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-blue-700 tracking-tight">
          ClassMate
        </h1>
        <button
          onClick={() => navigate("/login")}
          className="border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-12 py-2 rounded-md text-sm font-medium transition cursor-pointer"
        >
          Login
        </button>
      </header>

      {/* Hero */}
      <section
        data-aos="fade-up"
        className="flex flex-col items-center gap-6 max-w-3xl mx-auto"
      >
        <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight">
          Organize, Plan & Excel in Your Studies
        </h2>
        <p className="text-gray-600 text-lg sm:text-xl max-w-xl">
          One place for assignments, study plans, notes, and discussions — built
          just for students who want to stay on top.
        </p>
        <button
          onClick={() => navigate("/register")}
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg sm:text-xl transition cursor-pointer"
        >
          Get Started for Free
        </button>
      </section>

      {/* How It Works */}
      <section className="mt-32 max-w-6xl mx-auto" data-aos="fade-up">
        <h3 className="text-4xl font-bold text-blue-800 mb-12">
          How It Works
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          <Step
            number="1"
            title="Create Your Account"
            desc="Sign up in seconds with your email and you're ready to start."
          />
          <Step
            number="2"
            title="Add Tasks & Plans"
            desc="Log your assignments, study targets, and class notes in seconds."
          />
          <Step
            number="3"
            title="Track & Succeed"
            desc="Visualize your schedule, stay organized, and never miss a thing."
          />
        </div>
      </section>

      {/* Features */}
      <section className="mt-32 max-w-6xl mx-auto" data-aos="fade-up">
        <h3 className="text-4xl font-bold text-blue-800 mb-12">
          Why Students Love ClassMate
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          <Feature
            icon={<FaClipboardList />}
            title="Plan Smarter"
            desc="Set clear goals and keep your semester organized from day one."
          />
          <Feature
            icon={<FaCalendarCheck />}
            title="Never Miss Deadlines"
            desc="Track every task and get nudges when things are due."
          />
          <Feature
            icon={<FaBookOpen />}
            title="Collaborate Easily"
            desc="Share notes with your peers or access public resources."
          />
          <Feature
            icon={<FaSmileBeam />}
            title="Declutter Your Mind"
            desc="No more juggling apps—just one calm, focused dashboard."
          />
        </div>
      </section>

      {/* FAQ */}
      <section className="mt-32 max-w-3xl mx-auto" data-aos="fade-up">
        <h4 className="text-3xl font-bold text-blue-800 mb-6">FAQs</h4>
        <div className="text-left space-y-8">
          <FAQItem
            q="Is ClassMate really free?"
            a="Yes. All essential features are free—no credit card needed."
          />
          <FAQItem
            q="Will it work on my phone?"
            a="Absolutely. ClassMate is mobile-optimized and installable like an app."
          />
          <FAQItem
            q="Do I need to install anything?"
            a="No setup required. Just log in through your browser and you're in."
          />
        </div>
      </section>

      {/* Final CTA */}
      <section className="mt-32 text-center" data-aos="zoom-in">
        <h3 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
          Built for learners who want to stay ahead.
        </h3>
        <button
          onClick={() => navigate("/register")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg sm:text-xl transition cursor-pointer"
        >
          Join ClassMate Now
        </button>
      </section>

      {/* Footer */}
      <footer className="mt-32 text-sm text-gray-500 text-center">
        © {new Date().getFullYear()} ClassMate. Made with ❤️ for students
      </footer>
    </main>
  );
};

// Subcomponents with bigger tiles

const Step = ({ number, title, desc }) => (
  <div className="bg-white p-8 sm:p-10 rounded-xl shadow-lg h-full flex flex-col justify-between hover:shadow-xl transition">
    <div className="text-blue-600 text-4xl font-bold mb-4">{number}</div>
    <h4 className="text-xl font-semibold text-gray-800 mb-3">{title}</h4>
    <p className="text-base text-gray-600 leading-relaxed">{desc}</p>
  </div>
);

const Feature = ({ icon, title, desc }) => (
  <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center gap-4 h-full hover:shadow-xl transition">
    <div className="text-4xl text-blue-600">{icon}</div>
    <h4 className="text-lg sm:text-xl font-semibold text-gray-800">{title}</h4>
    <p className="text-base text-gray-600">{desc}</p>
  </div>
);

const FAQItem = ({ q, a }) => (
  <div>
    <h5 className="font-semibold text-lg text-gray-800">{q}</h5>
    <p className="text-base text-gray-600 mt-1">{a}</p>
  </div>
);

export default LandingPage;
