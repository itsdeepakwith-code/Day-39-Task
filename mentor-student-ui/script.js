const baseUrl = 'http://localhost:5000/api'; // Ensure this is your server URL

// Function to fetch mentors and populate dropdown
async function fetchMentors() {
  try {
    const response = await fetch(`${baseUrl}/mentors`);
    const mentors = await response.json();
    const mentorSelect = document.getElementById('mentor-select');
    mentorSelect.innerHTML = ''; // Clear previous options
    mentors.forEach(mentor => {
      const option = document.createElement('option');
      option.value = mentor._id;
      option.text = mentor.name;
      mentorSelect.appendChild(option);
    });
  } catch (error) {
    console.error('Error fetching mentors:', error);
  }
}

// Function to assign or change mentor for a student
async function assignMentor(studentId, mentorId) {
  try {
    const response = await fetch(`${baseUrl}/students/${studentId}/mentor`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ mentorId })
    });
    const student = await response.json();
    console.log('Student:', student); // Log the updated student object
  } catch (error) {
    console.error('Error assigning mentor:', error);
  }
}

// Function to fetch all students for a particular mentor
async function fetchStudentsForMentor(mentorId) {
  try {
    const response = await fetch(`${baseUrl}/mentors/${mentorId}/students`);
    const students = await response.json();
    console.log('Students for mentor:', students); // Log the students for the mentor
  } catch (error) {
    console.error('Error fetching students for mentor:', error);
  }
}

// Function to fetch the previously assigned mentor for a student
async function fetchPreviousMentor(studentId) {
  try {
    const response = await fetch(`${baseUrl}/students/${studentId}/previous-mentor`);
    const previousMentor = await response.json();
    console.log('Previous mentor:', previousMentor); // Log the previous mentor
  } catch (error) {
    console.error('Error fetching previous mentor:', error);
  }
}

// Call fetchMentors on page load
fetchMentors();



// Create Mentor form submission
const createMentorForm = document.getElementById('create-mentor-form');
createMentorForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const name = document.getElementById('mentor-name').value;
  const expertise = document.getElementById('mentor-expertise').value;

  try {
    const response = await fetch(`${baseUrl}/mentors`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, expertise }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const mentor = await response.json();
    console.log('Mentor created:', mentor);

    // Refresh mentors dropdown
    const mentorSelect = document.getElementById('mentor-select');
    const option = document.createElement('option');
    option.value = mentor._id;
    option.textContent = mentor.name;
    mentorSelect.appendChild(option);

  } catch (error) {
    console.error('Error creating mentor:', error);
  }
});

// Create Student form submission
const createStudentForm = document.getElementById('create-student-form');
createStudentForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const name = document.getElementById('student-name').value;
  const mentorId = document.getElementById('mentor-select').value;

  try {
    const response = await fetch(`${baseUrl}/students`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, mentorId }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const student = await response.json();
    console.log('Student created:', student);
  } catch (error) {
    console.error('Error creating student:', error);
  }
});

// Get Unassigned Students button
const getUnassignedStudentsButton = document.getElementById('get-unassigned-students');
getUnassignedStudentsButton.addEventListener('click', async () => {
  try {
    const response = await fetch(`${baseUrl}/students/unassigned`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const unassignedStudents = await response.json();

    const unassignedStudentsResults = document.getElementById('unassigned-students-results');
    unassignedStudentsResults.innerHTML = '';
    unassignedStudents.forEach((student) => {
      const studentDiv = document.createElement('div');
      studentDiv.textContent = student.name;
      unassignedStudentsResults.appendChild(studentDiv);
    });
  } catch (error) {
    console.error('Error fetching unassigned students:', error);
  }
});
