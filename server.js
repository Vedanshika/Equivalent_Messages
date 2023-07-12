const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();
const upload = multer({ dest: path.join(__dirname, 'uploads') });

// Set up static file serving
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Admin page route
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// File upload endpoint for admin - MT Messages
app.post('/upload-mt', upload.single('mtFile'), (req, res) => {
  res.json({ message: 'MT file uploaded successfully!' });
});

// File upload endpoint for admin - MX Messages
app.post('/upload-mx', upload.single('mxFile'), (req, res) => {
  res.json({ message: 'MX file uploaded successfully!' });
});

// User page route
app.get('/user', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'user.html'));
});

// API endpoint to retrieve MT messages
app.get('/api/mt-messages', (req, res) => {
  const mtMessages = getFilesFromDirectory('uploads', '.txt');
  res.json(mtMessages);
});

// API endpoint to retrieve MX messages
app.get('/api/mx-messages', (req, res) => {
  const mxMessages = getFilesFromDirectory('uploads', '.xml');
  res.json(mxMessages);
});

// Helper function to get files from a directory with a specific extension
function getFilesFromDirectory(directory, extension) {
  const fs = require('fs');
  const files = fs.readdirSync(directory);
  const filteredFiles = files.filter(file => path.extname(file).toLowerCase() === extension);
  const fileURLs = filteredFiles.map(file => ({
    fileName: file,
    fileURL: `/uploads/${file}`
  }));
  return fileURLs;
}

// Start the server
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
