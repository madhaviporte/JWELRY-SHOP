# Team Management System

A simple MERN stack application to manage team members and their tasks.

## Features
- Admin and Manager login
- JWT authentication and role-based access
- Add, edit, delete and view team members
- Create and assign tasks
- Update task status
- Task priority and due date
- Dashboard with team and task information
- Responsive design

## Tech Stack
React, Vite, JavaScript, React Router, Axios, SCSS, Node.js, Express.js, MongoDB, Mongoose, JWT and bcryptjs.

## Project Structure
Backend - Express server, APIs, models, controllers and authentication  
Frontend - React application, pages, components and SCSS

## Run Locally

### Backend
cd Backend
npm install
npm run dev

Create a .env file:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173

### Frontend
cd Frontend
npm install
npm run dev

Create a .env.local file:

VITE_API_URL=http://localhost:5000/api

Frontend: http://localhost:5173  
Backend: http://localhost:5000

## Demo Login

Admin: admin@example.com / admin123  
Manager: manager@example.com / manager123

## Database
MongoDB stores users, team members and tasks.

To add sample data:

cd Backend
npm run seed

## Main API Routes

Auth:
POST /api/auth/login
GET /api/auth/me

Members:
GET /api/members
GET /api/members/:id
POST /api/members
PUT /api/members/:id
DELETE /api/members/:id

Tasks:
GET /api/tasks
GET /api/tasks/:id
GET /api/tasks/member/:memberId
POST /api/tasks
PUT /api/tasks/:id
DELETE /api/tasks/:id
PATCH /api/tasks/:id/status

## Deployment
Frontend and backend are deployed separately. Environment variables are used for the API URL, MongoDB connection, JWT secret and CORS settings.

Do not commit .env files or passwords to GitHub.

## Author
Madhavi