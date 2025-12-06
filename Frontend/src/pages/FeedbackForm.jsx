import { useEffect, useState } from "react";
import axios from "axios";
import { Star } from "lucide-react";

export default function FeedbackForm({ doctorId, appointmentId }) {
  const [feedbacks, setFeedbacks] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState("");
  const [message, setMessage] = useState("");
  const [hover, setHover] = useState(0);

  const token = localStorage.getItem("token");
//   const API_BASE = "http://localhost:6060/feedback";
  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  // ✅ Fetch doctor feedbacks
  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const res = await axios.get(`${API_BASE}/doctor/${doctorId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFeedbacks(res.data.feedbacks);
        setAvgRating(res.data.avgRating);
      } catch (err) {
        console.error(err);
      }
    };
    fetchFeedback();
  }, [doctorId, token]);

  // ✅ Submit new feedback
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        API_BASE,
        { doctorId, appointmentId, rating, review },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("Feedback submitted successfully!");
      setRating(5);
      setReview("");

      // Refresh feedbacks after submitting
      const res = await axios.get(`${API_BASE}/doctor/${doctorId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFeedbacks(res.data.feedbacks);
      setAvgRating(res.data.avgRating);
    } catch (err) {
      console.error(err);
      setMessage("Failed to submit feedback.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-blue-900">Patient Feedback</h1>
        <p className="text-gray-600">Share your experience and see other patients' reviews</p>
      </div>

      {/* Submit Feedback */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-10">
        <h2 className="text-xl font-semibold mb-4 text-blue-800">Submit Your Feedback</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <label className="font-medium">Rate our services!</label>
             <div className="flex item-center gap-2">
                  {[1,2,3,4,5].map((star) =>(
                    <Star key={star} size={28} className={`cursor-pointer ${(hover || rating) >= star ? "text-yellow-400 fill-yellow-400" : : "text-gray-400"}`}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHover(star)}
                    onMouseLeave={() => setHover(0)}
                    />
                  )}
             </div>
          </div>

          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="Write your review..."
            className="border p-3 rounded resize-none focus:outline-blue-500"
            rows={4}
          />

          <button className="bg-blue-900 text-white py-2 rounded hover:bg-blue-700 transition">
            Submit Feedback
          </button>
        </form>
        {message && <p className="mt-3 text-center text-green-600">{message}</p>}
      </div>

      {/* Feedbacks List */}
      <div>
        <h2 className="text-xl font-semibold mb-4 text-blue-800">
          Reviews ({feedbacks.length}) - Average Rating: {avgRating} ⭐
        </h2>
        <div className="grid gap-4">
          {feedbacks.map((f) => (
            <div key={f._id} className="bg-white p-4 rounded shadow hover:shadow-lg transition">
              <div className="flex justify-between items-center mb-2">
                <p className="font-medium text-blue-900">{f.patientId.username}</p>
                <p className="text-yellow-500 font-semibold">{f.rating} ⭐</p>
              </div>
              <p className="text-gray-700 mb-2">{f.review}</p>
              <p className="text-gray-400 text-sm">
                {new Date(f.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
          {feedbacks.length === 0 && <p className="text-gray-500">No reviews yet.</p>}
        </div>
      </div>
    </div>
  );
}
