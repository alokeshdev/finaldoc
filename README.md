# Doctor Information System

A full-stack MERN application for managing and searching doctor information.

## Features

- Admin portal for managing doctor entries
- User interface for searching doctors by symptoms and location
- Secure authentication system
- Responsive design

## Tech Stack

- MongoDB
- Express.js
- React.js
- Node.js
- JWT Authentication
- Tailwind CSS

## Project Structure

```
doctor/
├── client/                 # React frontend
├── server/                 # Node.js backend
├── .env                    # Environment variables
└── README.md              # Project documentation
```

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Backend Setup

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a .env file with the following variables:
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   ```

4. Start the server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

## API Endpoints

### Admin Routes
- POST /api/admin/login - Admin authentication
- POST /api/doctors - Add doctor
- GET /api/doctors - Get all doctors
- PUT /api/doctors/:id - Edit doctor
- DELETE /api/doctors/:id - Delete doctor

### Public Routes
- GET /api/doctors/search - Search doctors by symptoms and location

## License

MIT 