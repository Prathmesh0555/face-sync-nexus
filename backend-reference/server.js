const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/database');

dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`<span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mrow><mi>n</mi><mi>e</mi><mi>w</mi><mi>D</mi><mi>a</mi><mi>t</mi><mi>e</mi><mo stretchy="false">(</mo><mo stretchy="false">)</mo><mi mathvariant="normal">.</mi><mi>t</mi><mi>o</mi><mi>I</mi><mi>S</mi><mi>O</mi><mi>S</mi><mi>t</mi><mi>r</mi><mi>i</mi><mi>n</mi><mi>g</mi><mo stretchy="false">(</mo><mo stretchy="false">)</mo></mrow><mo>−</mo></mrow><annotation encoding="application/x-tex">{new Date().toISOString()} - </annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mord"><span class="mord mathnormal">n</span><span class="mord mathnormal">e</span><span class="mord mathnormal" style="margin-right:0.02691em;">w</span><span class="mord mathnormal" style="margin-right:0.02778em;">D</span><span class="mord mathnormal">a</span><span class="mord mathnormal">t</span><span class="mord mathnormal">e</span><span class="mopen">(</span><span class="mclose">)</span><span class="mord">.</span><span class="mord mathnormal">t</span><span class="mord mathnormal">o</span><span class="mord mathnormal" style="margin-right:0.07847em;">I</span><span class="mord mathnormal">SOSt</span><span class="mord mathnormal" style="margin-right:0.02778em;">r</span><span class="mord mathnormal">in</span><span class="mord mathnormal" style="margin-right:0.03588em;">g</span><span class="mopen">(</span><span class="mclose">)</span></span><span class="mord">−</span></span></span></span>{req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/students', require('./routes/students'));
app.use('/api/faculty', require('./routes/faculty'));
app.use('/api/attendance', require('./routes/attendance'));
app.use('/api/face-recognition', require('./routes/face-recognition'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Attendance System API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    faceRecognitionUrl: process.env.FACE_RECOGNITION_URL
  });
});

// Test face recognition service connectivity
app.get('/api/test-connection', async (req, res) => {
  try {
    const axios = require('axios');
    const response = await axios.get(`${process.env.FACE_RECOGNITION_URL}/health`, {
      timeout: 5000
    });
    res.json({
      success: true,
      message: 'Face recognition service is reachable',
      serviceResponse: response.data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Cannot connect to face recognition service',
      error: error.message,
      url: process.env.FACE_RECOGNITION_URL
    });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Error:', error.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'API endpoint not found',
    path: req.originalUrl
  });
});

// Use port 3000 to avoid conflict with Python service
const PORT = process.env.PORT || 3000;

// Start server
const server = app.listen(PORT, async () => {
  console.log(`🚀 Node.js Backend Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
  console.log(`🔗 Face Recognition URL: ${process.env.FACE_RECOGNITION_URL}`);
  
  // Log available endpoints
  console.log('\n📋 Available API Endpoints:');
  console.log('  GET    /api/health');
  console.log('  GET    /api/test-connection');
  console.log('  POST   /api/auth/register/student');
  console.log('  POST   /api/auth/register/faculty');
  console.log('  POST   /api/auth/login');
  console.log('  GET    /api/auth/verify');
  console.log('  GET    /api/students/profile');
  console.log('  GET    /api/students/');
  console.log('  PUT    /api/students/:id');
  console.log('  GET    /api/faculty/profile');
  console.log('  GET    /api/faculty/');
  console.log('  GET    /api/attendance/student');
  console.log('  GET    /api/attendance/class');
  console.log('  POST   /api/face-recognition/recognize');
  console.log('  GET    /api/face-recognition/attendance');
  console.log('  GET    /api/face-recognition/health');
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

module.exports = app;
