import { useState, useEffect, useRef } from "react";
import {
  FaFileAlt,
  FaPlus,
  FaFolder,
  FaUpload,
  FaDownload,
  FaShare,
  FaClock,
  FaSearch,
  FaFilter,
  FaTimes,
  FaTrash,
} from "react-icons/fa";
import { fileAPI } from "../services/api";

const Documents = () => {
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [documents, setDocuments] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [description, setDescription] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await fileAPI.getAll();
      setDocuments(response.data.files || []);
    } catch (error) {
      console.error("Error fetching documents:", error);
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
      setShowUploadModal(true);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setShowUploadModal(true);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("description", description);

    try {
      await fileAPI.upload(formData);
      setSelectedFile(null);
      setDescription("");
      setShowUploadModal(false);
      fetchDocuments();
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Failed to upload file. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async (fileId, fileName) => {
    try {
      const response = await fileAPI.download(fileId);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error downloading file:", error);
      alert("Failed to download file. Please try again.");
    }
  };

  const handleDelete = async (fileId) => {
    if (!window.confirm("Are you sure you want to delete this file?")) return;

    try {
      await fileAPI.delete(fileId);
      fetchDocuments();
    } catch (error) {
      console.error("Error deleting file:", error);
      alert("Failed to delete file. Please try again.");
    }
  };

  const getFileIcon = (fileName) => {
    const extension = fileName.split(".").pop().toLowerCase();
    const iconClass = "text-2xl";

    if (["pdf"].includes(extension)) {
      return <FaFileAlt className={`${iconClass} text-red-600`} />;
    } else if (["doc", "docx"].includes(extension)) {
      return <FaFileAlt className={`${iconClass} text-blue-600`} />;
    } else if (["xls", "xlsx"].includes(extension)) {
      return <FaFileAlt className={`${iconClass} text-green-600`} />;
    } else if (["fig", "figma"].includes(extension)) {
      return <FaFileAlt className={`${iconClass} text-purple-600`} />;
    } else if (["jpg", "jpeg", "png", "gif"].includes(extension)) {
      return <FaFileAlt className={`${iconClass} text-pink-600`} />;
    } else {
      return <FaFileAlt className={`${iconClass} text-gray-600`} />;
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`;
    return date.toLocaleDateString();
  };

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = doc.originalName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    if (filterType === "recent") {
      const dayAgo = new Date(Date.now() - 86400000);
      return matchesSearch && new Date(doc.uploadedAt) > dayAgo;
    }
    return matchesSearch;
  });

  const quickStats = [
    {
      label: "Total Files",
      value: documents.length.toString(),
      icon: <FaFileAlt />,
    },
    {
      label: "Total Size",
      value: formatFileSize(
        documents.reduce((acc, doc) => acc + (doc.size || 0), 0)
      ),
      icon: <FaFolder />,
    },
    {
      label: "Shared",
      value: documents.filter((d) => d.shared).length.toString(),
      icon: <FaShare />,
    },
    {
      label: "Recent",
      value: documents
        .filter((d) => {
          const dayAgo = new Date(Date.now() - 86400000);
          return new Date(d.uploadedAt) > dayAgo;
        })
        .length.toString(),
      icon: <FaClock />,
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <FaFileAlt className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading documents...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gray-50">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-600 rounded-xl">
                <FaFileAlt className="text-white text-2xl" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Documents</h1>
                <p className="text-gray-500 mt-1">
                  Manage and share project documents
                </p>
              </div>
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2 font-semibold">
              <FaPlus /> Upload Document
            </button>
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:ring-2 focus:ring-blue-600 outline-none"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setFilterType("all")}
                className={`px-4 py-3 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                  filterType === "all"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}>
                <FaFilter /> All
              </button>
              <button
                onClick={() => setFilterType("recent")}
                className={`px-4 py-3 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                  filterType === "recent"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}>
                <FaClock /> Recent
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickStats.map((stat, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-blue-600 rounded-lg text-white text-xl">
                  {stat.icon}
                </div>
              </div>
              <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Documents List */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-blue-600 rounded-lg">
              <FaClock className="text-white text-xl" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              {filterType === "recent" ? "Recent Documents" : "All Documents"}
            </h2>
          </div>

          {filteredDocuments.length === 0 ? (
            <div className="text-center py-12">
              <FaFileAlt className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No documents found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredDocuments.map((doc) => (
                <div
                  key={doc._id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-all">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="p-3 bg-white rounded-lg border border-gray-200">
                      {getFileIcon(doc.originalName)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 truncate">
                        {doc.originalName}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {formatFileSize(doc.size)} • Uploaded by{" "}
                        {doc.uploadedBy?.name || "Unknown"} •{" "}
                        {formatDate(doc.uploadedAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDownload(doc._id, doc.originalName)}
                      className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
                      title="Download">
                      <FaDownload />
                    </button>
                    <button
                      onClick={() => handleDelete(doc._id)}
                      className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
                      title="Delete">
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upload Area */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`bg-white p-8 rounded-xl shadow-lg border-2 border-dashed transition-all cursor-pointer ${
            dragActive
              ? "border-blue-600 bg-blue-50"
              : "border-gray-300 hover:border-blue-600"
          }`}
          onClick={() => fileInputRef.current?.click()}>
          <div className="text-center">
            <div className="inline-flex p-4 bg-blue-50 rounded-full mb-4">
              <FaUpload className="text-4xl text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Upload Documents
            </h3>
            <p className="text-gray-500 mb-4">
              Drag and drop files here, or click to browse
            </p>
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">Upload File</h3>
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  setSelectedFile(null);
                  setDescription("");
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-all">
                <FaTimes className="text-gray-500" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center gap-3">
                  {selectedFile && getFileIcon(selectedFile.name)}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate">
                      {selectedFile?.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {selectedFile && formatFileSize(selectedFile.size)}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:ring-2 focus:ring-blue-600 outline-none"
                  rows="3"
                  placeholder="Add a description for this file..."
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  setSelectedFile(null);
                  setDescription("");
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all font-semibold">
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={uploading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                {uploading ? (
                  <>
                    <FaUpload className="animate-spin" /> Uploading...
                  </>
                ) : (
                  <>
                    <FaUpload /> Upload
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Documents;
