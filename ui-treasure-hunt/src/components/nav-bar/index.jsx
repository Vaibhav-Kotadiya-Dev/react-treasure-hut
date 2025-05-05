// Navbar.jsx
import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';
import './navbar.css';

const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setDrawerOpen(false);
  };

  return (
    <>
      <AppBar position="static" className="custom-navbar">
        <Toolbar className="navbar-toolbar">
          <IconButton edge="start" className="menu-button" onClick={toggleDrawer(true)}>
            <MenuIcon sx={{ color: 'white' }} />
          </IconButton>

          <Typography
            variant="body2"
            className="book-now"
            onClick={() => navigate('/book-now')}
          >
            BOOK NOW
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        <List className="drawer-list">
          <ListItem button onClick={() => handleNavigation('/')}> 
            <ListItemText primary="Home" />
          </ListItem>
          <ListItem button onClick={() => handleNavigation('/book-now')}>
            <ListItemText primary="Book Now" />
          </ListItem>
          <ListItem button onClick={() => handleNavigation('/about')}>
            <ListItemText primary="About" />
          </ListItem>
        </List>
      </Drawer>
    </>
  );
};

export default Navbar;



