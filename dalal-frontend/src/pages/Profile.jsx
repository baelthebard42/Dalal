// src/pages/Profile.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      try {
        const { data } = await axios.get(
          "http://127.0.0.1:8000/api/dalal/profile",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUserType(data.user_type);
        setProfile(data);
      } catch (err) {
        console.error("Failed to fetch profile");
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleUpdateField = async (field) => {
    const token = localStorage.getItem("token");
    const base = "http://127.0.0.1:8000/api/dalal/update";
    const value = profile[field];

    let url = "";
    if (userType === "recruiter") {
      if (["address", "preferences", "needs"].includes(field)) {
        url = `${base}/recruiter/${field}`;
      } else {
        alert("Cannot update this recruiter field.");
        return;
      }
    } else if (userType === "recruitee") {
      if (
        ["description", "interests", "address", "preferences"].includes(field)
      ) {
        url = `${base}/recruitee/${field}`;
      } else {
        alert("Cannot update this recruitee field.");
        return;
      }
    }

    try {
      await axios.post(
        url,
        { [field]: value },
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert(`${field} updated successfully!`);
    } catch (err) {
      alert(`Failed to update ${field}`);
    }
  };

  if (!profile) return <div>Loading...</div>;

  return (
    <div className="form-card space-y-4">
      <h2 className="text-xl font-bold">Edit Profile ({userType})</h2>

      {userType === "recruiter" ? (
        <>
          <input
            type="text"
            name="organization"
            value={profile.organization || ""}
            disabled
            placeholder="Organization (Not editable)"
            className="input-field"
          />

          <textarea
            name="looking_for"
            value={profile.looking_for || ""}
            disabled
            placeholder="Looking For (Not editable)"
            className="input-field"
          />

          {["address", "preferences", "needs"].map((field) => (
            <div key={field}>
              <textarea
                name={field}
                value={profile[field] || ""}
                onChange={handleChange}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                className="input-field"
              />
              <button className="btn" onClick={() => handleUpdateField(field)}>
                Update {field}
              </button>
            </div>
          ))}
        </>
      ) : (
        <>
          {["description", "interests", "address", "preferences"].map(
            (field) => (
              <div key={field}>
                <textarea
                  name={field}
                  value={profile[field] || ""}
                  onChange={handleChange}
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  className="input-field"
                />
                <button
                  className="btn"
                  onClick={() => handleUpdateField(field)}
                >
                  Update {field}
                </button>
              </div>
            )
          )}
        </>
      )}
    </div>
  );
};

export default Profile;
