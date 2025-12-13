import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between px-8 md:px-20 py-16 bg-blue-900 text-white shadow-lg overflow-hidden">

        {/* LEFT CONTENT */}
        <motion.div
          initial={{ opacity: 0, x: -80 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="max-w-xl"
        >
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold mb-4 leading-tight"
          >
            Smart <span className="text-yellow-300">Patient-Doctor</span>{" "}
            Scheduling System 🩺
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-blue-100 text-lg mb-6"
          >
            Book, manage, and track your medical appointments effortlessly.
            Connect with doctors, get reminders, analyze reports, and more — all in one place.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="flex gap-4"
          >
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
          </motion.div>
        </motion.div>

        {/* RIGHT IMAGE */}
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="mt-10 md:mt-0 md:w-1/2 flex justify-center"
        >
          <motion.img
            src="https://i.pinimg.com/1200x/06/30/7f/06307f331b441e89596ff7e5f783a847.jpg"
            alt="Doctor appointment"
            className="w-80 h-80 md:w-96 md:h-96 object-cover rounded-full shadow-2xl border-1"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 200 }}
          />
        </motion.div>

      </section>


      {/* About Section */}
      <section className="py-16 px-6 md:px-20 text-center bg-gradient-to-b from-white to-blue-50">

        {/* NEW HEADING */}
        <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-3">
          Consult <span className="text-indigo-600">Top Doctors</span> Online
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-12">
          Get expert medical advice anytime, anywhere. Connect with experienced doctors
          for any health concern through MediConnect.
        </p>

        {/* DOCTOR CARDS */}
        <div className="grid gap-8 md:grid-cols-3 mt-10">

          {/* Doctor 1 */}
          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition">
            <img
              src="https://randomuser.me/api/portraits/men/32.jpg"
              alt="Doctor"
              className="w-28 h-28 mx-auto rounded-full object-cover shadow-md mb-4"
            />
            <h3 className="text-xl font-semibold text-blue-800">Dr. Arjun Khanna</h3>
            <p className="text-sm text-gray-500 mb-2">Neurologist • 12+ Years</p>
            <p className="text-gray-600 text-sm">
              Specialized in neurological disorders, Parkinson’s disease, and brain health.
            </p>
          </div>

          {/* Doctor 2 */}
          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition">
            <img
              src="https://randomuser.me/api/portraits/women/44.jpg"
              alt="Doctor"
              className="w-28 h-28 mx-auto rounded-full object-cover shadow-md mb-4"
            />
            <h3 className="text-xl font-semibold text-blue-800">Dr. Neha Sharma</h3>
            <p className="text-sm text-gray-500 mb-2">Cardiologist • 10+ Years</p>
            <p className="text-gray-600 text-sm">
              Expert in heart health, hypertension management, and preventive cardiology.
            </p>
          </div>

          {/* Doctor 3 */}
          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition">
            <img
              src="https://randomuser.me/api/portraits/men/65.jpg"
              alt="Doctor"
              className="w-28 h-28 mx-auto rounded-full object-cover shadow-md mb-4"
            />
            <h3 className="text-xl font-semibold text-blue-800">Dr. Rohit Verma</h3>
            <p className="text-sm text-gray-500 mb-2">General Physician • 8+ Years</p>
            <p className="text-gray-600 text-sm">
              Trusted family doctor for routine checkups, infections, and general health.
            </p>
          </div>

        </div>
      </section>



      <section className="py-20 bg-gradient-to-b from-white to-blue-50">
        <div className="text-center px-6 md:px-20">

          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            Why <span className="text-blue-700">50,000+</span>{" "}
            <span className="text-indigo-600">Customers Trust Us</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
            className="text-gray-600 max-w-2xl mx-auto mb-12"
          >
            Experience the future of healthcare scheduling with our secure,
            digital-first, and patient-focused platform.
          </motion.p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">

            {/* Card 1 */}
            <motion.div
              whileInView={{ scale: [0.8, 1] }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition"
            >
              <h3 className="text-4xl font-bold text-blue-700">5K+</h3>
              <p className="text-gray-600 mt-2">Active Doctors</p>
            </motion.div>

            {/* Card 2 */}
            <motion.div
              whileInView={{ scale: [0.8, 1] }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition"
            >
              <h3 className="text-4xl font-bold text-indigo-600">50K+</h3>
              <p className="text-gray-600 mt-2">Happy Patients</p>
            </motion.div>

            {/* Card 3 */}
            <motion.div
              whileInView={{ scale: [0.8, 1] }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition"
            >
              <h3 className="text-4xl font-bold text-green-600">100%</h3>
              <p className="text-gray-600 mt-2">Secure Platform</p>
            </motion.div>

            {/* Card 4 */}
            <motion.div
              whileInView={{ scale: [0.8, 1] }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition"
            >
              <h3 className="text-4xl font-bold text-purple-600">24/7</h3>
              <p className="text-gray-600 mt-2">Digital First Access</p>
            </motion.div>

          </div>
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
