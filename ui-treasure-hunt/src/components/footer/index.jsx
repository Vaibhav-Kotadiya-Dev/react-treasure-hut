import React from 'react';
// import { Box } from '@mui/material';
const MiroFooter = () => {
  return (
    <div
      style={{
        backgroundColor: "#2b2c30",
        color: "white",
        padding: "2rem",
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "flex-end",
        minHeight: "80px",
      }}
    >
      <div
        style={{
          marginTop: "auto",
        //   display: "flex",
        //   flexDirection: "row",
        //   alignItems: "baseline",
        //   justifyContent: "space-between",
        }}
      >
        <div
          style={{ fontWeight: "bold", fontSize: "14px", marginBottom: "2px" }}
        >
          Contact: 
        </div>
        {/* <Box/> */}
        <div style={{ fontSize: "16px" }}>hazel@puzzelpanda.co</div>
      </div>
    </div>
  );
};

export default MiroFooter;

