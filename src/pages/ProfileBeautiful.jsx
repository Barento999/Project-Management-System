import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { authAPI } from "../services/api";
import {
  FaUser,
  FaEnvelope,
  FaShieldAlt,
  FaEdit,
  FaSave,
  FaCamera,
  FaRocket,
  FaExclamationTriangle,
  FaCheckCircle,
} from "react-icons/fa";

const ProfileBeautiful = () => {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    avatar: "",
  });
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [sendingVerification, setSendingVerification] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || "",
        email: user.email || "",
        avatar: user.avatar || "",
      });
      setLoading(false);
    }
  }, [user]);

  const handleSave = () => {
    // Save logic here
    setIsEditing(false);
    alert("Profile updated successfully!");
  };

  const handleResendVerification = async () => {
    setSendingVerification(true);
    try {
      const response = await authAPI.sendVerification();
      if (response.data.success) {
        setVerificationSent(true);
        setTimeout(() => setVerificationSent(false), 5000);
      } else {
        alert(response.data.message || "Failed to send verification email");
      }
    } catch (error) {
      console.error("Verification email error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to send verification email";
      alert(errorMessage);
    } finally {
      setSendingVerification(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-purple-200 rounded-full animate-spin border-t-purple-600"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <FaUser className="text-purple-600 text-2xl animate-bounce" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-8">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-slate-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 bg-clip-text text-transparent mb-4 animate-fade-in">
            My Profile
          </h1>
          <p className="text-gray-600 text-lg">
            Manage your account information
          </p>
        </div>

        {/* Email Verification Banner */}
        {user && !user.isEmailVerified && (
          <div className="mb-6 bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-500 rounded-lg p-6 shadow-lg">
            <div className="flex items-start">
              <FaExclamationTriangle className="text-yellow-600 text-2xl mr-4 mt-1 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-yellow-900 mb-2">
                  Email Not Verified
                </h3>
                <p className="text-yellow-800 mb-4">
                  Please verify your email address to access all features. Check
                  your inbox for the verification link.
                </p>
                {verificationSent ? (
                  <div className="flex items-center text-green-700 bg-green-50 px-4 py-2 rounded-lg">
                    <FaCheckCircle className="mr-2" />
                    <span className="font-medium">
                      Verification email sent! Check your inbox.
                    </span>
                  </div>
                ) : (
                  <button
                    onClick={handleResendVerification}
                    disabled={sendingVerification}
                    className="px-6 py-2 bg-yellow-600 hover:bg-yellow-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                    {sendingVerification ? (
                      <>
                        <svg
                          className="animate-spin h-4 w-4"
                          viewBox="0 0 24 24">
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Sending...
                      </>
                    ) : (
                      <>
                        <FaEnvelope />
                        Resend Verification Email
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Profile Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
          {/* Profile Header with Avatar */}
          <div className="relative h-48 bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
            <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
              <div className="relative">
                <div className="bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500 rounded-full w-32 h-32 flex items-center justify-center text-white font-bold text-5xl border-4 border-white shadow-2xl">
                  {user?.name?.charAt(0)}
                </div>
                <button className="absolute bottom-2 right-2 p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110">
                  <FaCamera className="text-purple-600" />
                </button>
              </div>
            </div>
          </div>

          {/* Profile Info */}
          <div className="pt-20 px-8 pb-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {user?.name}
              </h2>
              <p className="text-gray-600 mb-3">{user?.email}</p>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full">
                <FaShieldAlt className="text-purple-600" />
                <span className="text-sm font-semibold text-purple-700">
                  {user?.role}
                </span>
              </div>
            </div>

            {/* Edit Button */}
            <div className="flex justify-center mb-8">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="group px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
                <div className="flex items-center gap-2">
                  {isEditing ? <FaSave /> : <FaEdit />}
                  <span>{isEditing ? "Cancel" : "Edit Profile"}</span>
                </div>
              </button>
            </div>

            {/* Profile Form */}
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-2xl border-2 border-purple-100">
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                    <FaUser className="text-purple-600" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) =>
                      setProfileData({ ...profileData, name: e.target.value })
                    }
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-pink-50 p-6 rounded-2xl border-2 border-blue-100">
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                    <FaEnvelope className="text-blue-600" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) =>
                      setProfileData({ ...profileData, email: e.target.value })
                    }
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-6 rounded-2xl border-2 border-pink-100">
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                  <FaCamera className="text-pink-600" />
                  Avatar URL
                </label>
                <input
                  type="text"
                  value={profileData.avatar}
                  onChange={(e) =>
                    setProfileData({ ...profileData, avatar: e.target.value })
                  }
                  disabled={!isEditing}
                  placeholder="https://example.com/avatar.jpg"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-pink-200 focus:border-pink-500 transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>

              {isEditing && (
                <div className="flex gap-4 pt-4 animate-slide-down">
                  <button
                    onClick={handleSave}
                    className="flex-1 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all">
                    <div className="flex items-center justify-center gap-2">
                      <FaSave />
                      Save Changes
                    </div>
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="flex-1 py-4 bg-gray-200 text-gray-700 rounded-xl font-bold text-lg hover:bg-gray-300 transition-all">
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white/80 backdrop-blur-xl p-6 rounded-3xl shadow-xl border border-white/50 hover:shadow-2xl transition-all hover:-translate-y-2">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl shadow-lg">
                <FaRocket className="text-white text-2xl" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Projects</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  12
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xl p-6 rounded-3xl shadow-xl border border-white/50 hover:shadow-2xl transition-all hover:-translate-y-2">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
                <FaUser className="text-white text-2xl" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Teams</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  5
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xl p-6 rounded-3xl shadow-xl border border-white/50 hover:shadow-2xl transition-all hover:-translate-y-2">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl shadow-lg">
                <FaShieldAlt className="text-white text-2xl" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Tasks Done</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  48
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ProfileBeautiful;
