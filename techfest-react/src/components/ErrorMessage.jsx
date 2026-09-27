import React from 'react';

const ErrorMessage = ({ error = 'Failed to load external event data.', onRetry }) => {
  return (
    <div className="error-card">
      <div className="error-icon">⚠️</div>
      <div className="error-content">
        <h3>API Error Encountered</h3>
        <p>{error}</p>
        {onRetry && (
          <button type="button" className="btn-action" onClick={onRetry}>
            🔄 Retry Fetching
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;
