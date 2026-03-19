import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API } from "../../api/api";

const MyBooking = () => {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchBookings();

    // 🔥 Timer updates every second
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const fetchBookings = async () => {
    try {
      let url = "";

      if (user.role === "therapist") {
        url = `${API}/api/booking/therapist/${user.id}`;
      } else {
        url = `${API}/api/booking/user/${user.id}`;
      }

      const res = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setBookings(res.data.bookings);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  // ✅ FIXED DATE PARSER (NO MORE NaN)
  const getSessionDateTime = (booking) => {
    const date = booking.sessionDate.split("T")[0];
    return new Date(`${date} ${booking.sessionTime}`);
  };

  // ✅ SESSION STATE LOGIC
  const getSessionState = (booking) => {
    const sessionStart = getSessionDateTime(booking);
    const sessionEnd = new Date(sessionStart.getTime() + 60 * 60 * 1000);

    if (currentTime < sessionStart) return "upcoming";
    if (currentTime >= sessionStart && currentTime <= sessionEnd)
      return "live";
    return "expired";
  };

  // ✅ TIMER TEXT
  const getTimerText = (booking) => {
    const sessionStart = getSessionDateTime(booking);
    const diff = sessionStart - currentTime;

    if (diff <= 0) return "Live Now";

    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);

    return `${minutes}m ${seconds}s`;
  };

  // ✅ JOIN CALL
  const joinCall = async (bookingId) => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/booking/${bookingId}/start-call`
      );

      const data = await res.json();

      if (data.success && data.status === "live") {
        navigate(`/video-call/${data.roomId}`);
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  if (loading)
    return <p className="text-center mt-10">Loading bookings...</p>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold mb-6">My Bookings</h2>

      {bookings.length === 0 ? (
        <p>No bookings found</p>
      ) : (
        <div className="space-y-5">
          {bookings.map((booking) => {
            const state = getSessionState(booking);

            return (
              <div
                key={booking._id}
                className="border rounded-xl p-5 flex flex-col md:flex-row md:items-center md:justify-between shadow-sm bg-white"
              >
                {/* LEFT SIDE */}
                <div>
                  <p className="font-semibold text-lg">
                    {user.role === "therapist"
                      ? booking.user?.name
                      : booking.therapist?.name}
                  </p>

                  <p className="text-sm text-gray-600">
                    Date:{" "}
                    {new Date(
                      booking.sessionDate
                    ).toLocaleDateString()}
                  </p>

                  <p className="text-sm text-gray-600">
                    Time: {booking.sessionTime}
                  </p>

                  <p className="text-sm">
                    Mode:{" "}
                    <span className="font-medium capitalize">
                      {booking.sessionType}
                    </span>
                  </p>

                  {/* STATUS BADGE */}
                  <span
                    className={`inline-block mt-2 px-3 py-1 text-xs rounded-full
                      ${
                        booking.status === "confirmed" &&
                        "bg-green-100 text-green-600"
                      }
                      ${
                        booking.status === "pending" &&
                        "bg-yellow-100 text-yellow-600"
                      }
                      ${
                        booking.status === "cancelled" &&
                        "bg-red-100 text-red-600"
                      }
                    `}
                  >
                    {booking.status}
                  </span>
                </div>

                {/* RIGHT SIDE BUTTON */}
                <div className="mt-4 md:mt-0">
                  {booking.sessionType === "online" &&
                    booking.status === "confirmed" && (
                      <button
                        onClick={() =>
                          state === "live" &&
                          joinCall(booking._id)
                        }
                        disabled={state !== "live"}
                        className={`
                          px-5 py-2 rounded-lg text-white font-medium transition flex items-center justify-center min-w-40

                          ${
                            state === "live" &&
                            "bg-emerald-600 hover:bg-emerald-700 cursor-pointer"
                          }

                          ${
                            state === "upcoming" &&
                            "bg-gray-400 cursor-not-allowed"
                          }

                          ${
                            state === "expired" &&
                            "bg-red-400 cursor-not-allowed"
                          }
                        `}
                      >
                        {state === "live" && "Join Now"}

                        {state === "expired" && "Expired"}

                        {state === "upcoming" && (
                          <span className="text-sm">
                            Starts in {getTimerText(booking)}
                          </span>
                        )}
                      </button>
                    )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyBooking;