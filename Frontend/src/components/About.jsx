import React from "react";

function About() {
  return (
    <div className="min-h-screen bg-gray-50 py-16 px-6">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <h1 className="text-4xl font-bold text-center text-indigo-700 mb-6">
          About Patient-Doctor Scheduler (PDS)
        </h1>
        <p className="text-center text-gray-600 text-lg mb-12">
          A smart healthcare platform designed to simplify appointment booking, improve communication,
          and enhance patient-doctor interaction.
        </p>

        {/* Mission Section */}
        <div className="bg-white p-8 rounded-2xl shadow-md mb-12">
          <h2 className="text-2xl font-semibold text-indigo-700 mb-4">
            Our Mission
          </h2>
          <p className="text-gray-700 leading-relaxed">
            We aim to reduce the hassle of traditional appointment processes by providing a modern,
            easy-to-use digital system where:
            <br /><br />
            • Patients can book appointments, track visit history, and communicate with doctors.
            <br />
            • Doctors can manage schedules, view upcoming appointments, and analyze patient data.
            <br />
            • Both sides experience seamless and transparent healthcare interaction.
          </p>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">

          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-xl font-semibold text-indigo-700 mb-3">📅 Easy Appointment Booking</h3>
            <p className="text-gray-600">
              Patients can book appointments quickly using a simplified, user-friendly interface.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-xl font-semibold text-indigo-700 mb-3">👨‍⚕️ Doctor Dashboard</h3>
            <p className="text-gray-600">
              Doctors get a personalized dashboard to track all upcoming consultations.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-xl font-semibold text-indigo-700 mb-3">📊 Analytics & Insights</h3>
            <p className="text-gray-600">
              View appointment charts, patient patterns, and performance indicators.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-xl font-semibold text-indigo-700 mb-3">🔒 Secure System</h3>
            <p className="text-gray-600">
              Data security is our priority. We use encryption, secure APIs, and role-based access.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-xl font-semibold text-indigo-700 mb-3">📱 Mobile Friendly</h3>
            <p className="text-gray-600">
              The platform works across all devices — mobile, tablet, or desktop.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-xl font-semibold text-indigo-700 mb-3">⭐ Feedback System</h3>
            <p className="text-gray-600">
              Patients can share experiences and help improve the healthcare service.
            </p>
          </div>
        </div>

        {/* Vision Section */}
        <div className="bg-white p-8 rounded-2xl shadow-md">
          <h2 className="text-2xl font-semibold text-indigo-700 mb-4">
            Our Vision
          </h2>
          <p className="text-gray-700 leading-relaxed">
            PDS is not just an appointment software — it is a step toward smarter,
            connected, and efficient healthcare.
            <br /><br />
            We envision a platform where time is saved, confusion is eliminated, and
            both patients and doctors experience a smooth, modern healthcare ecosystem.
          </p>
        </div>

      </div>
    </div>
  );
}

export default About;
