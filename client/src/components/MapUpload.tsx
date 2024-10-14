import React, { useState, useRef } from "react";
import { uploadMapToCampaign } from "../utility/apiservice";
import { Map } from "../utility/types";

interface MapUploadProps {
  campaignId: string;
  token: string;
  onMapUploaded: (uploadedMap: Map) => void; // Callback when map is uploaded
}

const MapUpload: React.FC<MapUploadProps> = ({ campaignId, token, onMapUploaded }) => {
  const [mapFile, setMapFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null); // Ref for file input

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setMapFile(files[0]);
    }
  };

  const handleUpload = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (mapFile) {
      setIsUploading(true);
      try {
        const uploadedMap = await uploadMapToCampaign(campaignId, mapFile, token);
        onMapUploaded(uploadedMap); // Call the callback function with the uploaded map
        setMapFile(null); // Reset the file input state
        if (fileInputRef.current) {
          fileInputRef.current.value = ""; // Clear the actual file input field
        }
      } catch (error) {
        console.error("Error uploading map:", error);
      } finally {
        setIsUploading(false);
      }
    }
  };

  return (
    <div>
      <h3>Upload a Map for the Campaign</h3>
      <form onSubmit={handleUpload}>
        <input
          ref={fileInputRef} // Attach the ref here
          type="file"
          accept="image/*"
          onChange={handleFileChange}
        />
        <button type="submit" disabled={isUploading || !mapFile}>
          {isUploading ? "Uploading..." : "Upload Map"}
        </button>
      </form>
    </div>
  );
};

export default MapUpload;
