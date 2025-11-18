# Project Proposal (MVP Phase)

## 1. Project Description

**Shuryan** is a comprehensive digital healthcare platform designed to simplify the healthcare experience for patients, doctors, laboratories, and pharmacies. The platform creates an integrated ecosystem where:

- **Patients** can discover nearby doctors, book appointments seamlessly, receive digital prescriptions, and order medicines with home delivery
- **Doctors** can manage their professional profiles and associated clinic information, conduct consultations, write digital prescriptions, and track patient medical records
	- **Clinic**: Each doctor is associated with a single clinic within the system for managing location, contact information, services, and equipment details. The clinic is not a standalone entity but exists as an integral part of the doctor's profile.
- **Laboratories** can receive lab test orders, manage sample collections, and deliver results digitally
- **Pharmacies** can fulfill medication orders and track deliveries
- **Verifiers** can validate and verify healthcare providers

The MVP focuses on core functionalities related to **Patients**, **Doctors**, and **their Clinics**.

---

## 2. Team Structure & Roles

### Team Leader

- **Abdulrhman Alaa** - Backend Developer + Project Manager

### Development Team (6 Members)

| #   | Name               | Role                   |
| --- | ------------------ | ---------------------- |
| 1   | Abdulrhman Alaa    | Backend Developer + PM |
| 2   | Mahmoud Akl        | Backend Developer      |
| 3   | Seif Elden Mohamed | Backend Developer      |
| 4   | Howida Ashraf      | Frontend Developer     |
| 5   | Mohamed Essam      | Frontend Developer     |
| 6   | Mohamed Nagy       | Frontend Developer     |

#### Backend Team Responsibilities (For Now)

**Abdulrahman Alaa & Mahmoud Akl** - Working Together

- System infrastructure setup and configuration
- System architecture design and implementation
- Backend development and API creation
- Project coordination and team management
- Database design, optimization, and management
- Repository pattern implementation
- Business logic development and implementation

> ***Seif Elden Mohamed*** is currently focusing on studying and catching up with the project progress. He participated in Phase 1 and will actively join the upcoming sprint (next week) to work on Services, JWT Authentication, Controllers, and other backend modules alongside the team.

#### Frontend Team Responsibilities (For Now)

**Mohamed Essam & Mohamed Nagy** - Working Together

- Project folders
- Architecture properly structured (components, pages, hooks, services, utils)
- Landing page development
- Responsive design implementation across all pages
- Patient, Doctor and Verifier dashboard creation
- Form development and implementation
- State management configuration and implementation
- All frontend functionalities and features

> ***Howida Ashraf*** has been studying React and other required technologies throughout the project to strengthen her technical skills. During her learning phase, she was also working on developing an **AI-based chatbot for the system**. She participated in basic tasks during Phase 1 to practice and apply her learning. With her continuous learning progress and improved technical capabilities, she will actively contribute to the upcoming project phases with stronger involvement and greater impact.

**Development Model**: Parallel Development (Backend & Frontend working simultaneously)

---

## 3. Project Objectives

1. Build a scalable, maintainable backend following **SOLID principles** and **Clean Architecture**
2. Implement a **responsive**, intuitive frontend with React ecosystem
3. Create a seamless booking and consultation experience
4. Integrate prescription management
5. Develop verification and admin dashboards
6. Ensure data security and GDPR compliance (future phase)
7. Implement real-time notifications and status tracking
8. Build comprehensive API documentation (Swagger)
9. Optimize performance and system reliability
10. Create detailed technical documentation

---

## 4. Technologies & Tools

### Backend Stack

```json
- Framework: .NET 8 (C#)
- ORM: Entity Framework Core
- Database: SQL Server
- API: RESTful Web API
- Authentication: JWT (JSON Web Tokens)
- Validation: FluentValidation
- Documentation: Swagger/OpenAPI
- Logging: Serilog (future phase)
- CI/CD: GitHub Actions (future phase)
```

### Frontend Stack

```json
- Library: React 19
- Routing: React Router DOM v6
- State Management: TanStack Query (React Query)
- Form Handling: Formik
- Styling: Tailwind CSS + Material UI
- Animations: Framer Motion
- Icons: React Icons
- Alerts/Modals: SweetAlert2
- Mocking: json-server
- JWT Decoding: jwt-decode
- Package Manager: npm
```

<div class="page-break"></div>

### Development & DevOps Tools

```json
- Version Control: Git + GitHub
- CI/CD: GitHub Actions
- API Testing: Postman/Swagger
- Database: SQL Server Management Studio
- IDEs: Visual Studio, VS Code
- Project Management: Trello (Sprints)
- Documentation: Markdown
- Meetings: Discord
```

---

## 5. Project Phases & Milestones

> [!bug] **Important Clarification**  
> Some of the additions within each phase may be classified as _future tasks_, but we include them in the corresponding phase to keep the plan aligned and organized.  
> Please note that both **tasks and timelines** are subject to change at any time based on the project’s actual progress and current circumstances.


### Phase 1: Foundation & Infrastructure

Status: **<font color="#00b050">COMPLETED</font>**

#### Backend

- System Requirements (SRS) Document
- Solution Architecture & Project Structure
- User Flow Diagrams
- Entity Framework Core configurations
- Base classes Implementation (AuditableEntity, SoftDeletableEntity)
- All 40+ entity models with their Configurations
- Database Context (ShuryanDbContext)
- Entity Configuration using Fluent API
- CORS Configuration
- Environment setup (Development, Production)

##### Completed by: Abdulrahman Alaa, Mahmoud Akl, Seif Elden Mohamed

#### Frontend

- Landing Page UI
- Login Page UI
- Register Page UI
- Protected Routes
- Responsive Design (Mobile, Tablet, Desktop)
- Component Structure Setup
- Tailwind CSS & Material UI Integration
- Form Components & Validation Setup

##### Completed by: Mohamed Essam, Mohamed Nagy, Howida Ashraf

---

<div class="page-break"></div>

### Current Phase (Phase 2: Backend Foundation Services & Infrastructure)

Status: **<font color="#e36c09">COMPLETED</font>**

**Deadline**: 23/10/2025

### Objectives

1. Build core services with business logic
2. Implement comprehensive input validation
3. Create repository pattern with UnitOfWork
4. Setup dependency injection
5. Create DTOs for all API contracts
6. Build extension methods for clean code
7. Implement mappers (AutoMapper)
8. Create base controller structure
9. Setup global error handling

### Backend Deliverables

- Validation Services (FluentValidation)
- Repository Implementations (Generic + Specific)
- UnitOfWork Pattern Implementation
- Service Layer (Business Logic)
- AutoMapper Configuration
- DTOs (Request/Response) for All Entities
- Extension Methods for Queries & Strings
- Dependency Injection Setup
- Base Controller with Common Methods
- Global Exception Handling Middleware
- Logging Infrastructure
- Database Seeders (Test Data)

### Frontend Deliverables

- Doctor Dashboard Layout
- Doctor Profile Pages (Personal Information)
- Doctor Profile Pages (Professional Information)
- Doctor Profile Pages (Clinic Information)
- Appointment Settings UI
- Appointment Management Interface
- Today's Patients & Bookings View
- Navigation & Routing Setup
- State Management Configuration
- Reusable Components Library
- Error Boundaries & Loading States
- API Service Layer Setup (for future endpoints)
 

### Phase 3: Authentication & User Management 

**Duration**: 10-14 Days | **Deadline**: ~04/11/2025

#### Backend

- Authentication Controllers (Register, Login, Logout)
- JWT Token Service (Generation, Validation, Refresh)
- Registration Validators & Business Rules
- Password Management (Hashing, Reset, Change)
- Email Verification Service
- Account Lockout Mechanism (5 attempts)
- Profile Management Endpoints
- Role-Based Authorization (Patient, Doctor, Admin, Verifier)

#### Frontend

- Login Form with Validation
- Register Form with Validation
- Password Reset Flow
- Token Storage & Management (jwt-decode)
- Protected Routes
- Role-Based Navigation
- Session Management

---

### Phase 4: Core Features (Advanced Endpoints) - Doctor Management & Discovery 

**Duration**: 7-9 Days | **Deadline**: ~13/11/2025

#### Backend

- Doctor Profile Management (CRUD + Advanced)
- Document Upload Service (Verification Documents)
- Doctor Verification System
- Advanced Doctor Search (by specialty, location, rating)
- Filters (price range, years of experience, insurance)
- Ratings & Reviews System
- Clinic Information Management
- Doctor Availability Setup
- Professional Credentials Management

#### Frontend

- Doctor Search & Discovery Page
- Doctor Profile View Page
- Doctor Ratings & Reviews Display
- Search Filters UI
- Clinic Information Display
- Responsive Cards & Layouts

---

### Phase 5: Core Features (Advanced Endpoints) - Appointment Booking System

**Duration**: 5-7 Days | **Deadline**: ~20/11/2025

#### Backend

- Appointment Booking API
- Doctor Availability Management (Daily Schedules)
- Doctor Overrides (Special dates)
- Appointment Status Management
- Consultation Record Creation
- Appointment Modification (Reschedule up to 4 hours before)
- Appointment Cancellation with Refund Logic
- No-Show Detection & Handling
- Notification Service (Email Confirmations)
- Appointment History & Tracking

<div class="page-break"></div>

#### Frontend

- Appointment Booking Interface
- Calendar View (3 weeks ahead)
- Time Slot Selection
- Booking Confirmation
- Appointment History Page
- Reschedule & Cancel Options
- Appointment Status Tracking

---

### Phase 6: Prescriptions & Medications

**Duration**: 5-7 Days | **Deadline**: ~27/11/2025

#### Backend

- Digital Prescription Creation API
- Medication Database with Brand & Generic Names
- Drug Interaction Checking
- Dosage Validation
- Smart Pharmacy Selection Algorithm (40% availability, 25% distance, 15% speed, 10% price, 10% rating)
- Prescription Sharing to Patient
- Prescription-to-Pharmacy Workflow
- Pharmacy Order Creation
- Delivery Tracking System
- Medication Adherence Reminders

#### Frontend

- Prescription View & Management
- Pharmacy Selection UI (showing 3 options with pricing)
- Order Tracking Page
- Delivery Status Updates
- Medication Adherence Reminders

---

### Phase 7: Laboratory Services

**Duration**: 5-7 Days | **Deadline**: ~04/12/2025

#### Backend

- Lab Test Catalog (50+ tests)
- Lab Test Ordering API
- Lab Order Management
- Sample Collection Scheduling (Home or Clinic)
- Lab Results Upload & Management
- Results Notification Service
- Lab Review System (1-5 stars)
- Lab Search & Filtering

#### Frontend

- Lab Test Search & Selection
- Order Creation Interface
- Sample Collection Scheduling
- Results View Page
- Lab Review Form

<div class="page-break"></div>

### Phase 8: Admin & Verification Dashboard

**Duration**: 4-7 Days | **Deadline**: ~11/12/2025

#### Backend

- Admin Dashboard APIs
- Verification Workflow Endpoints
- Document Review API
- User Management APIs
- Analytics & Reporting Endpoints
- System Health Monitoring
- Approval/Rejection Logic

#### Frontend

- Admin Dashboard Layout
- Pending Verifications Queue
- Document Review Interface
- Approval/Rejection Forms with Feedback
- Analytics Dashboard (Charts, Metrics)
- User Management Interface
- System Health Monitoring Display

---

### Phase 9: Documentation & Final Delivery (2 Days)

**Duration**: 2-3 Days | **Deadline**: ~15/12/2025

#### Objectives

1. Complete API Documentation
2. Create Technical Documentation
3. Write User Guides
4. Generate Architecture Diagrams

---

## 6. Key Performance Indicators (KPIs)

### 1. System Functionality Completion Rate

**Target**: 70%+

**Metrics**:

- Features fully implemented and tested: *IDK Yet :)*
- All CRUD operations working correctly
- All integrations functional

**Success Criteria**:

- All endpoints respond correctly
- Database operations accurate
- Business logic implemented as per requirements
- Error handling comprehensive

---

<div class="page-break"></div>

### 2. Code Quality & Architecture Compliance Score

**Target**: 95%+

**Metrics**:

- SOLID Principles adherence: 100%
- Code Duplication: < 3% approx.
- Architecture layers properly separated

**Success Criteria**:

- Repository pattern correctly implemented
- Dependency injection properly configured
- DTOs used for all API responses
- No tight coupling between layers
- Clean code practices followed
- Naming conventions consistent

---

### 3. Testing & Reliability Rate

**Target**: 85%+

> At this stage, it’s too hard to define even preliminary or experimental target values for testing and reliability. These metrics will be determined later, after the team conducts actual testing and evaluation during hands-on implementation.

---

### 4. Performance & Efficiency Rate

**Target:** High responsiveness and overall system efficiency.

**Metrics:**
- API response time should remain consistently fast.
- Database queries optimized with proper indexing.
- Frontend should load quickly and feel responsive.
- Memory usage stays within reasonable limits.

**Success Criteria:**
- No major N+1 query issues.
- Proper indexing on frequently queried fields.
- Pagination planned and to be validated later.
- Caching strategy applied.
- Frontend bundle optimized.

---

### 5. Error or Defect Rate

**Target**: Minimal error rate, ان شاء الله

**Metrics**:

- Critical bugs avoided completely.
- All detected bugs resolved before deployment.

**Success Criteria**:

- Proper error logging
- Exception handling comprehensive
- Input validation on all endpoints
- Security vulnerabilities: -> Will handled lated :)

---

