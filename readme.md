# 🔐 MFA Login System (TypeScript Project)

## 📌 Overview

This project is a secure login system with Multi-Factor Authentication (MFA).
Users log in using email and password, followed by OTP verification.

---

## 🚀 Features

* User Registration
* Secure Login with Password
* Password Hashing using bcrypt
* Email OTP Verification (MFA)
* MongoDB Database (Docker)
* CI/CD using GitHub Actions

---

## 🛠️ Tech Stack

* Backend: Node.js + TypeScript
* Database: MongoDB
* Email: Nodemailer
* Security: bcrypt
* Containerization: Docker
* CI/CD: GitHub Actions

---

## ⚙️ Setup Instructions

### 1. Clone Repository

```
git clone <your-repo-url>
cd login-project
```

### 2. Install Dependencies

```
cd backend
npm install
```

### 3. Run MongoDB (Docker)

```
docker run -d -p 27017:27017 mongo
```

### 4. Run Backend

```
npx ts-node src/index.ts
```

### 5. Open Frontend

Open `frontend/index.html` in browser

---

## 🔄 Project Flow

1. User registers with email & password
2. Password is hashed using bcrypt
3. User logs in with credentials
4. OTP is sent to email
5. User enters OTP
6. If valid → MFA Authenticated

---

## 🔐 Security

* Passwords are hashed with bcrypt
* OTP expires in 5 minutes
* No plain-text password storage

---

## 🐳 Docker Usage

MongoDB runs inside Docker container:

```
docker run -d -p 27017:27017 mongo
```

---

## ⚡ CI/CD

GitHub Actions pipeline runs automatically on every push.

---

## ✅ Output

```
MFA Authenticated ✅
```
