import React, { useState } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';

export const VEDAUploader = ({ onUpload, isLoading }) => {
  const [dragOver, setDragOver] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    handleFiles(files);
  };

  const handleFileChange = (e) => {
    handleFiles(e.target.files);
  };

  const handleFiles = async (files) => {
    for (const file of files) {
      if (!isLoading && onUpload) {
        onUpload(file);
        setUploadedFiles((prev) => [...prev, { name: file.name, status: 'processing' }]);
      }
    }
  };

  return (
    <div className="space-y-4">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition ${
          dragOver ? 'border-cs-600 bg-cs-50' : 'border-cs-300'
        }`}
      >
        <Upload className="w-12 h-12 mx-auto mb-3 text-cs-400" />
        <p className="text-cs-900 font-medium mb-1">Drag documents here or click to browse</p>
        <p className="text-sm text-cs-600 mb-4">Supported: PDF, DOC, DOCX, XLS, XLSX, PNG, JPG</p>
        <input
          type="file"
          multiple
          onChange={handleFileChange}
          disabled={isLoading}
          className="hidden"
          id="veda-uploader"
        />
        <label htmlFor="veda-uploader">
          <button
            onClick={() => document.getElementById('veda-uploader').click()}
            disabled={isLoading}
            className="px-4 py-2 bg-cs-600 text-white rounded-lg hover:bg-cs-700 disabled:opacity-50 transition cursor-pointer"
          >
            {isLoading ? 'Uploading...' : 'Select Files'}
          </button>
        </label>
      </div>

      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-cs-900">Uploads</h4>
          {uploadedFiles.map((file, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-cs-50 rounded-lg">
              <FileText className="w-5 h-5 text-cs-600" />
              <span className="flex-1 text-sm text-cs-900">{file.name}</span>
              {file.status === 'processing' ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-cs-600"></div>
              ) : (
                <CheckCircle className="w-5 h-5 text-green-600" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VEDAUploader;
