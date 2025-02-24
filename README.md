# E-Mail-PDF-Fetcher

**E-Mail-PDF-Fetcher** is an application designed to automatically fetch **PDF attachments** from emails, store them locally, and log metadata in **PostgreSQL using Prisma**. It supports **IMAP** for email retrieval.

---

## Features

- **Email Configuration UI** – Add, and remove email accounts.
- **Automatic PDF Retrieval** – Detects and downloads PDF attachments automatically.
- **Database Storage** – Stores metadata (sender, subject, date, filename) in PostgreSQL.
- **Custom Fetch Intervals** – Allows users to **select a specific start date** for fetching emails, optimizing data retrieval and reducing unnecessary processing.  
- **Real-Time Notifications** – Alerts using toast messages for success, failure, and warnings.
- **Secure Authentication** – Supports Gmail App Passwords.

---

## Project Structure

```
MailPDFFetcher/
│── backend/               # Node.js Express Backend
│   ├── controllers/       # API controllers for handling requests
│   ├── daos/              # Database interactions with Prisma
│   ├── routes/            # Express API routes
│   ├── emailFetcher.js    # Email fetching logic using IMAP
│   ├── prisma/            # Prisma schema and database migrations
│   ├── pdfs/              # Local folder where PDF attachments are stored
│   ├── .env               # Environment variables
│   ├── server.js          # Main Express server
│── frontend/              # React Frontend (UI)
│   ├── src/               # Source code
│   │   ├── components/    # Reusable UI components
│   │   ├── styles/        # CSS stylesheets
│   │   ├── App.js         # Root component
│   │   ├── index.js       # Entry point
│   ├── public/            # Static assets
│── .gitignore             # Ignored files for Git
│── package.json           # Dependencies and scripts
│── README.md              # Documentation
```

---

## Installation & Setup

### Clone the Repository
```sh
git clone https://github.com/yourusername/MailPDFFetcher.git
cd Mail-PDF-Fetcher
```

### Backend Setup (Node.js + Prisma + Express)
```sh
cd backend
npm install  # Install dependencies
npx prisma migrate dev  # Initialize the database
npm run dev  # Start the backend server
```
- The backend runs on **http://localhost:5000**.

### Frontend Setup (React)
```sh
cd frontend
npm install  # Install frontend dependencies
npm start  # Start the frontend development server
```
- The frontend runs on **http://localhost:3000**.

---

## Environment Variables

### Backend (`backend/.env`)
```ini
DATABASE_URL=postgresql://user:password@localhost:5432/email_pdf_db
```

### Frontend (`frontend/.env`)
```ini
REACT_APP_API_URL=http://localhost:5000/
```

---

## API Endpoints

### Email Configuration

#### Add Email Configuration
**POST** `/api/email-config`
```json
{
  "email": "user@example.com",
  "type": "IMAP",
  "host": "imap.example.com",
  "username": "user@example.com",
  "password": "app-password"
}
```

#### Get All Email Configurations
**GET** `/api/email-config`

#### Delete Email Configuration
**DELETE** `/api/email-config/:id`

#### Fetch Emails with PDFs
**POST** `/api/email-config/fetch-emails`
```json
{
  "startDate": "2024-02-01"  // Optional parameter
}
```

---
## Testing the Application

### 1. Add an Email Configuration
- Open the frontend at **http://localhost:3000**.
- Enter **email, IMAP Host, Email App Password**.
- Click **"Save Configuration"**.

### 2. Fetch Emails with PDFs
- Click **"Fetch"**.
- If there are new emails with PDFs, they will be **downloaded & logged**.

### 3. Verify PDFs
- PDFs are stored in **/backend/pdfs/**.
- Metadata is stored in the **PostgreSQL database**.

---

## Technologies Used 

| Technology        | Purpose                            |
|------------------|----------------------------------|
| `Node.js + Express` | Backend server                  |
| `React.js`         | Frontend UI                      |
| `Prisma ORM`      | Database management              |
| `PostgreSQL`      | Database storage                 |
| `IMAP-Simple`     | Email fetching                   |
| `React Toastify`  | Notifications                    |
| `Styled Components / CSS` | UI Design                |
