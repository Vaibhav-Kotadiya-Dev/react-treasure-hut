import React from "react";

const SuccessPage = () => {
  const handleGoHome = () => {
    window.location.href = "/";
  };

  return (
    <div
      style={{
        backgroundColor: "#8B4513",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
      }}
    >
      <div
        style={{
          backgroundColor: "#ffffff",
          padding: "2rem 3rem",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
          textAlign: "center",
          maxWidth: "500px",
        }}
      >
        <h1 style={{ color: "#1976d2", marginBottom: "1rem" }}>
          {" "}
          Treasure Request In Progress!
        </h1>

        <p style={{ marginBottom: "2rem", color: "#333", fontSize: "1.1rem" }}>
          Thank you for registering. Your treasure hunt request is now being
          processed. Stay tuned — we will notify you when it’s ready!
        </p>

        <button
          style={{
            backgroundColor: "#1976d2",
            color: "#ffffff",
            border: "none",
            padding: "0.75rem 1.5rem",
            borderRadius: "8px",
            fontSize: "1rem",
            cursor: "pointer",
          }}
          onClick={handleGoHome}
        >
          Go to Home
        </button>
      </div>
    </div>
  );
};

export default SuccessPage;
