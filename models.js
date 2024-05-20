const mongoose = require('mongoose');

const MentorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  expertise: {
    type: String,
    required: true,
  },
});

const StudentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  mentor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Mentor',
  },
});

module.exports = {
  Mentor: mongoose.model('Mentor', MentorSchema),
  Student: mongoose.model('Student', StudentSchema),
};
