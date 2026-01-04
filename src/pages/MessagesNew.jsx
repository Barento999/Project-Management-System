import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaEnvelope,
  FaPaperPlane,
  FaArrowLeft,
  FaTimes,
  FaPaperclip,
} from "react-icons/fa";
import { userAPI } from "../services/api";

const MessagesNew = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    recipient: "",
    subject: "",
    message: "",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await userAPI.getAll();
      setUsers(response.data.users || []);
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.recipient || !formData.subject || !formData.message) {
      alert("Please fill in all fields");
      return;
    }

    setSending(true);
    try {
      // Note: In a production environment, this would call a dedicated messaging API
      // For this demo, we're simulating the message send
      // The backend would need a POST /api/messages endpoint to create actual messages

      await new Promise((resolve) => setTimeout(resolve, 1000));

      const recipientUser = users.find((u) => u._id === formData.recipient);

      alert(
        `Message sent successfully!\n\n` +
          `To: ${recipientUser?.name || "User"}\n` +
          `Subject: ${formData.subject}\n\n` +
          `Note: This is a demo. In production, this would create a real message ` +
          `that appears in the recipient's inbox and your sent folder.`
      );

      // Clear form
      setFormData({ recipient: "", subject: "", message: "" });

      // Navigate to sent messages
      navigate("/messages/sent");
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const handleSaveDraft = () => {
    alert("Draft saved! (Feature coming soon)");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <FaEnvelope className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/messages")}
              className="p-2 hover:bg-gray-100 rounded-lg transition-all">
              <FaArrowLeft className="text-gray-600" />
            </button>
            <div className="p-3 bg-purple-600 rounded-xl">
              <FaEnvelope className="text-white text-2xl" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">New Message</h1>
              <p className="text-gray-500 mt-1">
                Compose a new message for your team
              </p>
            </div>
          </div>
        </div>

        {/* Compose Form */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Recipient */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                To <span className="text-red-600">*</span>
              </label>
              <select
                value={formData.recipient}
                onChange={(e) =>
                  setFormData({ ...formData, recipient: e.target.value })
                }
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:ring-2 focus:ring-blue-600 outline-none"
                required>
                <option value="">Select a recipient...</option>
                {users.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.name} ({user.email})
                  </option>
                ))}
              </select>
            </div>

            {/* Subject */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Subject <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) =>
                  setFormData({ ...formData, subject: e.target.value })
                }
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:ring-2 focus:ring-blue-600 outline-none"
                placeholder="Enter subject..."
                required
              />
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Message <span className="text-red-600">*</span>
              </label>
              <textarea
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:ring-2 focus:ring-blue-600 outline-none"
                rows="12"
                placeholder="Type your message here..."
                required
              />
              <p className="text-sm text-gray-500 mt-2">
                {formData.message.length} characters
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-between gap-4 pt-4 border-t border-gray-200">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => alert("Attach file feature coming soon!")}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all font-semibold flex items-center gap-2">
                  <FaPaperclip /> Attach File
                </button>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all font-semibold">
                  Save Draft
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/messages")}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all font-semibold flex items-center gap-2">
                  <FaTimes /> Cancel
                </button>
                <button
                  type="submit"
                  disabled={sending}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                  {sending ? (
                    <>
                      <FaPaperPlane className="animate-spin" /> Sending...
                    </>
                  ) : (
                    <>
                      <FaPaperPlane /> Send Message
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Tips */}
        <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-2">💡 Tips</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Keep your subject line clear and concise</li>
            <li>• Use proper formatting for better readability</li>
            <li>• Double-check the recipient before sending</li>
            <li>• Save drafts to continue editing later</li>
          </ul>
        </div>

        {/* Demo Note */}
        <div className="bg-amber-50 p-6 rounded-xl border border-amber-200">
          <h3 className="font-semibold text-amber-900 mb-2">📝 Demo Note</h3>
          <p className="text-sm text-amber-800">
            This messaging feature is currently in demo mode. Messages are
            simulated and won't appear in the actual inbox. In a production
            environment, this would integrate with a dedicated messaging API to
            create real messages that appear in both the sender's "Sent" folder
            and the recipient's "Inbox".
          </p>
        </div>
      </div>
    </div>
  );
};

export default MessagesNew;
