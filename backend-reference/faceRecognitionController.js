const axios = require('axios');
const Attendance = require('../models/Attendance');
const Student = require('../models/Student');

const recognizeFace = async (req, res) => {
  try {
    const { image, subject, class: className, division } = req.body;

    if (!image) {
      return res.status(400).json({
        success: false,
        error: 'Image is required'
      });
    }

    // Call Python microservice with correct format
    const response = await axios.post(
      `${process.env.FACE_RECOGNITION_URL}/recognize`,
      {
        image: image,
        subject: subject || 'General',
        class: className || '10th Grade',
        division: division || 'A'
      },
      {
        timeout: 30000,
        headers: { 'Content-Type': 'application/json' }
      }
    );

    if (response.data.success && response.data.results && response.data.results.length > 0) {
      // Get the first recognition result
      const firstResult = response.data.results[0];

      // Find student in our database
      const student = await Student.findOne({
        rollNo: firstResult.person_id
      });

      if (!student) {
        return res.status(404).json({
          success: false,
          error: 'Student not found in database'
        });
      }

      // Record attendance
      const now = new Date();
      const attendanceRecord = new Attendance({
        studentId: student._id,
        studentRollNo: student.rollNo,
        studentName: student.name,
        subject: subject || 'General',
        facultyId: req.user._id,
        date: now,
        entryTime: now,
        class: className || '10th Grade',
        division: division || 'A',
        batch: student.batch,
        year: student.year,
        status: 'present'
      });

      await attendanceRecord.save();

      res.json({
        success: true,
        message: 'Attendance marked successfully',
        data: {
          student: {
            id: student._id,
            name: student.name,
            rollNo: student.rollNo,
            email: student.email
          },
          attendance: {
            id: attendanceRecord._id,
            date: attendanceRecord.date,
            subject: attendanceRecord.subject,
            class: attendanceRecord.class,
            division: attendanceRecord.division
          }
        }
      });
    } else {
      res.status(400).json({
        success: false,
        error: response.data.error || 'Face recognition failed'
      });
    }
  } catch (error) {
    console.error('Recognition error:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

const getAttendance = async (req, res) => {
  try {
    const { studentId, startDate, endDate, subject } = req.query;

    let query = {};

    if (studentId) {
      query.studentId = studentId;
    }

    if (subject) {
      query.subject = subject;
    }

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const attendance = await Attendance.find(query)
      .populate('studentId', 'name rollNo')
      .populate('facultyId', 'name employeeId')
      .sort({ date: -1, entryTime: -1 });

    res.json({
      success: true,
      data: attendance
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Health check for face recognition service
const checkFaceRecognitionHealth = async (req, res) => {
  try {
    const response = await axios.get(
      `${process.env.FACE_RECOGNITION_URL}/health`,
      { timeout: 10000 }
    );

    res.json(response.data);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Cannot connect to face recognition service',
      error: error.message
    });
  }
};

module.exports = {
  recognizeFace,
  getAttendance,
  checkFaceRecognitionHealth
};
