import React, { useState } from "react";
import axios from "axios";
import Modal from "react-modal";
import "bootstrap/dist/css/bootstrap.min.css";

Modal.setAppElement("#root");

const App = () => {
  const [videoFile, setVideoFile] = useState(null);
  const [responseData, setResponseData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (event) => {
    setVideoFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!videoFile) {
      alert("Please select a video file first.");
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append("video", videoFile);

    try {
      const response = await axios.post(
        "http://5.78.110.146:8001/detect-phone",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setResponseData(response.data);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error uploading video:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container text-center mt-5">
      <h1 className="mb-4">📹 AI Video Detection</h1>

      <div className="card p-4 shadow-lg">
        <input
          type="file"
          accept="video/*"
          className="form-control mb-3"
          onChange={handleFileChange}
        />

        <button className="btn btn-primary" onClick={handleUpload} disabled={isLoading}>
          {isLoading ? "Uploading..." : "Upload Video"}
        </button>
      </div>

      {/* Result Modal */}
      <Modal isOpen={isModalOpen} onRequestClose={() => setIsModalOpen(false)}
        className="modal-dialog modal-dialog-centered"
        overlayClassName="modal-backdrop fade show"
      >
        <div className="modal-content p-4">
          <h4 className="modal-title">🔍 Detection Result</h4>
          <pre className="mt-3 p-3 bg-light rounded">
            {JSON.stringify(responseData, null, 2)}
          </pre>
          <button className="btn btn-danger mt-3" onClick={() => setIsModalOpen(false)}>
            Close
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default App;
