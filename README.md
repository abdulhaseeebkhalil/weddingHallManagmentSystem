# 🏰 Wedding Hall Management System

A comprehensive, full-stack web application designed to streamline the operations of a wedding hall. This system provides a centralized platform to manage bookings, track expenses, handle staff roles, and oversee daily activities with an intuitive dashboard.

---

## ✨ Features

- **User Authentication & Role Management:** Secure login system with customizable roles (Admin, Manager, Staff) and specific permissions for accessing different modules.
- **Booking Management:** Easily schedule and manage new events, track availability, and prevent double-booking.
- **Interactive Dashboard:** View real-time statistics, upcoming events, and quick actions right from the home screen.
- **Financial Tracking:** Built-in tools for tracking expenses and payments to maintain clear financial records.
- **Responsive Design:** A beautiful, responsive frontend that works seamlessly across desktops and tablets.

## 🛠️ Tech Stack

**Frontend (Client):**
- React
- Vite (for fast builds & hot-reloading)
- React Router (Navigation)

**Backend (Server):**
- Node.js & Express.js
- MongoDB (Database)
- Mongoose (Object Data Modeling)
- JSON Web Tokens (Authentication)

---

## 🚀 Getting Started

Follow these steps to set up the project locally on your machine.

### Prerequisites
- [Node.js](https://nodejs.org/) installed
- [MongoDB](https://www.mongodb.com/try/download/community) installed and running

### 1. Clone the repository
```bash
git clone https://github.com/abdulhaseeebkhalil/weddingHallManagmentSystem.git
cd weddingHallManagmentSystem
```

### 2. Backend Setup
1. Navigate to the server folder:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   Create a `.env` file in the `server` directory and add your configurations (e.g., `PORT`, `MONGO_URI`, `JWT_SECRET`).
   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/wedding_hall_db
   JWT_SECRET=your_super_secret_key
   ```
4. Start the backend server:
   ```bash
   npm run dev
   ```

### 3. Frontend Setup
1. Open a new terminal and navigate to the client folder:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the frontend development server:
   ```bash
   npm run dev
   ```

### 4. Open the App
Visit `http://localhost:5173` in your browser. The frontend will communicate with the backend running on `http://localhost:5000`.

---

## 🤝 Contributing

Contributions, issues and feature requests are welcome!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open-source and free to use.

---
*Built with ❤️ for better event management.*
