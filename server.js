const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
const { Mentor, Student } = require('./models');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

// Connect to MongoDB
connectDB();

// Welcome message for the base URL
app.get('/api', (req, res) => {
  res.send('Welcome to the Mentor-Student API!');
});

// 1. Create Mentor
app.post('/api/mentors', async (req, res) => {
  try {
    const { name, expertise } = req.body;
    const newMentor = new Mentor({ name, expertise });
    const savedMentor = await newMentor.save();
    res.json(savedMentor);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server Error' });
  }
});

// 2. Create Student (Handles assigning to a mentor)
app.post('/api/students', async (req, res) => {
  try {
    const { name, mentorId } = req.body;

    // Check if mentor exists
    const mentor = await Mentor.findById(mentorId);
    if (!mentor) {
      return res.status(400).json({ error: 'Mentor not found' });
    }

    const newStudent = new Student({ name });
    newStudent.mentor = mentor; // Assign mentor to student

    const savedStudent = await newStudent.save();
    res.json(savedStudent);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server Error' });
  }
});

// 3a. Assign Student to Mentor (Handles adding single student)
app.put('/api/students/:studentId/assign', async (req, res) => {
  try {
    const studentId = req.params.studentId;
    const { mentorId } = req.body;

    // Check if student and mentor exist
    const student = await Student.findById(studentId);
    const mentor = await Mentor.findById(mentorId);
    if (!student || !mentor) {
      return res.status(400).json({ error: 'Student or Mentor not found' });
    }

    // Update student's mentor if it doesn't already have one
    if (!student.mentor) {
      student.mentor = mentor;
      await student.save();
    } else {
      return res.status(400).json({ error: 'Student already has a mentor' });
    }
  
    res.json(student);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server Error' });
  }
});

// 3b. List Students without a Mentor
app.get('/api/students/unassigned', async (req, res) => {
  try {
    const unassignedStudents = await Student.find({ mentor: null });
    res.json(unassignedStudents);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server Error' });
  }
});

// 4. Assign or Change Mentor for a Student
app.put('/api/students/:studentId/change-mentor', async (req, res) => {
  try {
    const studentId = req.params.studentId;
    const { mentorId } = req.body;

    // Check if student and mentor exist
    const student = await Student.findById(studentId);
    const mentor = await Mentor.findById(mentorId);
    if (!student || !mentor) {
      return res.status(400).json({ error: 'Student or Mentor not found' });
    }

    student.mentor = mentor;
    await student.save();

    res.json(student);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server Error' });
  }
});

// 5. Show All Students for a Particular Mentor
app.get('/api/mentors/:mentorId/students', async (req, res) => {
  try {
    const mentorId = req.params.mentorId;
    const mentor = await Mentor.findById(mentorId);
    if (!mentor) {
      return res.status(404).json({ error: 'Mentor not found' });
    }

    const students = await Student.find({ mentor: mentorId });
    res.json(students);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server Error' });
  }
});

// 6. Show Previously Assigned Mentor for a Student
app.get('/api/students/:studentId/previous-mentor', async (req, res) => {
  try {
    const studentId = req.params.studentId;
    const student = await Student.findById(studentId).populate('mentor');
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Check if student has a previous mentor
    if (!student.mentor) {
      return res.json({ message: 'Student has no previous mentor' });
    }

    res.json(student.mentor);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server Error' });
  }
});

// Potential GET requests endpoints
// Get All Students
app.get('/api/students', async (req, res) => {
  try {
    const students = await Student.find(); // Find all students
    res.json(students);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server Error' });
  }
});


// Add this endpoint to fetch mentors
app.get('/api/mentors', async (req, res) => {
  try {
    const mentors = await Mentor.find();
    res.json(mentors);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server Error' });
  }
});

// 3c. Assign multiple students to a mentor
app.post('/api/mentors/:mentorId/students', async (req, res) => {
  try {
    const { mentorId } = req.params;
    const { studentNames } = req.body;

    const mentor = await Mentor.findById(mentorId);
    if (!mentor) {
      return res.status(400).send('Mentor not found');
    }

    const students = await Promise.all(studentNames.map(async (name) => {
      const student = new Student({ name, mentor: mentorId });
      return await student.save();
    }));

    res.json(students);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// 4. Assign or change mentor for a particular student
app.put('/api/students/:studentId/mentor', async (req, res) => {
  try {
    const { studentId } = req.params;
    const { mentorId } = req.body;

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(400).send('Student not found');
    }

    const mentor = await Mentor.findById(mentorId);
    if (!mentor) {
      return res.status(400).send('Mentor not found');
    }

    student.mentor = mentorId;
    await student.save();

    res.json(student);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// 5. Show all students for a particular mentor
app.get('/api/mentors/:mentorId/students', async (req, res) => {
  try {
    const { mentorId } = req.params;
    const students = await Student.find({ mentor: mentorId });
    res.json(students);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// 6. Show the previously assigned mentor for a particular student
app.get('/api/students/:studentId/previous-mentor', async (req, res) => {
  try {
    const { studentId } = req.params;
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(400).send('Student not found');
    }

    const previousMentor = await Mentor.findById(student.previousMentor);
    res.json(previousMentor);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


// Add your potential GET request endpoints here

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
