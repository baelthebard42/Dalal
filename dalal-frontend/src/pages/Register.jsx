// src/pages/Register.jsx
import React, { useState } from "react";
import axios from "axios";

const Register = () => {
  const [userType, setUserType] = useState("recruitee");
  const [form, setForm] = useState({});

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm({
      ...form,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = async () => {
    const endpoint =
      userType === "recruiter"
        ? "api/dalal/register/recruiter"
        : "api/dalal/register/recruitee";
    const formData = new FormData();
    for (const key in form) {
      formData.append(key, form[key]);
    }
    try {
      await axios.post(`http://localhost:8000${endpoint}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Registered successfully!");
    } catch (err) {
      alert("Registration failed.");
    }
  };

  return (
    <div className="form-card">
      <h2 className="text-2xl font-semibold">Register ({userType})</h2>
      <select
        name="userType"
        value={userType}
        onChange={(e) => setUserType(e.target.value)}
      >
        <option value="recruitee">Recruitee</option>
        <option value="recruiter">Recruiter</option>
      </select>

      <input
        type="text"
        name="first_name"
        placeholder="First Name"
        onChange={handleChange}
      />
      <input
        type="text"
        name="last_name"
        placeholder="Last Name"
        onChange={handleChange}
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        onChange={handleChange}
      />

      {userType === "recruiter" ? (
        <>
          <input
            type="text"
            name="organization"
            placeholder="Organization"
            onChange={handleChange}
          />
          <textarea
            name="looking_for"
            placeholder="Looking For"
            onChange={handleChange}
          ></textarea>
        </>
      ) : (
        <>
          <input
            type="date"
            name="dob"
            placeholder="Date of Birth"
            onChange={handleChange}
          />
          <textarea
            name="interests"
            placeholder="Interests"
            onChange={handleChange}
          ></textarea>
          <textarea
            name="description"
            placeholder="Description"
            onChange={handleChange}
          ></textarea>
          <input type="file" name="cv" onChange={handleChange} />
        </>
      )}

      <button className="btn" onClick={handleSubmit}>
        Register
      </button>
    </div>
  );
};

export default Register;
