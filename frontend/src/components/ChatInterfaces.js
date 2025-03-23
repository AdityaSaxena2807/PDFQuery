// src/components/ChatInterface.js
import React, { useState, useRef, useEffect } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  IconButton,
  Card, 
  CardContent,
  Typography,
  CircularProgress,
  Paper,
  Divider,
  Tooltip
} from '@mui/material';
import { Send, Delete, PictureAsPdf, QuestionAnswer } from '@mui/icons-material';
import { askQuestion, generatePDF, clearQAPairs } from '../api'; // Import the API functions

const ChatInterfaces = ({ qaPairs, onNewQA, onClearChat }) => {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const endOfMessagesRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [qaPairs]);

  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleQuestionChange = (e) => {
    setQuestion(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    setLoading(true);

    try {
      // Use the API function from api.js instead of direct fetch
      const data = await askQuestion(question.trim());
      onNewQA({ question: data.question, answer: data.answer });
      setQuestion('');
    } catch (error) {
      console.error('Error asking question:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratePDF = () => {
    // Use the API function from api.js
    generatePDF();
  };

  const handleClearChat = () => {
    // Use the API function from api.js
    clearQAPairs()
      .then(() => {
        onClearChat();
      })
      .catch((error) => {
        console.error('Error clearing chat:', error);
      });
  };

  return (
    <Box mt={4}>
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6">
              <QuestionAnswer sx={{ mr: 1, verticalAlign: 'middle' }} />
              Conversation
            </Typography>
            <Box>
              <Tooltip title="Generate PDF">
                <IconButton 
                  color="primary" 
                  onClick={handleGeneratePDF}
                  disabled={qaPairs.length === 0}
                >
                  <PictureAsPdf />
                </IconButton>
              </Tooltip>
              <Tooltip title="Clear Conversation">
                <IconButton 
                  color="error" 
                  onClick={handleClearChat}
                  disabled={qaPairs.length === 0}
                >
                  <Delete />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          <Box 
            sx={{ 
              height: '400px', 
              overflowY: 'auto',
              mb: 3,
              p: 2,
              bgcolor: 'background.default',
              borderRadius: 2,
            }}
          >
            {qaPairs.length === 0 ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <Typography color="text.secondary">
                  Ask a question to get started
                </Typography>
              </Box>
            ) : (
              qaPairs.map((qa, index) => (
                <Box key={index} mb={3}>
                  <Paper 
                    elevation={1} 
                    sx={{ 
                      p: 2, 
                      bgcolor: 'background.paper', 
                      borderLeft: '4px solid #2196F3',
                      mb: 1
                    }}
                  >
                    <Typography variant="subtitle1" fontWeight="bold">
                      Q: {qa.question}
                    </Typography>
                  </Paper>
                  <Paper 
                    elevation={1} 
                    sx={{ 
                      p: 2, 
                      bgcolor: 'background.paper', 
                      borderLeft: '4px solid #4CAF50',
                      ml: 2
                    }}
                  >
                    <Typography variant="body1" component="div">
                      <span style={{ fontWeight: 'bold' }}>A:</span> {qa.answer.split('\n').map((line, i) => (
                        <React.Fragment key={i}>
                          {line}
                          {i < qa.answer.split('\n').length - 1 && <br />}
                        </React.Fragment>
                      ))}
                    </Typography>
                  </Paper>
                </Box>
              ))
            )}
            <div ref={endOfMessagesRef} />
          </Box>

          <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Ask a question about your documents..."
                value={question}
                onChange={handleQuestionChange}
                disabled={loading}
                sx={{
                  bgcolor: 'background.paper',
                }}
              />
              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={!question.trim() || loading}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Send />}
              >
                {loading ? 'Asking...' : 'Ask'}
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ChatInterfaces;