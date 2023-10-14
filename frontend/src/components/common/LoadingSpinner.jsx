import React from "react";
import "./LoadingSpinner.css";

export default function LoadingSpinner() { //component for loading spinner while in the state of loading
  return (
    <div className="spinner-container">
      <div className="loading-spinner"></div>
    </div>
  );
}