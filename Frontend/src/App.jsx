import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");  

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  const handleIdentify = async () => {
    if (!selectedImage) {
      alert("Please upload an image first.");
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedImage);

    try {
      setLoading(true);
      console.log("Sending request to Flask server...");
      const response = await axios.post("http://127.0.0.1:5000/classify", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Response received:", response.data);
      setResult(response.data.predicted_label);
      setError("");  
    } catch (error) {
      console.error("Error identifying the image:", error);
      setError("Failed to identify the clothing type. Please try again.");  
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-2xl text-center mb-4">Clothing Type Identifier</h1>

        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="mb-4"
        />

        {selectedImage && (
          <div className="mb-4 text-center">
            <img
              src={URL.createObjectURL(selectedImage)}
              alt="Selected"
              className="w-32 h-32 object-contain mx-auto"
            />
          </div>
        )}

        <button
          onClick={handleIdentify}
          disabled={loading}
          className="w-full py-2 bg-blue-500 text-white rounded-md mb-4"
        >
          {loading ? "Identifying..." : "Identify Clothing Type"}
        </button>

        {result && (
          <div className="mt-4 p-4 bg-green-100 text-center rounded-lg shadow-md">
            <p className="text-xl font-semibold">Predicted Label:</p>
            <p className="text-lg">{result}</p>
          </div>
        )}

        {error && (
          <div className="mt-4 p-4 bg-red-100 text-center rounded-lg shadow-md">
            <p className="text-xl font-semibold text-red-700">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
