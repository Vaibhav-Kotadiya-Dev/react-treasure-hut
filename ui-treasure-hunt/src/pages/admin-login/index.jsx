// AdminLogin.jsx
import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  useMediaQuery,
  useTheme,
  Avatar,
  CircularProgress,
  InputAdornment,
  IconButton
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import LockIcon from '@mui/icons-material/Lock';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import './admin-login.css';
import { adminLogin } from '../../api/user';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../components/toaster';

const AdminLogin = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [mobileError, setMobileError] = useState(false);

  const validateMobile = (e) => {
    const value = e.target.value;
    const isValid = /^\d{7,15}$/.test(value);
    setMobileError(!isValid);
    return isValid;
  };

  const handleMobileChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    setMobile(value);
  };

  const isFormValid = password.length > 0 && mobile.length > 0 && !mobileError;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!mobile || !password) {
      showToast("Please enter both mobile number and password.", 'alert');
      return;
    }
    try {
      setLoading(true);
      const response = await adminLogin({
        mobileNumber: mobile,
        password,
      });
      const { accessToken } = response.data;
      if (accessToken) {
        showToast('User logged in successfully', 'success');
        localStorage.setItem("accessToken", accessToken);
        navigate("/admin/users");
      }
    } catch (error) {
      showToast("Login failed. Please check your credentials.", 'error');
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box className="admin-login-layout">
      <Box className="admin-login-wrapper-bg">
        <Paper className="admin-login-paper">
          <Box className="admin-login-header">
            <Avatar className="admin-login-avatar" sx={{ bgcolor: 'primary.main' }}>
              <LockOutlinedIcon style={{ color: '#fff' }} />
            </Avatar>
            <Typography variant="h5" className="admin-login-title">
              Admin Login
            </Typography>
          </Box>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Mobile Number"
              variant="outlined"
              fullWidth
              margin="normal"
              value={mobile}
              required={true}
              error={mobileError}
              onChange={handleMobileChange}
              onBlur={validateMobile}
              helperText={mobileError ? 'Enter a valid mobile number' : ''}
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PhoneIphoneIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Password"
              type={showPassword ? 'text' : 'password'}
              variant="outlined"
              fullWidth
              required={true}
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={togglePasswordVisibility}
                      edge="end"
                      disabled={loading}
                      aria-label="toggle password visibility"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              className="admin-login-button"
              disabled={loading || !isFormValid}
              startIcon={loading && <CircularProgress size={20} color="inherit" />}
            >
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </form>
        </Paper>
      </Box>
    </Box>
  );
};

export default AdminLogin;



