import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between px-8 md:px-20 py-16 bg-blue-900 text-white shadow-lg">
        <div className="max-w-xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            Smart Patient-Doctor Scheduling System 🩺
          </h1>
          <p className="text-blue-100 text-lg mb-6">
            Book, manage, and track your medical appointments effortlessly. 
            Connect with doctors, get reminders, analyze reports, and more — all in one place.
          </p>
          <div className="flex gap-4">
            <Link
              to="/login"
              className="bg-white text-blue-900 px-6 py-2 rounded-lg font-semibold hover:bg-blue-100 transition-all"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="border border-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-800 transition-all"
            >
              Get Started
            </Link>
          </div>
        </div>

      <div className="mt-10 md:mt-0 md:w-1/2 flex justify-center">
        <img
          src="https://i.pinimg.com/1200x/06/30/7f/06307f331b441e89596ff7e5f783a847.jpg"
          alt="Doctor appointment"
          className="w-80 h-80 md:w-96 md:h-96 object-cover rounded-full shadow-2xl border-1"
        />
      </div>

      </section>

      {/* About Section */}
      <section className="py-16 px-6 md:px-20 text-center">
        <h2 className="text-3xl font-bold text-blue-900 mb-4">
          What is MediConnect?
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-10">
          MediConnect is a next-gen healthcare management platform that allows patients and doctors 
          to collaborate seamlessly. From appointment booking to real-time analytics and reminders — 
          we simplify every step of the healthcare experience.
        </p>

        <div className="grid md:grid-cols-3 gap-8 mt-8">
          {/* Feature 1 */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition">
            <img
              src="https://cdn-icons-png.flaticon.com/512/1029/1029183.png"
              alt="Booking"
              className="w-16 mx-auto mb-4"
            />
            <h3 className="text-xl font-semibold text-blue-800 mb-2">Smart Booking</h3>
            <p className="text-gray-600">
              Book appointments with just a few clicks. Select doctors, choose services, 
              and get instant confirmations.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition">
            <img
              src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              alt="Analytics"
              className="w-16 mx-auto mb-4"
            />
            <h3 className="text-xl font-semibold text-blue-800 mb-2">Advanced Analytics</h3>
            <p className="text-gray-600">
              Track appointment statistics, cancellations, revenues, and performance insights 
              through an interactive dashboard.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition">
            <img
              src="https://cdn-icons-png.flaticon.com/512/942/942748.png"
              alt="Feedback"
              className="w-16 mx-auto mb-4"
            />
            <h3 className="text-xl font-semibold text-blue-800 mb-2">Feedback System</h3>
            <p className="text-gray-600">
              Patients can rate and review doctors to ensure transparency and maintain 
              quality healthcare standards.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-blue-100 py-16 text-center">
        <h2 className="text-3xl font-bold text-blue-900 mb-4">Our Key Features</h2>
        <div className="flex flex-wrap justify-center gap-6 mt-8">
          {[
            "Google Calendar Sync",
            "Automated Reminders",
            "Secure Login & Roles",
            "Doctor Performance Analytics",
            "Patient Feedback & Ratings",
            "Real-time Appointment Tracking",
          ].map((feature, i) => (
            <div
              key={i}
              className="bg-white rounded-lg shadow-md px-6 py-4 w-64 hover:shadow-xl transition-all"
            >
              <p className="font-medium text-blue-800">{feature}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center py-20 bg-gradient-to-r from-blue-800 to-blue-600 text-white">
        <h2 className="text-3xl font-bold mb-4">
          Ready to take control of your health?
        </h2>
        <p className="text-blue-100 mb-6">
          Join thousands of patients and doctors simplifying healthcare management.
        </p>
        <Link
          to="/register"
          className="bg-white text-blue-800 px-8 py-3 rounded-lg font-semibold hover:bg-blue-100 transition"
        >
          Get Started Now
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-blue-900 text-white text-center py-6 mt-auto">
        <p className="text-sm">
          © {new Date().getFullYear()} MediConnect — Patient-Doctor Scheduling System
        </p>
        <p className="text-xs text-blue-200 mt-1">
          Designed with ❤ for smarter healthcare
        </p>
      </footer>
    </div>
  );
}
