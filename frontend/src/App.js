import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import FileUpload from './components/FileUpload';
import ChatInterfaces from "./components/ChatInterfaces";
import Header from './components/Header';
import { getQAPairs, clearQAPairs, hasActiveSession } from './api'; // Import API functions
import './App.css';

// Create dark theme
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#4CAF50',
    },
    secondary: {
      main: '#2196F3',
    },
    background: {
      default: '#1e1e2f',
      paper: '#27293d',
    },
  },
  typography: {
    fontFamily: "'Poppins', sans-serif",
    h1: {
      fontSize: '2.2rem',
      fontWeight: 600,
    },
    h2: {
      fontSize: '1.8rem',
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          padding: '10px 20px',
          fontWeight: 500,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 20px 0 rgba(0,0,0,0.12)',
        },
      },
    },
  },
});

function App() {
  const [isProcessed, setIsProcessed] = useState(false);
  const [qaPairs, setQaPairs] = useState([]);

  // Check if session exists on component mount
  useEffect(() => {
    const checkSession = async () => {
      if (hasActiveSession()) {
        setIsProcessed(true);
        
        try {
          // Get existing QA pairs if session exists
          const existingQAPairs = await getQAPairs();
          if (existingQAPairs && existingQAPairs.length > 0) {
            setQaPairs(existingQAPairs.map(pair => ({
              question: pair[0],
              answer: pair[1]
            })));
          }
        } catch (error) {
          console.error('Error loading existing QA pairs:', error);
        }
      }
    };
    
    checkSession();
  }, []);

  const handleProcessed = () => {
    setIsProcessed(true);
  };

  const handleNewQA = (newQA) => {
    setQaPairs((prevQaPairs) => [...prevQaPairs, newQA]);
  };

  const handleClearChat = () => {
    setQaPairs([]);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box className="app-container">
        <Header />
        <Container maxWidth="lg" className="main-container">
          <Box mb={4}>
            <Typography variant="h1" align="center" gutterBottom>
              ChatDoc
            </Typography>
            <Typography variant="h6" align="center" color="textSecondary">
              Chat with your Documents
            </Typography>
          </Box>

          <FileUpload onProcessed={handleProcessed} />
          
          {isProcessed && (
            <ChatInterfaces 
              qaPairs={qaPairs} 
              onNewQA={handleNewQA} 
              onClearChat={handleClearChat} 
            />
          )}
          
          {!isProcessed && (
            <Box mt={4} p={3} bgcolor="background.paper" borderRadius={2}>
              <Typography align="center" color="textSecondary">
                Please upload and process documents to start asking questions.
              </Typography>
            </Box>
          )}
        </Container>
        <Box className="footer" mt={5} py={2} textAlign="center">
          <Typography variant="body2" color="textSecondary">
            ©Arijeet Jash
          </Typography>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;