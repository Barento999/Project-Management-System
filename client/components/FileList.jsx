import React, { useState, useEffect } from "react";
import {
  FaFile,
  FaDownload,
  FaTrash,
  FaImage,
  FaFilePdf,
  FaFileWord,
  FaFileExcel,
  FaFilePowerpoint,
  FaFileArchive,
  FaSpinner,
} from "react-icons/fa";
import { fileAPI } from "../services/api";

const FileList = ({ entityType, entityId, refreshTrigger }) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFiles();
  }, [entityType, entityId, refreshTrigger]);

  const fetchFiles = async () => {
    try {
      const response = await fileAPI.getByEntity(entityType, entityId);
      setFiles(response.data.files || []);
    } catch (error) {
      console.error("Failed to fetch files:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (file) => {
    try {
      const response = await fileAPI.download(file._id);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", file.originalName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      alert("Failed to download file");
    }
  };

  const handleDelete = async (fileId) => {
    if (!confirm("Are you sure you want to delete this file?")) return;

    try {
      await fileAPI.delete(fileId);
      setFiles(files.filter((f) => f._id !== fileId));
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete file");
    }
  };

  const getFileIcon = (mimetype) => {
    if (mimetype.startsWith("image/"))
      return <FaImage className="text-blue-500" />;
    if (mimetype === "application/pdf")
      return <FaFilePdf className="text-red-500" />;
    if (mimetype.includes("word"))
      return <FaFileWord className="text-blue-600" />;
    if (mimetype.includes("excel") || mimetype.includes("spreadsheet"))
      return <FaFileExcel className="text-green-600" />;
    if (mimetype.includes("powerpoint") || mimetype.includes("presentation"))
      return <FaFilePowerpoint className="text-orange-600" />;
    if (mimetype.includes("zip") || mimetype.includes("compressed"))
      return <FaFileArchive className="text-yellow-600" />;
    return <FaFile className="text-gray-500" />;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <FaSpinner className="animate-spin text-3xl text-blue-600" />
      </div>
    );
  }

  if (files.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <FaFile className="mx-auto text-4xl mb-2 opacity-50" />
        <p>No files uploaded yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {files.map((file) => (
        <div
          key={file._id}
          className="flex items-center gap-4 p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow border border-gray-200">
          <div className="text-3xl">{getFileIcon(file.mimetype)}</div>

          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-800 truncate">
              {file.originalName}
            </p>
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <span>{formatFileSize(file.size)}</span>
              <span>•</span>
              <span>{formatDate(file.createdAt)}</span>
              {file.uploadedBy && (
                <>
                  <span>•</span>
                  <span>{file.uploadedBy.name}</span>
                </>
              )}
            </div>
            {file.description && (
              <p className="text-sm text-gray-600 mt-1">{file.description}</p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleDownload(file)}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Download">
              <FaDownload />
            </button>
            <button
              onClick={() => handleDelete(file._id)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete">
              <FaTrash />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FileList;
