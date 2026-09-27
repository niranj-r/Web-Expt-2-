import React from 'react';

const LoadingSpinner = ({ message = 'Fetching live events data...' }) => {
  return (
    <div className="loading-spinner-wrapper">
      <div className="spinner"></div>
      <p className="loading-message">{message}</p>
    </div>
  );
};

export default LoadingSpinner;
