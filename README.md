# Mentor-Student Management System

This project is a Mentor-Student management system that allows mentors to be assigned to students and facilitates the management of their relationships.

## Features

- Create mentors with their expertise.
- Create students and assign them to mentors.
- Assign or change mentors for students.
- View all students assigned to a particular mentor.
- View the previously assigned mentor for a student.
- Fetch a list of unassigned students.

## Technologies Used

- **Backend:** Node.js, Express.js, MongoDB
- **Frontend:** React.js
- **Deployment Platforms:** Heroku (for backend), Render (for frontend)

## Installation and Setup

### Backend (Express Server)

1. Clone this repository.
2. Navigate to the `backend` directory: `cd backend`.
3. Install dependencies: `npm install`.
4. Configure environment variables (e.g., MongoDB connection string, port).
5. Start the server: `npm start`.

### Frontend (React App)

1. Navigate to the `frontend` directory: `cd frontend`.
2. Install dependencies: `npm install`.
3. Configure environment variables (e.g., API base URL).
4. Build the project: `npm run build`.
5. Deploy the build output to Render or any static hosting platform.

## API Endpoints

- **POST /api/mentors:** Create a new mentor.
- **POST /api/students:** Create a new student and assign them to a mentor.
- **PUT /api/students/:studentId/assign:** Assign a mentor to a student.
- **GET /api/students/unassigned:** Fetch a list of unassigned students.
- **PUT /api/students/:studentId/change-mentor:** Change the mentor of a student.
- **GET /api/mentors/:mentorId/students:** Fetch all students assigned to a particular mentor.
- **GET /api/students/:studentId/previous-mentor:** Fetch the previously assigned mentor for a student.

## Contributing

Contributions are welcome! Please follow the [Contributing Guidelines](CONTRIBUTING.md).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
