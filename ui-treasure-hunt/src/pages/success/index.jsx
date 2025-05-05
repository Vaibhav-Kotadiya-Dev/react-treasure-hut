import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import './success.css';
import { verifySession } from '../../api/payment';
import { useToast } from '../../components/toaster';

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isValid, setIsValid] = useState(null); // null = loading, false = rejected
  const query = new URLSearchParams(location.search);
  const sessionId = query.get('session_id');
  const { showToast } = useToast();
  useEffect(() => {
    if (!sessionId) {
      navigate("/");
      return;
    }
    if (isValid === null) {
      verifySession(sessionId)
        .then((response) => {
          const { data = {} } = response;
          if (data?.valid) {
            setIsValid(true);
            showToast("User registored succesfully", "success");
          }
        })
        .catch(() => navigate("/"));
    }
  }, [sessionId]);

  if (isValid === null) {
    return (
      <Box className="payment-container" sx={{ textAlign: 'center' }}>
        <CircularProgress />
        <Typography mt={2}>Verifying payment...</Typography>
      </Box>
    );
  }
  if(isValid == false){
    return (
        <Box className="payment-container" sx={{ textAlign: 'center' }}>
          <Typography mt={2}>Payment failed. Please try again.</Typography>
        </Box>
      );
  }
  return (
    <Box className="payment-container">
      <img src="/panda.png" alt="Success Panda" className="success-image" />
      <Typography variant="h6" className="success-message">
        Payment confirmed!
      </Typography>
      <Typography variant="body1" className="adventure-text">
        Get ready to begin your adventure!
      </Typography>
      <Button
        variant="contained"
        className="back-button"
        onClick={() => navigate('/')}
      >
        Back Home
      </Button>
    </Box>
  );
};

export default PaymentSuccess;


