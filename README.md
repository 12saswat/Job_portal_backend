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

## User Routes

POST /user/register - Registers a new user  
POST /user/login - Logs in a user and returns a token  
POST /user/apply_job - Apply a job  
GET /user/profile/:id - Returns authenticated user profile  
 (also returns their applied jobs)

## Admin Routes

GET /user/getUsers - Returns list of all users (admin only)  
GET /user/applications - Returns list of all applications (admin only)  
GET /user/view_application/:jobId - Returns selected application details (admin only)  
PATCH /user/accepted/:id - Update the status from pending → accepted  
PATCH /user/rejected/:id - Update the status from pending → rejected

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
  "UserRoutes": {
    "Register": {
      "method": "POST",
      "url": "http://localhost:4000/user/register",
      "body": {
        "name": "new1",
        "email": "new132@gmail.com",
        "password": "123",
        "role": "Employee"
      }
    },
    "Login": {
      "method": "POST",
      "url": "http://localhost:4000/user/login",
      "body": {
        "email": "saswatp813@gmail.com",
        "password": "123"
      },
      "response": {
        "msg": "Login successful",
        "user": {
          "email": "saswatp813@gmail.com",
          "role": "admin"
        },
        "token": "......"
      }
    },
    "Profile": {
      "method": "GET",
      "url": "http://localhost:4000/user/profile",
      "response": {
        "msg": "User profile fetched",
        "user": {
          "_id": "6818350e9a2ef0b71bdfd6fa",
          "name": "new1",
          "email": "new132@gmail.com",
          "role": "employee",
          "__v": 0
        },
        "appliedJob": [
          {
            "resume": {
              "contentType": "application/pdf"
            },
            "_id": "681835af9a2ef0b71bdfd706",
            "user": "6818350e9a2ef0b71bdfd6fa",
            "fullName": "new1",
            "PhoneNo": "637282095",
            "email": "new123@gmail.com",
            "description": "hey am just checking",
            "role": "ui/ux",
            "__v": 0,
            "status": "accepted"
          }
        ]
      }
    },
    "ApplyJob": {
      "method": "POST",
      "url": "http://localhost:4000/user/apply_job",
      "fields": {
        "user": "req.user._id",
        "fullName": "string",
        "PhoneNo": "string",
        "email": "string",
        "description": "string",
        "role": "string",
        "status": "pending",
        "resume": {
          "data": "Buffer",
          "contentType": "application/pdf"
        }
      },
      "response": {
        "message": "Application submitted successfully"
      }
    }
  },
  "AdminRoutes": {
    "ApplicationsList": {
      "method": "GET",
      "url": "http://localhost:4000/user/applications",
      "access": "admin only",
      "response": {
        "applications": [
          {
            "name": "new1",
            "email": "new132@gmail.com",
            "jobRole": "ui/ux"
          }
        ]
      }
    }
  },
  "ViewApplication": {
    "method": "GET",
    "url": "http://localhost:4000/user/view_appliction/:Id",
    "response": {
      "message": "Application found",
      "application": {
        "resume": {
          "contentType": "application/pdf"
        },
        "_id": "681835af9a2ef0b71bdfd706",
        "user": {
          "_id": "6818350e9a2ef0b71bdfd6fa",
          "name": "new1",
          "email": "new132@gmail.com"
        },
        "fullName": "new1",
        "PhoneNo": "637282095",
        "email": "new123@gmail.com",
        "description": "hey am just checking",
        "role": "ui/ux",
        "__v": 0,
        "status": "rejected"
      }
    }
  },
  "AcceptApplication": {
    "method": "PATCH",
    "url": "http://localhost:4000/user/accepted/:id",
    "description": "Accept a job application by updating its status to 'accepted'.",
    "response": {
      "message": "Application accepted",
      "application": {
        "_id": "681835af9a2ef0b71bdfd706",
        "status": "accepted"
      }
    }
  },
  "RejectApplication": {
    "method": "PATCH",
    "url": "http://localhost:4000/user/rejected/:id",
    "description": "Reject a job application by updating its status to 'rejected'.",
    "response": {
      "message": "Application accepted",
      "application": {
        "_id": "681835af9a2ef0b71bdfd706",
        "status": "rejected"
      }
    }
  }
}
```
