# Expense Tracker Analyser

A high-end, full-stack personal finance application built with **Java, Spring Boot, MySQL, and React**. Featuring an intelligent analytics engine and a stunning **Vibrant Aurora** dashboard with glassmorphism.

## 🚀 Key Features

*   **Intelligent Analytics**: Automatically categorizes expenses and provides strategic financial reports with tactical recommendations.
*   **Smart Budgeting**: Dynamic budget forecasting that calculates your "Daily Allowance" and warns you in real-time when limits are breached.
*   **Vibrant Aurora UI**: A premium, colorful glassmorphic dashboard built with React and Vite, featuring smooth animations and a modern visual language.
*   **Secure Authentication**: Robust user registration and login using **JWT (JSON Web Tokens)** and BCrypt encryption.
*   **Full CRUD Operations**: Efficiently manage expenses with a clean REST API and pagination support.
*   **Interactive Documentation**: Integrated Swagger UI for easy API exploration and testing.

## 🛠 Tech Stack

### Backend
*   **Framework**: Spring Boot 2.7.x
*   **Language**: Java 8+
*   **Database**: MySQL
*   **Security**: Spring Security + JWT
*   **ORM**: Hibernate / Spring Data JPA
*   **Documentation**: Swagger UI (OpenAPI 3.0)

### Frontend
*   **Library**: React.js
*   **Build Tool**: Vite
*   **Icons**: Lucide React
*   **Charts**: Chart.js
*   **Styling**: Vanilla CSS (Custom Vibrant Glassmorphism)

## 📁 Project Structure

```text
├── src/                # Spring Boot Backend
├── frontend/           # React Frontend (Vite)
├── pom.xml             # Maven Configuration
└── .gitignore          # Git exclusion rules
```

## ⚙️ Local Setup

### 1. Database Configuration
*   Ensure MySQL is running on `localhost:3306`.
*   Create a database: `CREATE DATABASE expense_tracker;`
*   Update `src/main/resources/application.properties` with your credentials.

### 2. Run Backend
```bash
mvn spring-boot:run
```
API starts at: `http://localhost:8080`
Swagger UI: `http://localhost:8080/swagger-ui.html`

### 3. Run Frontend
```bash
cd frontend
npm install
npm run dev
```
App starts at: `http://localhost:5173`

---
*Developed as a high-end portfolio project demonstrating full-stack engineering and modern UI/UX design.*
