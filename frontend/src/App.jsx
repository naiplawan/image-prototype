import './App.css';
import React, { useState } from 'react';
import axios from 'axios';
import ImageDropzone from './components/ImageDropzone';

function QCComponent() {
  const [outputText, setOutputText] = useState(''); // State for output text
  const [uploadedImage, setUploadedImage] = useState(null); // State for the uploaded image file

  const handleGenerate = async () => {
    if (!uploadedImage) {
      setOutputText('Please upload an image first.');
      return;
    }

    const formData = new FormData();
    formData.append('image', uploadedImage);

    try {
      const response = await axios.post('http://localhost:5000/generate', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setOutputText(response.data.generated_text);
    } catch (error) {
      console.error('Error generating text:', error);
      setOutputText('Error generating text.');
    }
  };

  const handleImageUpload = (file) => {
    setUploadedImage(file);
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-4 bg-white shadow-md rounded-md">
      <h1 className="text-2xl font-bold mb-4">Graphic QC</h1>

      {/* Image Dropzone Section */}
      <ImageDropzone onImageUpload={handleImageUpload} />

      {/* Analyze Button */}
      <button
        onClick={handleGenerate}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
      >
        Analyze Text
      </button>

      {/* Output Section */}
      <div className="mt-6">
        <h3 className="text-xl font-semibold">Output:</h3>
        <p className="mt-2 p-2 bg-gray-100 rounded-md whitespace-pre-wrap">{outputText}</p>
      </div>
    </div>
  );
}

export default QCComponent;
