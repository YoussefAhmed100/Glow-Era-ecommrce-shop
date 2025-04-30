# Glow Era - Backend

Glow Era is a skincare product e-commerce backend that helps users find personalized product recommendations based on their skin type. This backend is built using Express.js, MongoDB, and JWT for authentication, integrates Stripe for secure payments, and uses Cloudinary for image uploading and hosting.

## Features

- 🧴 Personalized skincare product recommendation
- 🔐 Authentication system (Register/Login using JWT)
- 🧾 RESTful API structure following MVC architecture
- 🛒 Shopping cart and order management
- 💳 Stripe payment integration
- ☁️ Cloudinary image upload & storage
- 🧠 Skin type-based product suggestion logic

## Tech Stack

- **Node.js** + **Express.js** (REST API backend)
- **MongoDB** (Database)
- **Mongoose** (ODM for MongoDB)
- **JWT** (Authentication)
- **Stripe API** (Payment processing)
- **Cloudinary** (Image hosting and management)
- **Multer** (Middleware for handling file uploads)
- **MVC Architecture**

## Folder Structure (MVC)


## Getting Started

### Prerequisites

- Node.js v20+
- MongoDB (local or MongoDB Atlas)
- Stripe account (for payments)
- Cloudinary account (for image uploads)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/YoussefAhmed100/Glow-Era-ecommrce-shop.git
cd glow-era-backend
npm install

# Server
# .env
PORT=8000
NODE_ENV=development
BASE_URL=http://localhost:8000
PRODUCTION_URL=https://your-production-url.com

# MongoDB
MONGO_URL=your_mongodb_connection_string

# JWT Authentication
JWT_SECRET_KEY=your_jwt_secret_key
JWT_REFRESH_SECRET=your_refresh_token_secret
JWT_EXPIRE_TIME=7d
JWT_REFRESH_EXPIRE_TIME=7d
COOKIE_MAX_AGE=604800000

# Email (SMTP)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=465
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password_or_app_password

# Cloudinary
CLOUDINARY_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Stripe
STRIPE_SECRET=your_stripe_secret_key


