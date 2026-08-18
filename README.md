# Gym Management System

A full-stack MERN application for managing gym members, memberships, payments, reminders, and day-to-day gym operations.

## Features

* 🔐 User authentication and protected application access
* 👥 Member registration and member management
* 💳 Payment management and payment history
* 📊 Dashboard with gym management statistics
* 🔔 Reminder management
* ⚙️ Gym and application settings
* 📱 Responsive user interface
* 🔗 REST API-based frontend and backend communication

## Tech Stack

### Frontend
- React
- Next.js
- TypeScript

### Backend
- Node.js
- Express.js
- TypeScript

### Database
- MongoDB

### Other
- REST APIs
- JWT Authentication
- Git & GitHub

## Project Structure

```text
gym-management-system/
│
├── gym-app-frontend/
│   ├── app/
│   ├── components/
│   ├── lib/
│   ├── public/
│   └── package.json
│
├── gym-tracker-backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── crud/
│   │   ├── db/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── schemas/
│   │   └── services/
│   ├── index.ts
│   └── package.json
│
└── .gitignore
```

## Getting Started

### Prerequisites

Make sure you have installed:

* Node.js
* npm
* Git

### 1. Clone the Repository

```bash
git clone https://github.com/SankarA24/gym-management-system.git
cd gym-management-system
```

### 2. Setup the Backend

```bash
cd gym-tracker-backend
npm install
```

Start the backend using the project's configured npm script:

```bash
npm run dev
```

### 3. Setup the Frontend

Open another terminal:

```bash
cd gym-app-frontend
npm install
npm run dev
```

The frontend can then be accessed through the local development URL shown by Next.js.

## Environment Variables

Create the required `.env` files locally according to your development environment.

Do not commit passwords, API keys, database credentials, JWT secrets, or other sensitive information to GitHub.

## Future Enhancements

* 📱 Mobile application integration
* 📈 Advanced analytics and reporting
* 🔔 Automated membership expiry notifications
* 💰 Improved payment and subscription management
* 📊 Detailed gym performance reports
* ☁️ Cloud deployment

## Author

**Sankar A**

GitHub: [SankarA24](https://github.com/SankarA24)
