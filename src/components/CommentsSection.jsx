import { useState, useEffect } from "react";
import {
  FaComment,
  FaPaperPlane,
  FaEdit,
  FaTrash,
  FaUser,
  FaClock,
} from "react-icons/fa";
import { commentAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";

const CommentsSection = ({ entityType, entityId, entityName }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const res = await commentAPI.getAll(entityType, entityId);
      setComments(res.data.comments || []);
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entityType, entityId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setSubmitting(true);
    try {
      // Extract mentions (@username)
      const mentionRegex = /@(\w+)/g;
      const mentions = [];
      let match;
      while ((match = mentionRegex.exec(newComment)) !== null) {
        mentions.push(match[1]);
      }

      await commentAPI.create({
        content: newComment,
        entityType,
        entityId,
        mentions: [], // TODO: Convert usernames to user IDs
      });

      setNewComment("");
      fetchComments();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to post comment");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = async (commentId) => {
    if (!editContent.trim()) return;

    try {
      await commentAPI.update(commentId, { content: editContent });
      setEditingId(null);
      setEditContent("");
      fetchComments();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update comment");
    }
  };

  const handleDelete = async (commentId) => {
    if (!confirm("Delete this comment?")) return;

    try {
      await commentAPI.delete(commentId);
      fetchComments();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete comment");
    }
  };

  const startEdit = (comment) => {
    setEditingId(comment._id);
    setEditContent(comment.content);
  };

  const formatDate = (date) => {
    const now = new Date();
    const commentDate = new Date(date);
    const diffMs = now - commentDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return commentDate.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
        <div className="flex items-center justify-center py-8">
          <FaComment className="w-8 h-8 text-gray-400 animate-pulse" />
          <span className="ml-3 text-gray-500">Loading comments...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <FaComment className="text-blue-600" />
          Comments ({comments.length})
        </h3>
      </div>

      {/* New Comment Form */}
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold shadow-lg">
              {user?.name?.charAt(0)}
            </div>
          </div>
          <div className="flex-1">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder={`Add a comment to ${entityName}... (Use @username to mention)`}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-600 outline-none transition-all resize-none"
              rows="3"
            />
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-gray-400">
                Tip: Use @username to mention someone
              </span>
              <button
                type="submit"
                disabled={submitting || !newComment.trim()}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                <FaPaperPlane className="text-sm" />
                {submitting ? "Posting..." : "Post"}
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <div className="text-center py-8">
            <FaComment className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No comments yet</p>
            <p className="text-sm text-gray-400">Be the first to comment!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div
              key={comment._id}
              className="flex gap-3 p-4 rounded-xl bg-gray-50 hover:shadow-md transition-all">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold shadow-lg">
                  {comment.author?.name?.charAt(0) || <FaUser />}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-gray-900">
                      {comment.author?.name || "Unknown User"}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <FaClock className="text-gray-400" />
                      <span>{formatDate(comment.createdAt)}</span>
                      {comment.isEdited && (
                        <span className="text-gray-400">(edited)</span>
                      )}
                    </div>
                  </div>
                  {comment.author?._id === user?._id && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEdit(comment)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        title="Edit">
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(comment._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        title="Delete">
                        <FaTrash />
                      </button>
                    </div>
                  )}
                </div>

                {editingId === comment._id ? (
                  <div className="mt-3">
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border-2 border-blue-300 focus:border-blue-600 outline-none resize-none"
                      rows="3"
                    />
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => handleEdit(comment._id)}
                        className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-all">
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setEditingId(null);
                          setEditContent("");
                        }}
                        className="px-4 py-1.5 bg-gray-200 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-300 transition-all">
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="mt-2 text-gray-700 whitespace-pre-wrap break-words">
                    {comment.content}
                  </p>
                )}

                {comment.mentions && comment.mentions.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {comment.mentions.map((mention) => (
                      <span
                        key={mention._id}
                        className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                        @{mention.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentsSection;
