# 🍽️ Klause Backend

Klause is a scalable restaurant menu management backend built with **Node.js, Express, MongoDB, Redis, and AWS S3**.  
It supports **role-based access control** for **Admin, Owner, Manager, and Guest** users.

---

## 📌 Features

- 🏪 Restaurant creation & management
- 👥 Owner → Manager invitation workflow
- 📋 Advanced menu management (dishes, variants, extras)
- 🧾 Ingredients, allergens, additives tracking
- ⏰ Restaurant timing & availability logic
- 🌍 Multilingual API responses (i18n)
- ☁️ AWS S3 image upload with MIME validation
- ⚡ Redis-ready caching layer
- 🔐 JWT authentication + RBAC
- 🧱 Modular scalable architecture
- 🐳 Docker & Jenkins CI/CD ready

---

## 🧑‍💼 User Roles

| Role    | Permissions                                           |
| ------- | ----------------------------------------------------- |
| Admin   | Platform control, restaurant approval, tag management |
| Owner   | Create restaurant, invite managers, full menu control |
| Manager | Manage menu, dishes, variants, timings                |
| Guest   | Browse restaurants, view menu, rate, order            |

---

## 🏗️ Tech Stack

- Node.js + Express
- MongoDB + Mongoose
- Redis
- AWS S3
- JWT Authentication
- i18n (multi-language)
- Docker

---

## 📂 Project Structure
```bash
src/
├── config/ # DB, Redis, env configuration
├── constants/ # Field mappings & static values
├── controllers/ # Admin & User business logic
├── i18n/ # Multilingual JSON files
├── middlewares/ # Auth, validation, upload, error handling
├── models/ # Mongoose schemas
├── routes/ # API routes
├── services/ # Business services
├── utils/ # Helpers & response handlers
├── validators/ # Request validation schemas
├── seed/ # Seed scripts
└── index.js # App entry point
```
---

## ⚙️ Installation Guide

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/Aayan-infotech/Klause-demo-backend.git
cd Klause-demo-backend
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Environment Configuration

Create a .env file in the root directory:
```bash
NODE_ENV=
PORT=
CORS_ORIGIN=
APP_URL=
ACCESS_TOKEN_SECRET=your_jwt_token
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_SECRET=your_jwt_token
REFRESH_TOKEN_EXPIRY=30d
MONGODB_URI=

ACCESS_TOKEN_SECRET_ADMIN=your_jwt_token
REFRESH_TOKEN_SECRET_ADMIN=your_jwt_token

EMAIL_USER=  
EMAIL_PASS=

AWS_REGION=
AWS_BUCKET_NAME=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=

REDIS_HOST=
REDIS_PORT=
REDIS_USERNAME=
REDIS_PASSWORD=
```

### 4️⃣ Run the Project
Development

```bash
npm run dev
```

Production
```bash
npm start
```

Server will start on:

```bash
http://localhost:5000
```