import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { User, Building, Calendar, FileText, MapPin, Settings, Save, Check } from "lucide-react";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [userType, setUserType] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [savingField, setSavingField] = useState(null);
  const [savedField, setSavedField] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      try {
        const { data } = await axios.get(
          "http://localhost:8000/api/dalal/profile",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUserType(data.user_type);
        setProfile(data);
      } catch (err) {
        console.error("Failed to fetch profile");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleUpdateField = async (field) => {
    setSavingField(field);
    const token = localStorage.getItem("token");
    const base = "http://localhost:8000/api/dalal/update";
    const value = profile[field];

    let url = "";
    if (userType === "recruiter") {
      if (["address", "preferences", "needs"].includes(field)) {
        url = `${base}/recruiter/${field}`;
      } else {
        setSavingField(null);
        return;
      }
    } else if (userType === "recruitee") {
      if (
        ["description", "interests", "address", "preferences"].includes(field)
      ) {
        url = `${base}/recruitee/${field}`;
      } else {
        setSavingField(null);
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
      setSavedField(field);
      setTimeout(() => setSavedField(null), 2000);
    } catch (err) {
      console.error(`Failed to update ${field}`);
    } finally {
      setSavingField(null);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-gray-600">Loading profile...</span>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-apple-lg flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Profile not found</h2>
          <p className="text-gray-600">Unable to load your profile information.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="bg-white rounded-apple-lg shadow-apple border border-gray-200 p-8 mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-primary-600 rounded-apple-lg flex items-center justify-center">
              {userType === "recruiter" ? (
                <Building className="w-8 h-8 text-white" />
              ) : (
                <User className="w-8 h-8 text-white" />
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {profile.first_name} {profile.last_name}
              </h1>
              <p className="text-gray-600 capitalize">
                {userType === "recruiter" ? "Recruiter" : "Job Seeker"}
              </p>
            </div>
          </div>
        </div>

        {/* Profile Information */}
        <div className="grid gap-8">
          {/* Basic Information */}
          <div className="bg-white rounded-apple-lg shadow-apple border border-gray-200 p-8">
            <div className="flex items-center space-x-2 mb-6">
              <Settings className="w-5 h-5 text-gray-600" />
              <h2 className="text-xl font-semibold text-gray-900">Basic Information</h2>
            </div>
            
            <div className="grid gap-6">
              {userType === "recruiter" ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Organization
                      </label>
                      <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-apple border">
                        <Building className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">{profile.organization || "Not specified"}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">This field cannot be edited</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Username
                      </label>
                      <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-apple border">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">{profile.username}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">This field cannot be edited</p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Looking For
                    </label>
                    <div className="p-3 bg-gray-50 rounded-apple border">
                      <p className="text-gray-600">{profile.looking_for || "Not specified"}</p>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">This field cannot be edited</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date of Birth
                      </label>
                      <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-apple border">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">{profile.dob || "Not specified"}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">This field cannot be edited</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Username
                      </label>
                      <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-apple border">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">{profile.username}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">This field cannot be edited</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Editable Fields */}
          <div className="bg-white rounded-apple-lg shadow-apple border border-gray-200 p-8">
            <div className="flex items-center space-x-2 mb-6">
              <FileText className="w-5 h-5 text-gray-600" />
              <h2 className="text-xl font-semibold text-gray-900">Editable Information</h2>
            </div>

            <div className="space-y-6">
              {userType === "recruiter" ? (
                <>
                  {["address", "preferences", "needs"].map((field) => (
                    <EditableField
                      key={field}
                      field={field}
                      value={profile[field] || ""}
                      onChange={handleChange}
                      onSave={() => handleUpdateField(field)}
                      isLoading={savingField === field}
                      isSaved={savedField === field}
                      icon={field === "address" ? MapPin : FileText}
                    />
                  ))}
                </>
              ) : (
                <>
                  {["description", "interests", "address", "preferences"].map((field) => (
                    <EditableField
                      key={field}
                      field={field}
                      value={profile[field] || ""}
                      onChange={handleChange}
                      onSave={() => handleUpdateField(field)}
                      isLoading={savingField === field}
                      isSaved={savedField === field}
                      icon={field === "address" ? MapPin : FileText}
                    />
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const EditableField = ({ field, value, onChange, onSave, isLoading, isSaved, icon: Icon }) => {
  const fieldName = field.charAt(0).toUpperCase() + field.slice(1).replace('_', ' ');
  
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {fieldName}
      </label>
      <div className="space-y-3">
        <div className="relative">
          <div className="absolute left-3 top-3">
            <Icon className="w-4 h-4 text-gray-400" />
          </div>
          <textarea
            name={field}
            value={value}
            onChange={onChange}
            placeholder={`Enter your ${fieldName.toLowerCase()}...`}
            rows={field === "address" ? 2 : 3}
            className="input-field pl-10 resize-none"
          />
        </div>
        <button
          onClick={onSave}
          disabled={isLoading}
          className={`btn transition-all duration-200 ${
            isSaved
              ? "bg-success text-white"
              : "btn-primary"
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Saving...</span>
            </div>
          ) : isSaved ? (
            <div className="flex items-center space-x-2">
              <Check className="w-4 h-4" />
              <span>Saved</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Save className="w-4 h-4" />
              <span>Save {fieldName}</span>
            </div>
          )}
        </button>
      </div>
    </div>
  );
};

export default Profile;
