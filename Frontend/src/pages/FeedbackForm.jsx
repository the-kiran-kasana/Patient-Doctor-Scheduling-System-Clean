import { useEffect, useState } from "react";
import axios from "axios";
import { Star } from "lucide-react";

export default function FeedbackForm() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState("");
  const [message, setMessage] = useState("");
  const [hover, setHover] = useState(0);

  const token = localStorage.getItem("token");
  const doctorId = localStorage.getItem("doctorId"); // MUST BE SET when viewing doctor
  const API_BASE = "http://localhost:6060/feedback";

  // Fetch only logged-in user's feedback
  const fetchFeedbacks = async () => {
    try {
      const res = await axios.get(`${API_BASE}/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFeedbacks(res.data.feedbacks);R
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  // Submit feedback
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        `${API_BASE}/review`,
        { rating, review, doctorId }, // doctorId required
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessage("Feedback submitted successfully!");
      setRating(5);
      setReview("");

      fetchFeedbacks();
    } catch (err) {
      setMessage("Failed to submit feedback");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* PAGE HEADER */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-blue-900">Your Feedback</h1>
        <p className="text-gray-600">Share your experience with the doctor</p>
      </div>

      {/* FEEDBACK FORM */}
      <div className="bg-white p-6 rounded-xl shadow mb-10">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          <label className="font-semibold">Rate Doctor</label>

          {/* STAR RATING */}
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={28}
                className={`cursor-pointer ${
                  (hover || rating) >= star
                    ? "text-yellow-500 fill-yellow-500"
                    : "text-gray-300"
                }`}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
              />
            ))}
            <span className="ml-2 font-semibold text-gray-700">
              {rating}/5
            </span>
          </div>

          <label className="font-semibold">Write Review</label>
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="Describe your experience..."
            className="border p-3 rounded-lg"
            rows={4}
          />

          <button className="w-full bg-blue-900 text-white py-2 rounded-lg hover:bg-blue-800">
            Submit Feedback
          </button>
        </form>

        {message && <p className="mt-3 text-green-600">{message}</p>}
      </div>

      {/* SHOW ONLY MY FEEDBACK */}
      <h2 className="text-2xl font-bold mb-4">Your Feedback History</h2>

      {feedbacks.map((fb, index) => {

        // Create stars based on rating
        const stars = Array.from({ length: 5 }, (_, i) => (
          <span key={i} className={i < fb.rating ? "text-yellow-500" : "text-gray-300"}>
            ★
          </span>
        ));

        return (
          <div
            key={fb._id}
            className="bg-white p-5 rounded-2xl shadow mb-4 border border-gray-200 flex justify-between items-start"
          >

            {/* LEFT SIDE CONTENT */}
            <div className="flex-1">

              {/* User Name + Review Number */}
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-blue-900 text-lg">
                  {index + 1}. {fb.patientId?.username}
                </h3>

                {/* Date on right */}
                <p className="text-xs text-gray-500">
                  {new Date(fb.createdAt).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric"
                  })}
                </p>
              </div>

              {/* Rating Stars */}
              <div className="flex items-center gap-1 mt-1">
                {stars}
                <span className="ml-2 font-semibold text-green-600">
                  {fb.rating}/5
                </span>
              </div>

              {/* Feedback Text */}
              <p className="mt-3 text-gray-700 leading-relaxed">
                {fb.review}
              </p>
            </div>

            {/* RIGHT SIDE: USER IMAGE */}

          </div>
        );
      })}

    </div>
  );
}
