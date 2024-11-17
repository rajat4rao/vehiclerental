# RentnRide

Welcome to RentnRide, a comprehensive car rental platform designed for both users and hosts. RentnRide offers a seamless and user-friendly experience for booking rental cars, managing listings, and connecting car owners with renters.

## Table of Contents

- [Features](#features)
- [Demo](#demo)
- [Tech Stack](#tech-stack)
- [Folder Structure](#folder-structure)
- [Database Schema](#database-schema)
- [Usage](#usage)
- [Installation](#installation)


## Features

### User Features

- **Car Booking:** Easily search and book cars for desired dates and locations.
- **Booking Management:** View, extend, and cancel upcoming and past bookings.
- **Review System:** Leave reviews for rented cars and overall experience.
- **Advanced Filtering:** Filter cars based on fuel type, make, model, price, location, and ratings.
- **Search Bar:** Quickly find cars using keywords (name, make, model).
- **Secure Payment:** Integrated Stripe payment gateway for secure transactions.
- **Profile Management:** Update personal information, profile picture, and location preferences.
- **Payment History:** Access a detailed history of past payments and download invoices.
- **Customer Support:** Contact support via a dedicated contact form.
- **Terms and Conditions:** Clearly defined terms and conditions for transparency.

### Host Features

- **Car Listing:** Add cars to the platform with detailed descriptions and images.
- **Listing Management:** Edit car details (price, location, availability) and delete listings.
- **Booking Management:** View active, upcoming, and past bookings.
- **Earnings Tracking:** Monitor total earnings from car rentals.
- **Booking List Download:** Download booking lists in PDF format for record-keeping.
- **Profile Management:** Update account details and profile picture.
- **Dashboard:** Overview of key statistics like total cars, verified cars, bookings, and earnings.
- **Vehicle Metadata Management:** Add and update allowed vehicle types (fuel, make, model, transmission).


### Admin Features

- **Dashboard:**  Overview of key platform metrics (total cars, verified/unverified cars, bookings).
- **Car Management:** Approve or reject car listings submitted by hosts.  View car details including insurance and RC book documents.  Provide rejection reasons.
- **User Management:** View a list of all registered users with their details.
- **Rental History:** Access a comprehensive history of all rental transactions.
- **Active Rentals:** Monitor currently active rental agreements.
- **Payment History:** View all completed payment transactions.
- **Review Moderation:** Moderate user reviews.  Approve or delete reviews.
- **Customer Support:** Manage customer support inquiries through a dedicated interface.
- **Vehicle Metadata Management:** Add, edit, and delete allowed fuel types, makes, models, and transmission types.  This provides control over the available options for hosts when listing cars.

## Demo

- **Admin Panel:** [https://rentnride-admin.netlify.app/](https://rentnride-admin.netlify.app/)   - Username: admin@mail.com Password : 123123
- **User Interface:** [https://rentnride-user.netlify.app/](https://rentnride-user.netlify.app/)
- **Host Panel:** [https://rentnride-host.netlify.app/](https://rentnride-host.netlify.app/)


## API Endpoints 

- **Backend Base URL:** [https://vehiclerental-y81w.onrender.com](https://vehiclerental-y81w.onrender.com)

## Tech Stack

### Frontend (User & Host)

- **HTML, CSS, JavaScript:** Core web technologies.
- **React.js:**  Component-based UI library.
- **Vite:** Fast build tool.
- **Tailwind CSS:** Utility-first CSS framework.
- **Ant Design (antd):**  UI component library for React.
- **JWT Authentication:** Authentication.
- **Multer Storage:** Image storage.
- **React Router:** Navigation.
- **Axios:** HTTP client for API communication.

### Backend (User & Host)

- **Node.js:** JavaScript runtime environment.
- **Express.js:** Web application framework.
- **MongoDB Atlas:** Cloud-based NoSQL database.
- **Firebase Admin SDK:** Server-side access to Firebase services.
- **React-PDF:** PDF generation for host booking lists.
- **Stripe API:** Payment processing integration.


## Folder Structure

RentnRide/
├── frontend/
│ ├── admin/ (Admin Panel)
│ ├── host/ (Host Panel)
│ └── user/ (User Interface)
└── backend/ (Shared backend or separate backend folders for admin, host, user)



## Usage

RentnRide aims to provide a convenient and efficient platform for car rentals. Users can easily find and book cars that meet their needs, while hosts can monetize their vehicles during idle times. The platform facilitates secure transactions, encourages transparency through reviews, and provides helpful resources like customer support and service center locations.


## Installation

### Frontend

1. Navigate to the respective frontend directory (admin, host, or user).
2. Run `npm install` to install dependencies.
3. Run `npm run dev` to start the development server.


### Backend

1. Navigate to the backend directory.
2. Run `npm install` to install dependencies.
3. Configure environment variables (database connection, API keys, etc.).
4. Run `npm run dev` to start the backend server.
