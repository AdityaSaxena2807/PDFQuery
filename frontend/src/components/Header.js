// src/components/Header.js
import React from 'react';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import MenuBookIcon from '@mui/icons-material/MenuBook';

const Header = () => {
  return (
    <AppBar position="static" color="transparent" elevation={0}>
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <MenuBookIcon sx={{ mr: 1, color: '#4CAF50' }} />
          <ChatIcon sx={{ mr: 1, color: '#2196F3' }} />
          <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
          PDFQuery
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;