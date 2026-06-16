# QuickStay

QuickStay is a full-stack hotel booking platform where travelers can browse rooms, check availability, and book stays, while hotel owners can register their property, manage room listings, and track bookings from a dedicated dashboard.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Environment Variables](#environment-variables)
- [Installation](#installation)
- [Running Locally](#running-locally)
- [Frontend Routes](#frontend-routes)
- [API Endpoints](#api-endpoints)
- [Database Models](#database-models)
- [User Roles & Flows](#user-roles--flows)
- [Third-Party Integrations](#third-party-integrations)
- [Deployment](#deployment)

---

## Features

### For Guests (Users)
- Browse featured destinations on the homepage
- Search rooms by destination city from the hero section
- View all available rooms with filters (room type, price range, sort)
- View detailed room information (images, amenities, hotel details, host info)
- Check room availability by date range
- Book rooms (requires sign-in)
- View personal booking history on **My Bookings**
- Pay for bookings via **Stripe** (optional)

### For Hotel Owners
- Register a hotel after signing in
- Owner dashboard with:
  - Total bookings count
  - Total revenue
  - Recent bookings table
- Add new rooms with images (up to 4), amenities, and pricing
- List and manage all rooms
- Toggle room availability on/off

### Platform Features
- Authentication via **Clerk** (sign up / sign in)
- User sync to MongoDB via Clerk webhooks
- Image uploads via **Cloudinary**
- Booking confirmation emails via **Nodemailer** (Brevo SMTP)
- Online payments via **Stripe** with webhook support

---

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React 19, Vite 8, Tailwind CSS 4, React Router 7, Axios, React Hot Toast |
| **Backend** | Node.js, Express 5, Mongoose 9 |
| **Database** | MongoDB (`hotel-booking`) |
| **Authentication** | Clerk (`@clerk/react` + `@clerk/express`) |
| **File Storage** | Cloudinary + Multer |
| **Email** | Nodemailer (Brevo SMTP) |
| **Payments** | Stripe |
| **Deployment** | Vercel (client + server) |

---

## Project Structure

```
QuickStay/
├── client/                    # React frontend (Vite)
│   ├── public/
│   ├── src/
│   │   ├── assets/            # Images, icons, dummy data
│   │   ├── components/        # Reusable UI components
│   │   │   └── hotelOwner/    # Owner panel components
│   │   ├── context/           # AppContext (global state)
│   │   ├── pages/             # Route pages
│   │   │   └── hotelOwner/    # Dashboard, AddRoom, ListRoom
│   │   ├── App.jsx            # Main routes
│   │   └── main.jsx           # Entry point (Clerk + Router)
│   ├── package.json
│   └── vercel.json
│
├── server/                    # Express backend
│   ├── configs/               # DB, Cloudinary, Nodemailer
│   ├── controllers/           # Route logic
│   ├── middleware/            # Auth, file upload
│   ├── models/                # Mongoose schemas
│   ├── routes/                # API routes
│   ├── server.js              # App entry point
│   └── package.json
│
└── README.md
```

---

## Prerequisites

Before running the project, make sure you have:

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [MongoDB Atlas](https://www.mongodb.com/atlas) account (or local MongoDB)
- [Clerk](https://clerk.com/) account for authentication
- [Cloudinary](https://cloudinary.com/) account for image uploads
- [Brevo](https://www.brevo.com/) (or any SMTP) for booking emails
- [Stripe](https://stripe.com/) account for online payments (optional)

---

## Environment Variables

### Server (`server/.env`)

Create a `.env` file inside the `server/` folder:

```env
# Server
PORT=3000

# MongoDB
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net

# Clerk
CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SECRET=whsec_...

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email (Brevo SMTP)
SMTP_USER=your_brevo_smtp_user
SMTP_PASS=your_brevo_smtp_password
SENDER_EMAIL=your_sender@email.com

# Stripe (optional)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# App
CURRENCY=$
```

### Client (`client/.env`)

Create a `.env` file inside the `client/` folder:

```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
VITE_BACKEND_URL=http://localhost:3000
VITE_CURRENCY=$
```

> **Note:** `VITE_CLERK_PUBLISHABLE_KEY` must match `CLERK_PUBLISHABLE_KEY` on the server.

---

## Installation

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd QuickStay
```

### 2. Install server dependencies

```bash
cd server
npm install
```

### 3. Install client dependencies

```bash
cd ../client
npm install
```

---

## Running Locally

Open **two terminals**:

### Terminal 1 — Backend

```bash
cd server
npm run server
```

Server runs at: `http://localhost:3000`

### Terminal 2 — Frontend

```bash
cd client
npm run dev
```

Frontend runs at: `http://localhost:5173` (default Vite port)

---

## Frontend Routes

| Route | Page | Access |
|-------|------|--------|
| `/` | Home (Hero, Featured Destinations, Offers) | Public |
| `/rooms` | All Rooms listing with filters | Public |
| `/rooms/:id` | Room details + booking form | Public |
| `/my-bookings` | User's booking history | Authenticated |
| `/loader/:nextUrl` | Payment redirect loader | Authenticated |
| `/owner` | Owner Dashboard | Hotel Owner |
| `/owner/add-room` | Add new room | Hotel Owner |
| `/owner/list-room` | Manage room listings | Hotel Owner |

---

## API Endpoints

Base URL: `http://localhost:3000`

### User

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/user` | Yes | Get user role and recent searched cities |
| `POST` | `/api/user/store-recent-search` | Yes | Save a searched city |

### Hotels

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/hotels` | Yes | Register a new hotel |

### Rooms

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/rooms` | No | Get all available rooms (public listing) |
| `GET` | `/api/rooms/:id` | No | Get single room details |
| `GET` | `/api/rooms/owner` | Yes | Get owner's rooms |
| `POST` | `/api/rooms` | Yes | Create a room (with images) |
| `POST` | `/api/rooms/toggle-availability` | Yes | Toggle room availability |

### Bookings

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/bookings/check-availability` | No | Check if room is available for dates |
| `POST` | `/api/bookings/book` | Yes | Create a booking |
| `GET` | `/api/bookings/user` | Yes | Get logged-in user's bookings |
| `GET` | `/api/bookings/hotel` | Yes | Get hotel owner's dashboard bookings |
| `POST` | `/api/bookings/stripe-payment` | Yes | Create Stripe checkout session |

### Webhooks

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/clerk` | Clerk user sync (create/update/delete) |
| `POST` | `/api/stripe` | Stripe payment confirmation |

> Protected routes require header: `Authorization: Bearer <clerk_token>`

---

## Database Models

### User
| Field | Type | Description |
|-------|------|-------------|
| `_id` | String | Clerk user ID |
| `username` | String | Display name |
| `email` | String | Email address |
| `image` | String | Profile image URL |
| `role` | String | `user` or `hotelOwner` |
| `recentSearchedCities` | Array | Last searched cities (max 3) |

### Hotel
| Field | Type | Description |
|-------|------|-------------|
| `name` | String | Hotel name |
| `address` | String | Full address |
| `contact` | String | Phone number |
| `city` | String | City name |
| `owner` | String | User ID (hotel owner) |

### Room
| Field | Type | Description |
|-------|------|-------------|
| `hotel` | String | Hotel ID reference |
| `roomType` | String | e.g. Single Bed, Double Bed, Luxury Room |
| `pricePerNight` | Number | Price per night |
| `amenities` | Array | e.g. Free WiFi, Pool Access |
| `images` | Array | Cloudinary image URLs |
| `isAvailable` | Boolean | Room listing visibility |

### Booking
| Field | Type | Description |
|-------|------|-------------|
| `user` | String | User ID |
| `room` | String | Room ID |
| `hotel` | String | Hotel ID |
| `checkInDate` | Date | Check-in date |
| `checkOutDate` | Date | Check-out date |
| `totalPrice` | Number | Calculated total price |
| `guests` | Number | Number of guests |
| `status` | String | `pending`, `confirmed`, `cancelled` |
| `paymentMethod` | String | Default: `Pay At Hotel` |
| `isPaid` | Boolean | Payment status |

---

## User Roles & Flows

### Guest Flow
```
Sign Up / Sign In (Clerk)
    → Browse Rooms
    → Select Room → Enter Dates
    → Check Availability
    → Book Now (sign-in required)
    → View in My Bookings
    → Pay via Stripe (optional)
```

### Hotel Owner Flow
```
Sign Up / Sign In (Clerk)
    → Register Hotel (Navbar → List Your Hotel)
    → Owner Dashboard (/owner)
    → Add Rooms (images + amenities + price)
    → Manage Listings (toggle availability)
    → View Bookings & Revenue on Dashboard
```

---

## Third-Party Integrations

### Clerk (Authentication)
1. Create a Clerk application at [clerk.com](https://clerk.com)
2. Copy **Publishable Key** and **Secret Key** to `.env` files
3. Add a webhook endpoint: `https://your-server.com/api/clerk`
4. Subscribe to events: `user.created`, `user.updated`, `user.deleted`
5. Copy **Webhook Secret** to `CLERK_WEBHOOK_SECRET`

### Cloudinary (Images)
1. Create account at [cloudinary.com](https://cloudinary.com)
2. Copy `cloud_name`, `api_key`, `api_secret` to server `.env`
3. Room images are uploaded on **Add Room** and stored as URLs in MongoDB

### Brevo / Nodemailer (Email)
1. Create a Brevo account and get SMTP credentials
2. Set `SMTP_USER`, `SMTP_PASS`, and `SENDER_EMAIL` in server `.env`
3. A confirmation email is sent after each successful booking

### Stripe (Payments)
1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Add `STRIPE_SECRET_KEY` to server `.env`
3. Add webhook endpoint: `https://your-server.com/api/stripe`
4. Set `STRIPE_WEBHOOK_SECRET` in server `.env`
5. Users can pay unpaid bookings from **My Bookings** page

---

## Deployment

Both client and server include `vercel.json` for Vercel deployment.

### Client (Vercel)
```bash
cd client
npm run build
```
Deploy the `client/` folder to Vercel. Set environment variables in Vercel dashboard.

### Server (Vercel)
Deploy the `server/` folder to Vercel. Set all server environment variables in Vercel dashboard.

> For local development, use `VITE_BACKEND_URL=http://localhost:3000`.  
> For production, set it to your deployed server URL.

---

## Available Room Types

- Single Bed
- Double Bed
- Luxury Room
- Family Suite

## Available Amenities

- Free WiFi
- Free Breakfast
- Room Service
- Mountain View
- Pool Access

## Supported Cities (Hotel Registration)

- Dubai
- Singapore
- New York
- London

---

## Scripts Reference

### Client
| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

### Server
| Command | Description |
|---------|-------------|
| `npm run server` | Start with nodemon (auto-reload) |
| `npm start` | Start production server |

---

