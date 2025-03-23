// src/components/FileUpload.js
import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  Card, 
  CardContent, 
  Typography, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText,
  IconButton,
  CircularProgress
} from '@mui/material';
import { CloudUpload, Description, Delete, PictureAsPdf, Slideshow, Article } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { uploadFiles } from '../api'; // Import the API function

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const FileUpload = ({ onProcessed }) => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState(false);

  const handleFileChange = (event) => {
    const newFiles = Array.from(event.target.files);
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
  };

  const handleRemoveFile = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const getFileIcon = (fileName) => {
    if (fileName.endsWith('.pdf')) return <PictureAsPdf color="error" />;
    if (fileName.endsWith('.pptx')) return <Slideshow color="warning" />;
    if (fileName.endsWith('.docx')) return <Article color="primary" />;
    return <Description color="info" />;
  };

  const handleProcessFiles = async () => {
    if (files.length === 0) return;

    setUploading(true);
    
    try {
      // Use the API function from api.js instead of direct fetch
      const response = await uploadFiles(files);
      
      // Session ID is now automatically saved in localStorage by the uploadFiles function
      
      setUploading(false);
      setProcessing(true);

      // Simulate processing time (in a real app, this would be part of the backend response)
      setTimeout(() => {
        setProcessing(false);
        onProcessed();
      }, 2000);
    } catch (error) {
      console.error('Error uploading files:', error);
      setUploading(false);
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Upload Documents
        </Typography>
        
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center', mb: 2 }}>
          <Button
            component="label"
            variant="outlined"
            startIcon={<CloudUpload />}
            sx={{ mr: { sm: 2 }, mb: { xs: 2, sm: 0 }, flexGrow: 0 }}
            disabled={uploading || processing}
          >
            Upload Files
            <VisuallyHiddenInput type="file" multiple onChange={handleFileChange} accept=".pdf,.pptx,.docx" />
          </Button>
          
          <Button
            variant="contained"
            color="primary"
            onClick={handleProcessFiles}
            disabled={files.length === 0 || uploading || processing}
            sx={{ flexGrow: 0 }}
          >
            {uploading ? (
              <>
                <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                Uploading...
              </>
            ) : processing ? (
              <>
                <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                Processing...
              </>
            ) : (
              'Process Documents'
            )}
          </Button>
        </Box>

        {files.length > 0 && (
          <Box sx={{ maxHeight: '200px', overflow: 'auto', mt: 2 }}>
            <List dense>
              {files.map((file, index) => (
                <ListItem
                  key={index}
                  secondaryAction={
                    <IconButton edge="end" onClick={() => handleRemoveFile(index)} disabled={uploading || processing}>
                      <Delete />
                    </IconButton>
                  }
                >
                  <ListItemIcon>{getFileIcon(file.name)}</ListItemIcon>
                  <ListItemText primary={file.name} secondary={`${(file.size / 1024).toFixed(2)} KB`} />
                </ListItem>
              ))}
            </List>
          </Box>
        )}

        {files.length === 0 && (
          <Box sx={{ p: 3, textAlign: 'center', color: 'text.secondary' }}>
            <Description sx={{ fontSize: 40, opacity: 0.5, mb: 1 }} />
            <Typography>Upload PDF, PPT, or DOC files to get started</Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default FileUpload;