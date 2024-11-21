import React, { useState } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';
import './FileModules.css';

const FileModules = () => {
    const [moduleId, setModuleId] = useState('');
    const [files, setFiles] = useState([]);
    const [error, setError] = useState('');
    const [showInput, setShowInput] = useState(false);

    // Function to handle search button click
    const handleSearchClick = () => {
        setShowInput(true);
    };

    // Function to handle search form submission
    const handleSearch = async (e) => {
        e.preventDefault();
        if (moduleId) {
            try {
                const response = await axios.get(`${process.env.REACT_APP_URL}/api/files/${moduleId}`);
                setFiles(response.data.files);
                setError(''); // Clear any previous errors
            } catch (err) {
                console.error('Error fetching files:', err.response ? err.response.data : err.message);
                setError('Error fetching files. Please ensure the Module ID is correct.');
                setFiles([]); // Clear files on error
            }
        }
    };

    const handleDownload = async (moduleId, dayIndex) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_URL}/api/download-file/${moduleId}/${dayIndex}`, {
        method: 'GET',
      });

      if (response.status === 200) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `Module-${moduleId}_Day-${dayIndex}.file`; // Adjust the filename extension if needed
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      } else {
        const errorData = await response.json();
        console.error('Error downloading file:', errorData);
        alert('Failed to download file');
      }
    } catch (error) {
      console.error('Error during file download:', error);
      alert(`Error downloading file: ${error.message}`);
    }
  };

    return (
        <div className="team-lead-interface">
            <Sidebar />
            <main className="main-content">
                <h1>File Modules</h1>
                <p>Manage and review files and modules here.</p>
                {!showInput ? (
                    <button onClick={handleSearchClick} className="btn btn-primary search-btn">
                        Search Files by Module ID
                    </button>
                ) : (
                    <form onSubmit={handleSearch} className="search-form">
                        <input
                            type="text"
                            value={moduleId}
                            onChange={(e) => setModuleId(e.target.value)}
                            placeholder="Enter Module ID"
                            className="form-control module-input"
                        />
                        <button type="submit" className="btn btn-primary mt-2">
                            Submit
                        </button>
                    </form>
                )}

                {error && <div className="alert alert-danger mt-3 error-message">{error}</div>}

                {files.length > 0 && (
                    <div className="files-list mt-3">
                        <h2>Files for Module ID: {moduleId}</h2>
                        <ul className="file-list">
                            {files.map((file, index) => (
                                <li key={index} className="file-item">
                                    <strong>Day {file.dayIndex}</strong>
                                    <button
                    onClick={() => handleDownload(moduleId, file.dayIndex)}
                    className="btn btn-link"
                  >
                    Download
                  </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </main>
        </div>
    );
};

export default FileModules;
