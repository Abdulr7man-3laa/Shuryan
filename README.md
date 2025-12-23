# ShurYan | شُريان 

[![Project Status: MVP 1.0](https://img.shields.io/badge/Status-MVP%201.0-brightgreen)](https://github.com/Abdulr7man-3laa/Shuryan)
[![Framework: .NET Core](https://img.shields.io/badge/Backend-.NET%20Core-512bd4)](https://dotnet.microsoft.com/en-us/apps/aspnet)
[![Framework: React](https://img.shields.io/badge/Frontend-React%2018-61dafb)](https://reactjs.org/)
[![Database: SQL Server](https://img.shields.io/badge/Database-SQL%20Server-red)](https://www.microsoft.com/en-us/sql-server/)

**Shuryan (شُريان)** is a comprehensive, state-of-the-art healthcare platform designed to bridge the gap between patients, doctors, pharmacies, and laboratories. Built with a focus on accessibility, efficiency, and security, Shuryan provides a seamless treatment journey for all parties involved.

---

## 🚀 Key Modules & Features

### 👤 Patient Experience
* **Smart Discovery**: Find the best doctors based on specialty, location, and reviews.
* **Appointment Management**: Book, reschedule, and track medical visits.
* **Digital Health Records**: Access prescriptions, lab orders, and test results anytime.
* **AI Health Assistant**: Integrated ChatBot for medical guidance and symptom checking.
* **Pharmacy & Lab Integration**: Send prescriptions directly to pharmacies and book lab tests.
* **Secure Payments**: Integrated Paymob gateway for seamless consultation fees.

### 👨‍⚕️ Healthcare Providers (Doctors)
* **Comprehensive Dashboard**: Real-time stats on appointments, patients, and revenue.
* **Patient Management**: Full access to patient history and previous consultation records.
* **Digital Prescriptions**: Generate electronic prescriptions and lab orders in seconds.
* **Schedule Control**: Precise management of clinic hours and service availability.

### 💊 Pharmacy & Laboratory Services
* **Order Management**: Real-time updates on medication orders and lab test requests.
* **Service Catalogs**: Manage available medications, tests, and pricing.
* **Results Portal**: Securely upload and share lab results with patients and doctors.
* **Service Catalog**: List available tests and manage laboratory orders.

### 🛡️ System Verification
* **Trust & Safety**: dedicated module for verifying healthcare providers and facilities.
* **Document Review**: Rigorous verification of licenses and certifications.

---

## 🛠️ Technology Stack

| Category         | Backend                        | Frontend                     |
|:---------------- |:------------------------------ |:---------------------------- |
| **Framework**    | .NET Core 8 / ASP.NET Core     | React 18 + Vite              |
| **Architecture** | Clean Architecture             | Component-Based Architecture |
| **Security**     | JWT, Identity, RBAC            | JWT (LocalStorage/Zustand)   |
| **Real-time**    | SignalR (Chat & Notifications) | SignalR Client               |
| **Storage**      | Cloudinary (Files/Images)      | -                            |
| **Payment**      | Paymob Integration             | -                            |
| **Styling**      | -                              | Tailwind CSS                 |
| **State Mgmt**   | -                              | Zustand                      |

---

## 🏗️ Technical Architecture

Shuryan follows the **Clean Architecture** pattern to ensure scalability, maintainability, and testability.

* **Domain**: Entities, Enums, and Core logic.
* **Application**: DTOs, Mappers, Business Rules, and Abstractions.
* **Infrastructure**: Entity Framework Core implementation, External Services (Cloudinary, Paymob).
* **Web API**: RESTful endpoints and request handling.

---

## 📦 Project Structure

```text
ShuryanFullProject/
├── ShurYan-Backend/             # .NET Core Solution
│   ├── src/
│   │   ├── Shuryan.API/         # API Controllers
│   │   ├── Shuryan.Application/ # Business Logic
│   │   ├── Shuryan.Core/        # Domain Entities
│   │   └── Shuryan.Infra/       # Data & External Integrations
│   │
├── ShurYan-Frontend/            # React + Vite Application
│   ├── src/
│   │   ├── components/          # Reusable UI Components
│   │   ├── features/            # Role-based Modules
│   │   ├── hooks/               # Custom React Hooks
└── └── └── services/            # API Interaction Logic
```

---

## 🛠️ Setup & Installation

### Backend Setup
1. Navigate to `ShurYan-Backend`.
2. Update `appsettings.json` with your **SQL Server Connection String** and **Cloudinary/Paymob/JWT** credentials.
3. Run migrations: `dotnet ef database update --project src/Shuryan.Infrastructure --startup-project src/Shuryan.API`
4. Start the server: `dotnet run --project src/Shuryan.API`

### Frontend Setup
1. Navigate to `ShurYan-Frontend`.
2. Install dependencies: `npm install`
3. Create a `.env` file based on `.env.example` and set `VITE_API_URL`.
4. Start development server: `npm run dev`

---

## **Live Demo:** [ShurYan \| شُريان](https://shuryan-healthcare.netlify.app/)

---

## 📜 License & Acknowledgments

This project is developed by ShurYan team. All rights reserved.
Built with ❤️ for a healthier future.
