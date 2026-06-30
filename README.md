# 💼 HireHub: Job Board Application

![React](https://img.shields.io/badge/React-18+-61DAFB?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Backend-339933?logo=node.js)
![Express.js](https://img.shields.io/badge/Express.js-Server-000000?logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?logo=mongodb)
![JWT](https://img.shields.io/badge/JWT-Authentication-000000?logo=jsonwebtokens)

> A full-stack Job Board platform that connects recruiters and job seekers through a modern web application. Recruiters can post and manage job openings, while candidates can search, view, and apply for jobs with resume uploads.

---

## 🚀 Features

### 👤 Authentication & Authorization

- User Registration and Login
- JWT-Based Authentication
- Role-Based Access Control (Recruiter / Candidate)
- Secure Password Hashing with bcrypt

### 🏢 Recruiter Features

- Create and Post Job Listings
- Manage Posted Jobs
- Update Job Information
- Delete Job Posts
- View Candidate Applications

### 👨‍💼 Candidate Features

- Browse Available Jobs
- Search and Filter Job Listings
- View Detailed Job Information
- Apply for Jobs
- Upload Resume Documents

### 🔒 Security Features

- Protected API Routes
- JWT Authentication
- Password Encryption
- Input Validation
- Error Handling and Exception Management

---

## 🛠️ Tech Stack

### Frontend

- React.js
- HTML5
- CSS3
- JavaScript (ES6+)

### Backend

- Node.js
- Express.js

### Database

- MongoDB
- Mongoose

### Authentication

- JSON Web Token (JWT)
- bcrypt.js

### File Upload

- Multer

---

## 🏗️ System Architecture

```text
Candidate / Recruiter
          │
          ▼
     React Frontend
          │
          ▼
      Express API
          │
    ┌─────┴─────┐
    ▼           ▼
 Authentication  Job Management
    │             │
    └─────┬───────┘
          ▼
       MongoDB
          │
          ▼
 Resume & User Data Storage
```

---

## 📂 Project Structure

```bash
job-board/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.js
│   └── package.json
│
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── uploads/
│   ├── config/
│   └── server.js
│
├── screenshots/
│   ├── home.jpeg
│   ├── jobs.jpeg
│   └── dashboard.jpeg
│
├── .gitignore
├── README.md
└── package.json
```

---

## ⚙️ Installation

### Clone the Repository

```bash
git clone <repository-url>
cd job-board
```

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the backend folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Start the backend server:

```bash
npm start
```

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

Frontend runs on:

```text
http://localhost:3000
```

Backend API runs on:

```text
http://localhost:5000
```

---

## 📡 API Endpoints

### Authentication

| Method | Endpoint | Description |
|----------|----------|-------------|
| POST | /api/auth/register | Register User |
| POST | /api/auth/login | Login User |

### Jobs

| Method | Endpoint | Description |
|----------|----------|-------------|
| GET | /api/jobs | Get All Jobs |
| GET | /api/jobs/:id | Get Job Details |
| POST | /api/jobs | Create Job |
| PUT | /api/jobs/:id | Update Job |
| DELETE | /api/jobs/:id | Delete Job |

### Applications

| Method | Endpoint | Description |
|----------|----------|-------------|
| POST | /api/apply/:jobId | Apply for Job |
| GET | /api/applications | Get Applications |

---

## 📊 Project Highlights

| Feature | Benefit |
|----------|----------|
| Authentication System | Secure User Access |
| Role-Based Authorization | Separate Recruiter & Candidate Workflows |
| Resume Upload | Easy Candidate Application Process |
| Job Management | Efficient Recruitment Process |
| REST APIs | Scalable Backend Architecture |
| MongoDB Database | Flexible Data Storage |

---

## 📸 Application Screenshots

### 🏠 Home Page

<img src="screenshots/home.jpeg" alt="Home Page">

### 💼 Job Listings

<img src="screenshots/jobs.jpeg" alt="Job Listings">

### 📊 Recruiter Dashboard

<img src="screenshots/dashboard.jpeg" alt="Recruiter Dashboard">

---

## 🎯 Future Enhancements

- AI-Based Job Recommendations
- Resume Parsing using NLP
- Email Notifications
- Interview Scheduling
- Advanced Search Filters
- Company Profiles
- Admin Dashboard
- Real-Time Chat System
- Application Tracking Dashboard

---

## 📈 Results

| Metric | Status |
|----------|----------|
| User Authentication | ✅ Implemented |
| Role-Based Access | ✅ Implemented |
| Job Posting System | ✅ Implemented |
| Job Application System | ✅ Implemented |
| Resume Upload | ✅ Implemented |
| MongoDB Integration | ✅ Implemented |

---

## 🤝 Contributing

Contributions are welcome.

1. Fork the repository
2. Create a new branch

```bash
git checkout -b feature-name
```

3. Commit your changes

```bash
git commit -m "Added new feature"
```

4. Push the branch

```bash
git push origin feature-name
```

5. Create a Pull Request

---

## 👩‍💻 Author

**Triveni**

Bachelor of Engineering (Computer Science)

Interested in:
- Full Stack Development
- Artificial Intelligence
- Machine Learning
- Data Analytics
- Software Engineering

