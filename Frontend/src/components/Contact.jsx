import React, { useState } from "react";
import emailjs from "@emailjs/browser";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const sendEmail = async (e) => {
    e.preventDefault();
    setStatus("Sending...");

    try {
      await emailjs.send(
        "service_7vmbb0p",        // Service ID
        "template_nkwsjxh",       // Template ID
        {
          from_name: formData.name,
          from_email: formData.email,
          message: formData.message,
        },
        "JT1qSJhxRj5CZ2kg8"       // Public Key
      );

      setStatus("Message sent successfully!");
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      console.log("Email Error:", error);
      setStatus("Failed to send. Try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 py-16 px-6">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <h1 className="text-4xl font-bold text-center text-indigo-700 mb-4 drop-shadow-sm">
          Contact Us
        </h1>
        <p className="text-center text-slate-600 text-lg mb-12">
          We're here to help you with any questions, issues, or suggestions.
        </p>

        <div className="bg-white p-10 rounded-3xl shadow-xl border border-indigo-50">

          {/* Contact Information */}
          <h2 className="text-2xl font-semibold text-indigo-700 mb-4">
            Get in Touch
          </h2>

          <p className="text-slate-700 mb-5">
            If you have any queries regarding appointments, technical issues,
            or feedback about the Patient-Doctor Scheduler, feel free to contact us.
          </p>

          <div className="space-y-3 text-slate-800 text-lg leading-relaxed">
            <p>
              📧 <strong>Email:</strong>{" "}
              <a
                href="mailto:kkasanacoder@gmail.com"
                className="text-indigo-600 font-medium hover:underline"
              >
                kkasanacoder@gmail.com
              </a>
            </p>

            <p>
              📞 <strong>Phone:</strong>{" "}
              <span className="text-indigo-600 font-medium">
                +91-XXXXXXXXXX
              </span>
            </p>

            <p>
              🕒 <strong>Support Hours:</strong>
              Monday – Saturday, 10:00 AM to 6:00 PM
            </p>
          </div>

          {/* Contact Form */}
          <div className="mt-10">
            <h2 className="text-2xl font-semibold text-indigo-700 mb-4">
              Send Us a Message
            </h2>

            <form onSubmit={sendEmail} className="space-y-5">

              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                required
              />

              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                required
              />

              <textarea
                name="message"
                rows="5"
                placeholder="Your Message"
                value={formData.message}
                onChange={handleChange}
                className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                required
              ></textarea>

              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-3 rounded-xl text-lg font-semibold shadow-md hover:bg-indigo-700 transition transform hover:scale-[1.02]"
              >
                Send Message
              </button>
            </form>

            {status && (
              <p className="text-center mt-4 text-indigo-600 font-medium">
                {status}
              </p>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}

export default Contact;
