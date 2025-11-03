import React, { useState, useRef } from "react";
import "../components/compomentStyles/DocumentUpload.css";
import { UploadCloud, File, CheckCircle, AlertCircle } from "lucide-react";
import { useAuth } from "../context/useAuth";

const DocumentUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { token } = useAuth();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] || null);
    setSuccess(null);
    setError(null);
  };

  const handleBrowseClick = () => {
    inputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a document to upload.");
      return;
    }
    setUploading(true);
    setSuccess(null);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("document", file);
      // Replace with your actual upload endpoint
      const response = await fetch("https://talkwithayodeji.onrender.com/api/admin/upload-document", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      if (!response.ok) throw new Error("Upload failed");
      setSuccess("Document uploaded successfully!");
      setFile(null);
      if (inputRef.current) inputRef.current.value = "";
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An error occurred during upload.");
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="document-upload-container">
      <h2 className="upload-title">Upload Document</h2>
      <form className="document-upload-form" onSubmit={handleSubmit}>
        <div className="upload-dropzone" onClick={handleBrowseClick} tabIndex={0} role="button" aria-label="Browse for document">
          <input
            type="file"
            id="document"
            name="document"
            accept=".pdf,.doc,.docx,.txt"
            onChange={handleFileChange}
            className="upload-input"
            ref={inputRef}
            style={{ display: "none" }}
          />
          <div className="dropzone-content">
            {file ? (
              <>
                <File className="dropzone-icon" />
                <span className="file-name">{file.name}</span>
              </>
            ) : (
              <>
                <UploadCloud className="dropzone-icon" />
                <span className="dropzone-text">Click to select or drag a document here</span>
                <span className="dropzone-subtext">PDF, DOC, DOCX, or TXT</span>
              </>
            )}
          </div>
        </div>
        <button
          type="submit"
          className="upload-button"
          disabled={uploading}
        >
          {uploading ? (
            <span className="uploading-spinner" aria-label="Uploading"></span>
          ) : (
            "Upload"
          )}
        </button>
        {success && (
          <div className="upload-feedback success">
            <CheckCircle /> {success}
          </div>
        )}
        {error && (
          <div className="upload-feedback error"><AlertCircle /> {error}</div>
        )}
      </form>
    </div>
  );
};

export default DocumentUpload;
