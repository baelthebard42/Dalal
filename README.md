# Dalal — AI-Powered Job Broker Platform

Dalal is a full-stack application that connects recruiters with job seekers using an intelligent matching system. It offers dedicated user flows for both recruiters and recruitees, and includes a built-in chatbot (Dalal) that helps users discover relevant opportunities or candidates in a conversational way.

---

## 🔧 Tech Stack

- **Frontend**: React + Tailwind CSS
- **Backend**: Django + Django REST Framework
- **Database**: SQLite (for development), supports PostgreSQL for production
- **AI/ML**: Sentence Transformers, FAISS for semantic search
- **Authentication**: Token-based auth with user types (Recruiter, Recruitee)

---

## System Design

<img width="841" height="392" alt="technical_dalal drawio" src="https://github.com/user-attachments/assets/5d4af867-916f-4fda-8e73-7907a3300803" />

## 🚀 Features

### For Recruitees:

- Register, login, and upload CV
- Add personal details, interests, and description
- Get job suggestions via chatbot

### For Recruiters:

- Register and specify hiring needs
- View relevant candidates
- Update preferences and company details
- Ask chatbot for ideal candidate matches

---

## 🛠️ Installation Guide

Make sure you have **Python 3.9+**, **Node.js 18+**, and **npm** or **yarn** installed.

---

### 1. Backend (Django)

#### Setup Instructions

```bash
# Navigate to backend directory
cd backend/

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Apply migrations
python manage.py migrate

# Run the server
python manage.py runserver
```

### 2. Frontend (React)

#### Setup Instructions

```bash
# Navigate to frontend directory
cd frontend/

# Install dependencies
npm install  # or yarn

# Run the development server
npm run dev  # or yarn dev

```
