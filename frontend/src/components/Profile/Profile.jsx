import React, { useEffect, useState } from "react";
import { API } from "../../api/api";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(`${API}/api/user/user-info`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch user");
        }

        setUser(data.user);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    return <div className="text-center mt-10">Loading profile...</div>;
  }

  if (error) {
    return <div className="text-center mt-10 text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white p-6 rounded-xl shadow">
      
      {/* Header */}
      <div className="flex items-center gap-6 mb-6">
        <img
          src={
            user.avatar
              ? `${API}/${user.avatar}`
              : "https://ui-avatars.com/api/?name=" + user.name
          }
          alt="avatar"
          className="w-24 h-24 rounded-full object-cover border"
        />

        <div>
          <h2 className="text-2xl font-semibold">{user.name}</h2>
          <p className="text-gray-500">{user.email}</p>
          <p className="text-sm text-emerald-600 capitalize">{user.role}</p>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <Info label="Phone" value={user.phoneNo} />
        <Info label="Gender" value={user.gender} />
        <Info label="Date of Birth" value={new Date(user.dob).toDateString()} />
        <Info label="Joined On" value={new Date(user.createdAt).toDateString()} />

      </div>
    </div>
  );
};

const Info = ({ label, value }) => (
  <div className="border rounded-lg p-4">
    <p className="text-sm text-gray-500">{label}</p>
    <p className="font-medium">{value || "—"}</p>
  </div>
);

export default Profile;
