import React, { useEffect, useState } from "react";
import axios from "axios";
import { API } from "../../api/api";
import { useParams } from "react-router-dom";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { format } from "date-fns";
import { FaVideo, FaClinicMedical } from "react-icons/fa";

const BookingPage = () => {

    const { consultantId } = useParams();

    const [consultant, setConsultant] = useState(null);
    const [slots, setSlots] = useState([]);
    const [selectedDate, setSelectedDate] = useState();
    const [selectedTime, setSelectedTime] = useState("");
    const [mode, setMode] = useState("online");

    useEffect(() => {

        fetchConsultant();
        fetchSlots();

    }, []);

    /* Fetch therapist */

    const fetchConsultant = async () => {

        const res = await axios.get(`${API}/api/therapist/${consultantId}`);
        setConsultant(res.data.therapist);

    };

    /* Fetch slots */

    const fetchSlots = async () => {

        const res = await axios.get(`${API}/api/therapist/${consultantId}/slots`);

        const normalized = res.data.availableSlots.map(slot => ({

            ...slot,
            date: new Date(slot.date)

        }));

        setSlots(normalized);

    };

    /* Available dates */

    const availableDates = slots.map(slot => slot.date);

    /* Slots for selected day */

    const todaySlots =
        slots.find(slot =>
            format(slot.date, "yyyy-MM-dd") ===
            (selectedDate ? format(selectedDate, "yyyy-MM-dd") : "")
        )?.times || [];

    /* Booking */

    const handleBooking = async () => {

        if (!selectedTime) {
            alert("Please select time");
            return;
        }

        const token = localStorage.getItem("token");

        await axios.post(`${API}/api/booking/create`, {

            therapistId: consultantId,
            mode,
            date: format(selectedDate, "yyyy-MM-dd"),
            time: selectedTime

        }, {
            headers: { Authorization: `Bearer ${token}` }
        });

        alert("Booking confirmed");

    };

    if (!consultant) return <p className="text-center py-20">Loading...</p>;

    return (

        <section className="max-w-6xl mx-auto p-6">
             {/* Therapist Info */}
            <div className="bg-white border rounded-xl p-6 shadow-sm mb-8">
                <h2 className="text-2xl font-bold">{consultant.name}</h2>
                <p className="text-gray-500">{consultant.specialization}</p>

                <p className="text-sm text-gray-600 mt-2">
                    {consultant.bio}
                </p>

                <div className="flex justify-between mt-4">
                    <span>{consultant.experience} years experience</span>
                    <span className="font-semibold">
                        ₹{consultant.pricePerSession} / session
                    </span>
                </div>
            </div>

            <h1 className="text-3xl font-bold mb-6">Make Booking</h1>

            {/* Session Mode */}

            <div className="flex gap-4 mb-8">

                <button
                    onClick={() => setMode("online")}
                    className={`px-4 py-2 rounded-lg flex items-center gap-2
                              ${mode === "online"
                            ? "bg-green-600 text-white"
                            : "border hover:bg-gray-100"
                        }`}
                >
                    <FaVideo /> Online
                </button>

                <button
                    onClick={() => setMode("offline")}
                    className={`px-4 py-2 rounded-lg flex items-center gap-2
                              ${mode === "offline"
                            ? "bg-green-600 text-white"
                            : "border hover:bg-gray-100"
                        }`}
                >
                    <FaClinicMedical /> In-Person
                </button>

            </div>


            {/* Calendar + Slots */}

            <div className="grid md:grid-cols-2 gap-10 bg-white p-6 rounded-xl shadow">

                {/* Calendar */}

                <div>

                    <DayPicker
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        modifiers={{ available: availableDates }}
                        modifiersClassNames={{
                            available: "bg-blue-100 text-blue-700 rounded-full"
                        }}
                        disabled={{ before: new Date(), dayOfWeek: [0] }}
                    />

                </div>

                {/* Slots */}

                <div>

                    <h2 className="text-xl font-semibold mb-6">

                        {selectedDate
                            ? format(selectedDate, "EEE MMM dd yyyy")
                            : "Select a date"}

                    </h2>

                    <div className="grid grid-cols-2 gap-4">

                        {todaySlots.length === 0 && (
                            <p className="text-gray-500">No slots available</p>
                        )}

                        {todaySlots.map(slot => {

                            const isSelected = selectedTime === slot.time;

                            return (

                                <button
                                    key={slot._id}
                                    disabled={slot.isBooked}
                                    onClick={() => setSelectedTime(slot.time)}
                                    className={`py-3 rounded-lg border transition

                                          ${slot.isBooked
                                            ? "bg-gray-300 cursor-not-allowed"

                                            : isSelected
                                                ? "bg-blue-600 text-white"

                                                : "border-blue-500 text-blue-600 hover:bg-blue-50"
                                        }

`}
                                >

                                    {slot.time}

                                </button>

                            );

                        })}

                    </div>

                    {selectedTime && (

                        <button
                            onClick={handleBooking}
                            className="mt-6 w-full bg-green-600 text-white py-3 rounded-lg"
                        >

                            Confirm Booking at {selectedTime}

                        </button>

                    )}

                </div>

            </div>

        </section>

    );

};

export default BookingPage;