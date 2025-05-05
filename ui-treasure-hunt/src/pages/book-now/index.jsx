import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import './book-now.css';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { createStripeCheckoutSession } from '../../api/payment';
import { useToast } from '../../components/toaster';

const BookingForm = () => {
  const [participants, setParticipants] = useState(1);
  const [registrationDate, setRegistrationDate] = useState(dayjs());
  const [fullName, setFullName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [errors, setErrors] = useState({});
  const { showToast } = useToast();

  const pricePerPerson = 10;
  const total = typeof participants === 'number' ? pricePerPerson * participants : '?';

  const handleError = (key, value) => {
    let message = '';

    if (!value || (typeof value === 'string' && value.trim() === '')) {
      message = `${key} is required.`;
    } else if (
      key === 'whatsapp' &&
      !/^\+?[1-9]\d{6,14}$/.test(String(value).replace(/\s/g, ''))
    ) {
      message = 'Enter a valid WhatsApp number.';
    } else if (key === 'participants' && Number(value) <= 0) {
      message = 'Participants must be more than 0.';
    }

    setErrors((prev) => ({
      ...prev,
      [key]: message,
    }));
  };

  const isFormValid = () => {
    return (
      participants &&
      fullName.trim() !== '' &&
      whatsapp.trim() !== '' &&
      registrationDate &&
      Object.values(errors).every((val) => val === '')
    );
  };
  
  const handleOnChange = async (e) => {
    e.preventDefault();
    try {
    const checkoutSessionResponse = await createStripeCheckoutSession({
        mobileNumber: whatsapp,
        registrationDate ,
        teamMemberCount: participants,
      });
      if (checkoutSessionResponse.status === 200) {
        const { data: { checkoutUrl } } = await checkoutSessionResponse;
        window.location.href = checkoutUrl;
      }
    } catch (error) {
      if(error.status === 409)
         showToast('User cannot re-registor without completed previous quiz', 'error');
    }
  }
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box className="booking-wrapper">
        <Typography variant="h5" className="form-title">
          BOOK NOW
        </Typography>

        {/* Participants */}
        <div className="form-section">
          <Typography className="form-label">
            Number of participants:
          </Typography>
          <TextField
            type="number"
            placeholder="?"
            fullWidth
            value={participants}
            onChange={(e) => setParticipants(e.target.value)}
            onBlur={(e) => handleError("participants", e.target.value)}
            error={!!errors.participants}
            helperText={errors.participants}
          />
        </div>

        {/* Date */}
        <div className="form-section">
          <Typography className="form-label">Date of adventure:</Typography>
          <DatePicker
            value={registrationDate}
            label="Registration Date"
            minDate={dayjs()}
            format="DD/MM/YYYY"
            onChange={(newValue) => setRegistrationDate(newValue)}
            className="form-input"
          />
        </div>

        {/* Contact Info */}
        <div className="form-section">
          <Typography className="form-label">
            Contact info for team lead:
          </Typography>
          <TextField
            placeholder="Full name"
            fullWidth
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            onBlur={(e) => handleError("fullName", e.target.value)}
            error={!!errors.fullName}
            helperText={errors.fullName}
            sx={{ mb: 2 }}
          />
          <TextField
            placeholder="WhatsApp number"
            fullWidth
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            onBlur={(e) => handleError("whatsapp", e.target.value)}
            error={!!errors.whatsapp}
            helperText={errors.whatsapp}
          />
        </div>
        <div className="form-section">
          <Typography className="form-label">PRICE:</Typography>
          <Typography className="price-text">
            £10 pp × {participants || "?"} = £{total}
          </Typography>
        </div>
        <Button
          className="pay-button"
          variant="contained"
          disabled={!isFormValid()}
          onClick={handleOnChange}
        >
          PAY NOW
        </Button>
      </Box>
    </LocalizationProvider>
  );
};

export default BookingForm;

