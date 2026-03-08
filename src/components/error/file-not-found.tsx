import React from "react";

export const DefaultErrorUI = ({ message }: { message?: string }) => {
  const containerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px",
    border: "2px dashed #e0e0e0",
    borderRadius: "12px",
    backgroundColor: "#fafafa",
    color: "#757575",
    textAlign: "center",
    fontFamily: "sans-serif"
  };

  const iconStyle: React.CSSProperties = {
    fontSize: "48px",
    marginBottom: "16px",
    opacity: 0.6
  };

  const titleStyle: React.CSSProperties = {
    fontSize: "18px",
    fontWeight: "bold",
    margin: "0 0 8px 0",
    color: "#424242"
  };

  return (
    <div style={containerStyle}>
      <div style={iconStyle}>📄✕</div>
      <h3 style={titleStyle}>Document Not Found</h3>
      <p style={{ margin: 0, fontSize: "14px" }}>
        {message || "We couldn't load the requested Markdown file."}
      </p>
      <button 
        onClick={() => window.location.reload()}
        style={{
          marginTop: "20px",
          padding: "8px 16px",
          borderRadius: "6px",
          border: "1px solid #d1d1d1",
          background: "#fff",
          cursor: "pointer",
          fontSize: "12px"
        }}
      >
        Retry Connection
      </button>
    </div>
  );
};