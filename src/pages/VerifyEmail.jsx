import { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { FaCheckCircle, FaTimesCircle, FaSpinner } from "react-icons/fa";
import { authAPI } from "../services/api";

const VerifyEmail = () => {
  const { token } = useParams();
  const [status, setStatus] = useState("verifying"); // verifying, success, error
  const [message, setMessage] = useState("");

  const verifyEmail = useCallback(async () => {
    try {
      const res = await authAPI.verifyEmail(token);
      setStatus("success");
      setMessage(res.data.message || "Email verified successfully!");
    } catch (error) {
      setStatus("error");
      setMessage(
        error.response?.data?.message ||
          "Verification failed. Link may be expired."
      );
    }
  }, [token]);

  useEffect(() => {
    verifyEmail();
  }, [verifyEmail]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8">
        <div className="text-center">
          {status === "verifying" && (
            <>
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaSpinner className="w-10 h-10 text-blue-600 animate-spin" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Verifying Email...
              </h2>
              <p className="text-gray-600">
                Please wait while we verify your email address.
              </p>
            </>
          )}

          {status === "success" && (
            <>
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaCheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Email Verified!
              </h2>
              <p className="text-gray-600 mb-8">{message}</p>
              <Link
                to="/login"
                className="inline-block bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all">
                Go to Login
              </Link>
            </>
          )}

          {status === "error" && (
            <>
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaTimesCircle className="w-10 h-10 text-red-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Verification Failed
              </h2>
              <p className="text-gray-600 mb-8">{message}</p>
              <div className="space-y-3">
                <Link
                  to="/login"
                  className="block bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all">
                  Go to Login
                </Link>
                <p className="text-sm text-gray-500">
                  You can request a new verification email from your profile
                  page
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
