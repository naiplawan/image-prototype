import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

function ImageDropzone({ onImageUpload }) {
    const [uploadedImage, setUploadedImage] = useState(null);

    const onDrop = useCallback((acceptedFiles) => {
        const file = acceptedFiles[0];
        setUploadedImage(URL.createObjectURL(file));
        onImageUpload(file);  // Pass the file back to the parent component
    }, [onImageUpload]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: 'image/*',
    });

    return (
        <div>
            <div
                {...getRootProps()}
                className={`border-2 border-dashed p-6 rounded-md text-center ${
                    isDragActive ? 'border-blue-500' : 'border-gray-300'
                }`}
            >
                <input {...getInputProps()} />
                {isDragActive ? (
                    <p className="text-blue-500">Drop the image here ...</p>
                ) : (
                    <p className="text-gray-500">
                        Drag & drop an image here, or click to select one
                    </p>
                )}
            </div>
            {uploadedImage && (
                <div className="mt-4">
                    <h3 className="text-xl font-semibold">Preview:</h3>
                    <img src={uploadedImage} alt="Uploaded" className="mt-2 max-w-full h-auto rounded-md" />
                </div>
            )}
        </div>
    );
}

export default ImageDropzone;
