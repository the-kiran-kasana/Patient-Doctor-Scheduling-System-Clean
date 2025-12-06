import { useEffect, useState } from "react";
import axios from "axios";
import { Star } from "lucide-react";

export default function FeedbackForm() {

  const [feedbacks, setFeedbacks] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState("");
  const [message, setMessage] = useState("");
  const [hover, setHover] = useState(0);

  const token = localStorage.getItem("token");
  const API_BASE = "http://localhost:6060/feedback";

  // ✅ GET FEEDBACKS
  const fetchFeedbacks = async () => {
    try {
      const res = await axios.get(`${API_BASE}/doctor`);
      setFeedbacks(res.data.feedbacks);
      setAvgRating(res.data.avgRating);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  // ✅ SUBMIT FEEDBACK
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE}/review` , { rating, review },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      setMessage("✅ Feedback submitted!");
      setRating(5);
      setReview("");

      fetchFeedbacks(); // refresh list

    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to submit feedback");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">

     <div className="  text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-900 "> Patient Feedback</h1>
          <p  className="text-lg  mt-2  text-gray-500">Please share your opinion </p>
      </div>

      {/* SUBMIT FORM */}
      <div className="bg-white p-6 rounded shadow mb-8">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          {/* STAR RATING */}
          <label className="font-medium">Rate our services!</label>
          <div className="flex items-center gap-2">
            {[1,2,3,4,5].map((star) => (
              <Star
                key={star}
                size={26}
                className={`cursor-pointer ${
                  (hover || rating) >= star
                    ? "text-yellow-500 fill-yellow-500"
                    : "text-gray-400"
                }`}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
              />
            ))}
            <span className="ml-2 font-semibold">{rating}/5</span>
          </div>

          <label className="font-medium" value="textarea">What can be improved?</label>
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="Write your review..."
            className="border p-2 rounded"
            rows={4}
          ></textarea>

          <button className="bg-blue-900 text-white py-2 rounded hover:bg-blue-700">
            Submit Feedback
          </button>

        </form>

        {message && <p className="mt-2 text-green-600">{message}</p>}
      </div>

      {/* REVIEWS */}

      <h2 className="text-xl font-semibold mb-2">
        Reviews ({feedbacks.length}) ⭐{avgRating}
      </h2>

      {feedbacks.map((f) => (
        <div key={f._id} className="bg-white p-4 rounded shadow mb-3">
          <p className="font-bold">{f.rating} ⭐</p>
          <p>{f.review}</p>
          <p className="text-sm text-gray-500">
            {new Date(f.createdAt).toLocaleString()}
          </p>
        </div>
      ))}

    </div>
  );
}
