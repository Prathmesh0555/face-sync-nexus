const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const Student = require('../models/Student');
const Faculty = require('../models/Faculty');

const registerStudent = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      gender,
      dob,
      rollNo,
      division,
      batch,
      year,
      mobileNumber,
      faceImage
    } = req.body;

    // Validate required fields
    if (!name || !email || !password || !rollNo || !faceImage) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: name, email, password, rollNo, faceImage'
      });
    }

    // Check if student exists
    const existingStudent = await Student.findOne({
      $or: [{ email }, { rollNo }]
    });
    
    if (existingStudent) {
      return res.status(400).json({
        success: false,
        message: 'Student with this email or roll number already exists'
      });
    }

    // Call Python microservice with correct field names
    console.log(`Calling face recognition service at: ${process.env.FACE_RECOGNITION_URL}/register`);
    
    const faceResponse = await axios.post(
      `${process.env.FACE_RECOGNITION_URL}/register`,
      {
        image: faceImage,
        person_id: rollNo,
        name: name,
        user_type: 'student'
      },
      {
        timeout: 30000,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    if (!faceResponse.data.success) {
      return res.status(400).json({
        success: false,
        message: 'Face registration failed',
        error: faceResponse.data.error
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create student with face embeddings from response
    const student = new Student({
      name,
      email,
      password: hashedPassword,
      gender,
      dob,
      rollNo,
      division,
      batch,
      year,
      mobileNumber,
      faceEmbeddings: faceResponse.data.embedding || [],
      faceImage,
      isVerified: true
    });

    await student.save();

    // Generate token
    const token = jwt.sign(
      { id: student._id, role: 'student' },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    res.status(201).json({
      success: true,
      message: 'Student registered successfully',
      token,
      user: {
        id: student._id,
        name: student.name,
        email: student.email,
        role: 'student',
        rollNo: student.rollNo,
        division: student.division,
        batch: student.batch,
        year: student.year
      }
    });

  } catch (error) {
    console.error('Registration error:', error.response?.data || error.message);
    
    if (error.code === 'ECONNREFUSED') {
      return res.status(503).json({
        success: false,
        message: 'Face recognition service is unavailable. Please try again later.',
        error: 'Service connection failed'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error registering student',
      error: error.message
    });
  }
};

const registerFaculty = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      gender,
      dob,
      employeeId,
      department,
      designation,
      mobileNumber,
      subjects,
      faceImage
    } = req.body;

    // Validate required fields
    if (!name || !email || !password || !employeeId || !faceImage) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: name, email, password, employeeId, faceImage'
      });
    }

    // Check if faculty exists
    const existingFaculty = await Faculty.findOne({
      $or: [{ email }, { employeeId }]
    });
    
    if (existingFaculty) {
      return res.status(400).json({
        success: false,
        message: 'Faculty with this email or employee ID already exists'
      });
    }

    // Call Python microservice
    const faceResponse = await axios.post(
      `${process.env.FACE_RECOGNITION_URL}/register`,
      {
        image: faceImage,
        person_id: employeeId,
        name: name,
        user_type: 'faculty'
      },
      {
        timeout: 30000,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    if (!faceResponse.data.success) {
      return res.status(400).json({
        success: false,
        message: 'Face registration failed',
        error: faceResponse.data.error
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create faculty
    const faculty = new Faculty({
      name,
      email,
      password: hashedPassword,
      gender,
      dob,
      employeeId,
      department,
      designation,
      mobileNumber,
      subjects,
      faceEmbeddings: faceResponse.data.embedding || [],
      faceImage,
      isVerified: true
    });

    await faculty.save();

    // Generate token
    const token = jwt.sign(
      { id: faculty._id, role: 'faculty' },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    res.status(201).json({
      success: true,
      message: 'Faculty registered successfully',
      token,
      user: {
        id: faculty._id,
        name: faculty.name,
        email: faculty.email,
        role: 'faculty',
        employeeId: faculty.employeeId,
        department: faculty.department,
        designation: faculty.designation
      }
    });

  } catch (error) {
    console.error('Registration error:', error.response?.data || error.message);
    
    if (error.code === 'ECONNREFUSED') {
      return res.status(503).json({
        success: false,
        message: 'Face recognition service is unavailable. Please try again later.',
        error: 'Service connection failed'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error registering faculty',
      error: error.message
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Check if user exists as student or faculty
    let user = await Student.findOne({ email });
    let role = 'student';
    
    if (!user) {
      user = await Faculty.findOne({ email });
      role = 'faculty';
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate token
    const token = jwt.sign(
      { id: user._id, role, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role,
        ...(role === 'student' ? { 
          rollNo: user.rollNo,
          division: user.division,
          batch: user.batch,
          year: user.year
        } : { 
          employeeId: user.employeeId,
          department: user.department,
          designation: user.designation
        })
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Error logging in',
      error: error.message
    });
  }
};

const verifyToken = async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    let user;
    if (decoded.role === 'student') {
      user = await Student.findById(decoded.id).select('-password -faceEmbeddings');
    } else {
      user = await Faculty.findById(decoded.id).select('-password -faceEmbeddings');
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: decoded.role,
        ...(decoded.role === 'student' ? { 
          rollNo: user.rollNo,
          division: user.division,
          batch: user.batch,
          year: user.year
        } : { 
          employeeId: user.employeeId,
          department: user.department,
          designation: user.designation
        })
      }
    });

  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
};

module.exports = {
  registerStudent,
  registerFaculty,
  login,
  verifyToken
};
