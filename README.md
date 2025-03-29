
# RentnRide: Feature-Rich Car Rental Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) <!-- Optional: Add license badge -->
[![Status: Active](https://img.shields.io/badge/Status-Active-brightgreen)]() <!-- Optional: Indicate project status -->

RentnRide is a comprehensive, web-based car rental platform connecting car owners (Hosts) with renters (Users). It provides dedicated interfaces for Users, Hosts, and Administrators, offering a seamless experience for booking management, listing administration, secure payments, and platform oversight.

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
  - [User Features](#user-features)
  - [Host Features](#host-features)
  - [Admin Features](#admin-features)
- [Live Demo](#live-demo)
- [Technology Stack](#technology-stack)
- [Architecture Overview](#architecture-overview)
- [Folder Structure](#folder-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [API Endpoint](#api-endpoint)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

RentnRide aims to simplify the car rental process. Users can easily browse, filter, and book vehicles for their desired duration and location. Hosts can effortlessly list their vehicles, manage bookings, and track earnings. Administrators ensure platform integrity by managing listings, users, reviews, and system metadata. Secure payments are handled via Stripe integration.

---

## Key Features

### User Features

*   **Vehicle Discovery:** Search, filter (by fuel type, make, model, price, location, ratings), and browse available cars.
*   **Seamless Booking:** Select dates, view pricing, and book vehicles securely.
*   **Booking Management:** Access upcoming and past bookings; options to extend or cancel reservations.
*   **Review System:** Provide feedback on rented vehicles and the rental experience.
*   **Secure Payments:** Integrated Stripe payment gateway for reliable transactions.
*   **Payment History:** View transaction history and download invoices.
*   **Profile Management:** Update personal details, profile picture, and preferences.
*   **Customer Support:** Dedicated contact form for inquiries.
*   **Transparency:** Clear Terms and Conditions readily available.

### Host Features

*   **Vehicle Listing:** Create detailed car listings with descriptions, images, pricing, and availability.
*   **Listing Management:** Update existing listings (details, pricing, availability) or remove them.
*   **Booking Oversight:** Monitor active, upcoming, and past bookings for listed vehicles.
*   **Earnings Dashboard:** Track total earnings generated from rentals.
*   **Reporting:** Download booking lists in PDF format for record-keeping.
*   **Profile Management:** Manage account information and profile picture.
*   **Performance Dashboard:** View key statistics (total cars, verified cars, bookings, earnings).
*   **Vehicle Metadata:** Define vehicle specifics using pre-approved types (fuel, make, model, transmission).

### Admin Features

*   **Platform Dashboard:** Central overview of key metrics (total users, cars, verified/unverified listings, bookings).
*   **Listing Approval:** Review, approve, or reject car listings submitted by Hosts (view documents like insurance/RC book, provide rejection reasons).
*   **User Management:** View and manage registered user accounts and details.
*   **Rental Monitoring:** Access comprehensive rental history and monitor currently active rentals.
*   **Payment Oversight:** View all platform payment transactions.
*   **Content Moderation:** Manage user-submitted reviews (approve/delete).
*   **Support Management:** Handle customer support inquiries submitted via the platform.
*   **System Metadata Control:** Manage allowed vehicle attributes (fuel types, makes, models, transmission types) available to Hosts during listing creation.

---

## Live Demo

Explore the different interfaces of RentnRide:

*   **User Interface:** [https://rentnride-user.netlify.app/](https://rentnride-user.netlify.app/)
*   **Host Panel:** [https://rentnride-host.netlify.app/](https://rentnride-host.netlify.app/)
*   **Admin Panel:** [https://rentnride-admin.netlify.app/](https://rentnride-admin.netlify.app/)
    *   *Demo Credentials:* Username: `admin@mail.com` | Password: `123123`

*(Note: These are demo environments. Data may be reset periodically.)*

---

## Technology Stack

*   **Frontend (User, Host, Admin):**
    *   React.js (with Vite for build tooling)
    *   JavaScript (ES6+)
    *   HTML5, CSS3
    *   Tailwind CSS (Utility-first styling)
    *   Ant Design (antd) (UI Component Library)
    *   React Router (Client-side routing)
    *   Axios (HTTP client)
    *   JWT Decode (for token handling)
*   **Backend:**
    *   Node.js
    *   Express.js (Web framework)
    *   MongoDB Atlas (Cloud NoSQL Database) with Mongoose (ODM)
    *   JSON Web Tokens (JWT) (Authentication & Authorization)
    *   Bcrypt.js (Password hashing)
    *   Multer (File upload handling)
    *   Firebase Admin SDK (Potentially for additional services like notifications or storage)
    *   React-PDF (Server-side PDF generation for booking lists)
*   **Payments:**
    *   Stripe API
*   **Deployment:**
    *   Frontend: Netlify
    *   Backend: Render

---

## Architecture Overview

RentnRide employs a client-server architecture:

1.  **Multiple Frontends:** Separate React applications built for Users, Hosts, and Administrators, optimized for their specific workflows.
2.  **Centralized Backend API:** A single Node.js/Express.js application serves as the API endpoint for all frontend applications. It handles business logic, database interactions, authentication, payment processing, and communication with external services.
3.  **Database:** MongoDB Atlas stores all application data, including user information, car listings, bookings, and reviews.

---

## Folder Structure

```
RentnRide/
├── backend/             # Node.js/Express API Server
│   ├── config/          # Configuration files (database, keys)
│   ├── controllers/     # Request handling logic
│   ├── middleware/      # Custom middleware (auth, error handling)
│   ├── models/          # Mongoose schemas/models
│   ├── routes/          # API route definitions
│   ├── utils/           # Utility functions
│   ├── node_modules/
│   ├── .env.example     # Environment variable template
│   ├── package.json
│   └── server.js        # Server entry point
│
└── frontend/
    ├── admin/           # React Admin Panel application
    │   ├── public/
    │   ├── src/
    │   ├── node_modules/
    │   ├── package.json
    │   └── vite.config.js # Or relevant build config
    │
    ├── host/            # React Host Panel application
    │   ├── public/
    │   ├── src/
    │   ├── node_modules/
    │   ├── package.json
    │   └── vite.config.js
    │
    └── user/            # React User Interface application
        ├── public/
        ├── src/
        ├── node_modules/
        ├── package.json
        └── vite.config.js

```

---

## Prerequisites

Before you begin, ensure you have the following installed:

*   [Node.js](https://nodejs.org/) (LTS version recommended)
*   [npm](https://www.npmjs.com/) (usually comes with Node.js) or [Yarn](https://yarnpkg.com/)
*   [Git](https://git-scm.com/)
*   [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account (or a local MongoDB instance)
*   [Stripe](https://stripe.com/) account for payment processing keys
*   [Firebase](https://firebase.google.com/) project (if using Firebase services)

---

## Installation

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd RentnRide
    ```

2.  **Backend Setup:**
    ```bash
    cd backend
    npm install
    ```
    *   Create a `.env` file in the `backend` directory (you can copy `.env.example`).
    *   Populate the `.env` file with your specific configuration:
        *   `MONGODB_URI`: Your MongoDB connection string.
        *   `JWT_SECRET`: A strong secret key for signing tokens.
        *   `STRIPE_SECRET_KEY`: Your Stripe secret API key.
        *   `FIREBASE_SERVICE_ACCOUNT`: Path to your Firebase Admin SDK credentials file (if applicable).
        *   `PORT`: The port the backend server will run on (e.g., 5000).
        *   *(Add any other necessary environment variables)*

3.  **Frontend Setup (Repeat for `admin`, `host`, and `user` directories):**
    ```bash
    cd ../frontend/admin  # Or host, or user
    npm install
    ```
    *   Ensure the frontend applications are configured to point to the correct backend API URL (this might be in a `.env` file or a configuration file within `src/`). Look for variables like `VITE_API_BASE_URL`.

---

## Running the Application

1.  **Start the Backend Server:**
    ```bash
    cd backend
    npm run dev  # Or your configured start script (e.g., npm start)
    ```
    The backend API should now be running (e.g., on `http://localhost:5000`).

2.  **Start the Frontend Development Servers (Open separate terminals for each):**
    ```bash
    # Terminal 1: Admin Panel
    cd frontend/admin
    npm run dev

    # Terminal 2: Host Panel
    cd frontend/host
    npm run dev

    # Terminal 3: User Interface
    cd frontend/user
    npm run dev
    ```
    The frontend applications should now be accessible in your browser, typically on ports like `5173`, `5174`, `5175` (Vite's default behaviour might vary). Check the terminal output for the exact URLs.

---

## API Endpoint

*   **Backend Base URL:** The backend API is hosted at [https://vehiclerental-y81w.onrender.com](https://vehiclerental-y81w.onrender.com). The frontend applications are configured to interact with this endpoint.

---

## Contributing

Contributions are welcome! If you'd like to contribute, please follow these steps:

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/your-feature-name`).
3.  Make your changes.
4.  Commit your changes (`git commit -m 'Add some feature'`).
5.  Push to the branch (`git push origin feature/your-feature-name`).
6.  Open a Pull Request.

Please ensure your code adheres to the project's coding standards and includes relevant tests if applicable.

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details (You would need to add a LICENSE file to your repo).

---
