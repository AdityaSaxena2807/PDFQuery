import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Helper to get session ID from storage or create a new one
const getSessionId = () => {
  return localStorage.getItem('PDFQuery_session_id') || null;
};

// Create axios instance with interceptors to handle session ID
const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(config => {
  const sessionId = getSessionId();
  if (sessionId) {
    config.headers['X-Session-ID'] = sessionId;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

// File upload function
export const uploadFiles = async (files) => {
  const formData = new FormData();
  files.forEach(file => {
    formData.append('files', file);
  });

  try {
    const response = await api.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    // Save session ID if provided
    if (response.data.session_id) {
      localStorage.setItem('PDFQuery_session_id', response.data.session_id);
    }

    return response.data;
  } catch (error) {
    console.error('Error uploading files:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Function to send a question to the backend
export const askQuestion = async (question) => {
  try {
    const payload = { question };
    console.log('Sending request to /ask:', payload); // Debugging log

    const response = await api.post('/ask', payload, {
      headers: { 'Content-Type': 'application/json' },
    });

    return response.data;
  } catch (error) {
    console.error('Error asking question:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Function to get all question-answer pairs
export const getQAPairs = async () => {
  try {
    const response = await api.get('/get_qa_pairs');
    return response.data.qa_pairs;
  } catch (error) {
    console.error('Error getting QA pairs:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Function to clear all question-answer pairs
export const clearQAPairs = async () => {
  try {
    const response = await api.post('/clear_qa_pairs');
    return response.data;
  } catch (error) {
    console.error('Error clearing QA pairs:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Function to generate a PDF
export const generatePDF = async () => {
  try {
    const sessionId = getSessionId();
    const url = new URL(`${API_URL}/generate_pdf`);
    if (sessionId) {
      url.searchParams.append('session_id', sessionId);
    }

    console.log('Opening PDF URL:', url.toString()); // Debugging log
    window.open(url.toString(), '_blank');
  } catch (error) {
    console.error('Error generating PDF:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Function to clear session
export const clearSession = () => {
  localStorage.removeItem('PDFQuery_session_id');
};

// Function to check if a session exists
export const hasActiveSession = () => {
  return !!getSessionId();
};
