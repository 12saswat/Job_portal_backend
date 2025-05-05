# Job Application Backend API

This is a Node.js + Express backend server for user registration, login, authentication, role-based access control, and job application form submission with file upload (resume).

---

## ✅ Features

- User Registration (`/user/register`)
- User Login with JWT (`/user/login`)
- Role-based Access (admin, employee)
- JWT-protected endpoints
- File upload via `multer` (resume)
- MongoDB integration using Mongoose

---

## 🛠 Tech Stack

- Node.js
- Express.js
- MongoDB & Mongoose
- JWT for Authentication
- Multer for File Uploads
- bcrypt for password hashing

---

## 📦 Setup Instructions

### 1. Clone the repository

git clone <your-repo-url>
cd your-project-directory

### 2. Install dependencies

npm install

### Create a .env file in the root directory

PORT=4000
MONGO_URL=mongodb connection url
SECRET_KEY=your_secret_key_here

### To start the server

npm start

### 📁 API Endpoints

## 🔐 Auth Routes

## user Routes

- POST /user/register
  Registers a new user.

- POST /user/login
  Logs in a user and returns a token.

- POST /user/apply_job
  Apply a job

- GET /user/profile/:id
  Returns authenticated user profile.
  also return there applied jobs

## Admin Routes

- GET /user/getUsers
  Returns list of all users (admin only).

- GET /user/getUsers
  Returns list of all users (admin only).

- GET /user/applications
  Returns list of all application that applied by user (admin only).

- GET /user/view_appliction/:jobId
  Returns select application that applied by user (admin only).

- PATCH /user/accepted/:id
  Update the status pending > accpted

- PATCH /user/rejected/:id
  Update the status pending > rejected

## 📄 GET /applications

**Description**:  
Returns a list of all job applications with the applicant's name, email, and the role they applied for.

**Method**: `GET`  
**Access**: Admin (Requires JWT token)  
**URL**: `/applications`

### 🔐 Headers:

### ✅ Sample Response:

```json
{
  "applications": [
    {
      "name": "gudu",
      "email": "gudu21@gmail.com",
      "jobRole": "ui/ux"
    },
    {
      "name": "new",
      "email": "new32@gmail.com",
      "jobRole": "developer"
    },
    {
      "name": "Unknown",
      "email": "Unknown",
      "jobRole": "ui/ux"
    }
  ]
}



### Job Application Route
- POST /user/apply_job
Submit a job application with a resume (file upload).

Authorization: Bearer <employee-token>
Form Data (multipart/form-data):

fullName (string)
PhoneNo (string)
email (string)
description (string)
role (string)
resume (file)

### 🔐 Role-Based Access
## Supported roles:
admin
employee
Tokens are verified via middleware and access is restricted based on roles.


```
