# Team Management System

A simple team management application built with the MERN stack.

This project helps admins and managers manage team members, create and assign tasks, and track task progress.

## Features

- Admin and Manager login
- Role-based access
- Manage team members
- Create and assign tasks
- Update task status
- Task priority and due dates
- Dashboard with team and task information
- Responsive design

## Tech Stack

React.js, Vite, JavaScript, SCSS, React Router, Axios, Node.js, Express.js, MongoDB, Mongoose, JWT and bcryptjs.

## Getting Started

Backend:

    cd Backend
    npm install
    npm run dev

Create a `.env` file inside the Backend folder:

    PORT=5000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    CLIENT_URL=http://localhost:5173

Frontend:

    cd Frontend
    npm install
    npm run dev

Create a `.env.local` file inside the Frontend folder:

    VITE_API_URL=http://localhost:5000/api

Then open `http://localhost:5173` in your browser.

## Demo Login

Admin: `admin@example.com` / `admin123`

Manager: `manager@example.com` / `manager123`

## Database

MongoDB is used to store users, team members and tasks.

To add sample data:

    cd Backend
    npm run seed

## Deployment

The frontend and backend are deployed separately. Environment variables are used to connect the application with the backend and database.

Do not commit `.env` files or secret keys to GitHub.

## Author

Madhavi