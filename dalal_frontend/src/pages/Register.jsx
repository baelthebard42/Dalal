import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import axios from "axios";
import { motion } from "framer-motion";
import { UserPlus, Upload, Eye, EyeOff } from "lucide-react";

const Register = () => {
  const [userType, setUserType] = useState("recruitee");
  const [form, setForm] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm({
      ...form,
      [name]: files ? files[0] : value,
    });
    setError("");
  };

  const handleSubmit = async () => {
    // Basic validation
    const requiredFields = ['first_name', 'last_name', 'password'];
    if (userType === 'recruiter') {
      requiredFields.push('organization', 'looking_for');
    } else {
      requiredFields.push('dob', 'interests', 'cv');
    }

    const missingFields = requiredFields.filter(field => !form[field]);
    if (missingFields.length > 0) {
      setError(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return;
    }

    setIsLoading(true);
    setError("");

    const endpoint =
      userType === "recruiter"
        ? "/api/dalal/register/recruiter"
        : "/api/dalal/register/recruitee";
    const formData = new FormData();
    for (const key in form) {
      formData.append(key, form[key]);
    }
    try {
      await axios.post(`http://localhost:8000${endpoint}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSuccess(true);
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError("Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="form-card w-full text-center"
        >
          <div className="w-16 h-16 bg-success rounded-apple-lg flex items-center justify-center mx-auto mb-4">
            <UserPlus className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Registration Successful!</h2>
          <p className="text-gray-600">Redirecting you to login...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="form-card w-full max-w-lg"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary-600 rounded-apple-lg flex items-center justify-center mx-auto mb-4">
            <UserPlus className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Create your account</h2>
          <p className="text-gray-600 mt-2">Join Dalal to get started</p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-apple text-red-700 text-sm"
          >
            {error}
          </motion.div>
        )}

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Account Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setUserType("recruitee")}
                className={`p-3 rounded-apple border-2 text-sm font-medium transition-all ${
                  userType === "recruitee"
                    ? "border-primary-500 bg-primary-50 text-primary-700"
                    : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                }`}
              >
                Job Seeker
              </button>
              <button
                type="button"
                onClick={() => setUserType("recruiter")}
                className={`p-3 rounded-apple border-2 text-sm font-medium transition-all ${
                  userType === "recruiter"
                    ? "border-primary-500 bg-primary-50 text-primary-700"
                    : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                }`}
              >
                Recruiter
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Name *
              </label>
              <input
                type="text"
                name="first_name"
                placeholder="John"
                onChange={handleChange}
                className="input-field"
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Name *
              </label>
              <input
                type="text"
                name="last_name"
                placeholder="Doe"
                onChange={handleChange}
                className="input-field"
                disabled={isLoading}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password *
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Create a strong password"
                onChange={handleChange}
                className="input-field pr-12"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {userType === "recruiter" ? (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Organization *
                </label>
                <input
                  type="text"
                  name="organization"
                  placeholder="Your company name"
                  onChange={handleChange}
                  className="input-field"
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Looking For *
                </label>
                <textarea
                  name="looking_for"
                  placeholder="Describe the type of candidates you're looking for..."
                  onChange={handleChange}
                  rows={4}
                  className="input-field resize-none"
                  disabled={isLoading}
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Birth *
                </label>
                <input
                  type="date"
                  name="dob"
                  onChange={handleChange}
                  className="input-field"
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Interests *
                </label>
                <textarea
                  name="interests"
                  placeholder="Tell us about your professional interests and skills..."
                  onChange={handleChange}
                  rows={3}
                  className="input-field resize-none"
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  placeholder="Additional information about yourself (optional)..."
                  onChange={handleChange}
                  rows={3}
                  className="input-field resize-none"
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Resume/CV *
                </label>
                <div className="relative">
                  <input
                    type="file"
                    name="cv"
                    accept=".pdf,.doc,.docx"
                    onChange={handleChange}
                    className="hidden"
                    id="cv-upload"
                    disabled={isLoading}
                  />
                  <label
                    htmlFor="cv-upload"
                    className="flex items-center justify-center w-full p-4 border-2 border-dashed border-gray-300 rounded-apple cursor-pointer hover:border-primary-400 hover:bg-primary-50 transition-all"
                  >
                    <div className="text-center">
                      <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                      <span className="text-sm text-gray-600">
                        {form.cv ? form.cv.name : "Click to upload your resume"}
                      </span>
                      <p className="text-xs text-gray-400 mt-1">PDF, DOC, DOCX up to 10MB</p>
                    </div>
                  </label>
                </div>
              </div>
            </>
          )}

          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="btn btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Creating account...</span>
              </div>
            ) : (
              "Create account"
            )}
          </button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-primary-600 hover:text-primary-500 transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
