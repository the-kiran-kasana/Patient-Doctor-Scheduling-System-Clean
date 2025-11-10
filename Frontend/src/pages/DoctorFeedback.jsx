import { useEffect, useState } from "react";
import axios from "axios";

export default function DoctorFeedback({ doctorId }) {
  const [feedbacks, setFeedbacks] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const token = localStorage.getItem("token");
  const API_BASE = "http://localhost:6060/feedback";

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
  }, [doctorId]);

  return (
    <div className="max-w-2xl mx-auto mt-6">
      <h2 className="text-xl font-semibold mb-2">Average Rating: {avgRating} ⭐</h2>
      {feedbacks.map((f) => (
        <div key={f._id} className="bg-white p-4 mb-3 rounded shadow">
          <p className="font-medium">{f.patientId.username}</p>
          <p>Rating: {f.rating} ⭐</p>
          <p>{f.review}</p>
          <p className="text-gray-400 text-sm">{new Date(f.createdAt).toLocaleDateString()}</p>
        </div>
      ))}
    </div>
  );
}
