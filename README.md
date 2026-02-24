<div align="center">

# 🍽️ Klause Backend

### Enterprise-Grade Restaurant Menu Management API  
Built with **Node.js | Express | MongoDB | Redis | AWS S3**

---

🚀 Scalable • 🔐 Secure • 🌍 Multilingual • ☁️ Cloud Ready

</div>

---


# 📌 Project Description

Klause Backend is a scalable and secure API system designed to manage restaurant operations digitally.  
It enables **Owners** to create and manage restaurants, **Managers** to handle day-to-day menu operations through invitation-based access, and **Guests** to browse restaurants, view menus, rate, and place orders.

The platform is built with a modular architecture, multilingual support, AWS S3 integration, and Redis-ready caching for high performance and scalability.

---

# ✨ Core Features

- 🔐 JWT Authentication (Admin & User)
- 👥 Role-Based Access Control (Admin, Owner, Manager, Guest)
- 🏪 Restaurant Creation & Management
- 📋 Advanced Menu Management (Dishes, Variants, Extras)
- 🧾 Ingredients, Allergens & Additives Tracking
- ⏰ Restaurant Timing & Availability Logic
- 🌍 Multilingual API Responses (i18n)
- ☁️ AWS S3 File Upload with MIME Validation
- ⚡ Redis Integration (Performance Ready)
- 📧 Email Service Integration
- ⚙️ Environment-Based Configuration
- 🐳 Docker Support
- 🔄 CI/CD Ready (Jenkins)

---

# 🏗 Architecture Highlights

- Modular Express Architecture  
- Clean Separation of Concerns  
- Service Layer Abstraction  
- Centralized Error Handling  
- Request Validation Layer  
- Standardized API Response Format  
- Production-Ready Folder Structure  

---

# 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
Framework | Express.js |
Language | Node.js (ES Modules) |
Database | MongoDB (Mongoose) |
Caching | Redis (ioredis) |
Authentication | JWT |
Cloud Storage | AWS S3 |
Validation | Joi |
Email | Nodemailer |
DevOps | Docker + Jenkins |
Architecture | Modular & Scalable |

---

# 📦 Main Dependencies

| Package | Purpose |
|----------|----------|
express | Web framework |
mongoose | MongoDB ORM |
jsonwebtoken | JWT authentication |
bcrypt | Password hashing |
joi | Request validation |
ioredis | Redis client |
multer + multer-s3 | File upload to AWS S3 |
@aws-sdk/client-s3 | AWS S3 SDK |
nodemailer | Email sending |
dotenv | Environment configuration |
cors | Cross-origin requests |
cookie-parser | Cookie handling |
uuid | Unique ID generation |

---

# 🧪 Available Scripts

| Script | Purpose |
|--------|----------|
npm run dev | Start server with nodemon |
npm start | Start production server |
npm run seed | Seed default admin |

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

Or Setup the AWS Secret Manager

### 4️⃣ Configure AWS CLI
```bash
aws configure
```
Provide:
```bash
AWS Access Key ID: YOUR_ACCESS_KEY
AWS Secret Access Key: YOUR_SECRET_KEY
Default region name: ap-south-1
Default output format: json
```

### 5️⃣ Create Secret in AWS Secrets Manager

Go to:

AWS Console → Secrets Manager → Store new secret

Secret Type

#### ➡️ Other type of secret

```bash
Secret Value (JSON)
{
  "NODE_ENV": "production",
  "PORT": "5000",
  "MONGODB_URI": "****",
  "ACCESS_TOKEN_SECRET": "*****",
  "REFRESH_TOKEN_SECRET": "*****",
  "ACCESS_TOKEN_SECRET_ADMIN": "*****",
  "REFRESH_TOKEN_SECRET_ADMIN": "*****",
  "ACCESS_TOKEN_EXPIRY": "15m",
  "REFRESH_TOKEN_EXPIRY": "30d",
  "EMAIL_USER": "*****",
  "EMAIL_PASS": "*****",
  "AWS_REGION": "*****",
  "AWS_BUCKET_NAME": "*****",
  "REDIS_HOST": "*****",
  "REDIS_PORT": "****",
  "REDIS_USERNAME": "*****",
  "REDIS_PASSWORD": "*****"
}
```

### 6️⃣ loadConfig Utility

📁 src/config/loadConfig.js
```bash
import dotenv from "dotenv";
import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from "@aws-sdk/client-secrets-manager";

dotenv.config();

const ENV = process.env.NODE_ENV || "production";
const REGION = process.env.AWS_REGION || "ap-south-1";
const SECRET_NAME = process.env.SECRET_NAME || "secret-aws";
const secretsManager = new SecretsManagerClient({ region: REGION });

const loadConfig = async () => {
  if (ENV === "production") {
    try {
      const response = await secretsManager.send(
        new GetSecretValueCommand({ SecretId: SECRET_NAME })
      );

      if (response.SecretString) {
        try {
          const secrets = JSON.parse(response.SecretString);
          return {
            PORT: secrets.PORT,
            CORS_ORIGIN: secrets.CORS_ORIGIN,
            APP_URL: secrets.APP_URL,
            MONGODB_URI: secrets.MONGODB_URI,
            ACCESS_TOKEN_SECRET: secrets.ACCESS_TOKEN_SECRET,
            ACCESS_TOKEN_EXPIRY: secrets.ACCESS_TOKEN_EXPIRY,
            REFRESH_TOKEN_SECRET: secrets.REFRESH_TOKEN_SECRET,
            REFRESH_TOKEN_EXPIRY: secrets.REFRESH_TOKEN_EXPIRY,
            ACCESS_TOKEN_SECRET_ADMIN: secrets.ACCESS_TOKEN_SECRET_ADMIN,
            REFRESH_TOKEN_SECRET_ADMIN: secrets.REFRESH_TOKEN_SECRET_ADMIN,

            // AWS configuration
            AWS_REGION: secrets.AWS_REGION,
            AWS_BUCKET_NAME: secrets.AWS_BUCKET_NAME,
            AWS_ACCESS_KEY_ID: secrets.AWS_ACCESS_KEY_ID,
            AWS_SECRET_ACCESS_KEY: secrets.AWS_SECRET_ACCESS_KEY,


            // Email configuration
            EMAIL_USER: secrets.EMAIL_USER,
            EMAIL_PASS: secrets.EMAIL_PASS,

            REDIS_HOST: secrets.REDIS_HOST || "localhost",
            REDIS_PORT: secrets.REDIS_PORT || "6379",
            REDIS_USERNAME: secrets.REDIS_USERNAME || "",
            REDIS_PASSWORD: secrets.REDIS_PASSWORD || "",

          };
        } catch (parseError) {
          console.error("JSON Parse Error:", parseError);
          throw new Error("Failed to parse secret value as JSON");
        }
      }
      throw new Error("No secret string found in the response");
    } catch (error) {
      console.error("AWS Secrets Fetch Error:", error);
      throw new Error("Failed to load secrets from AWS Secrets Manager");
    }
  }

  return {
    NODE_ENV: process.env.NODE_ENV || "development",
    PORT: process.env.PORT || 3030,
    CORS_ORIGIN: process.env.CORS_ORIGIN || "http://localhost:3000",
    APP_URL: process.env.APP_URL || "http://localhost:3000",
    MONGODB_URI: process.env.MONGODB_URI,
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
    ACCESS_TOKEN_EXPIRY: process.env.ACCESS_TOKEN_EXPIRY || "15m",
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
    REFRESH_TOKEN_EXPIRY: process.env.REFRESH_TOKEN_EXPIRY || "7d",
    ACCESS_TOKEN_SECRET_ADMIN: process.env.ACCESS_TOKEN_SECRET_ADMIN,
    REFRESH_TOKEN_SECRET_ADMIN: process.env.REFRESH_TOKEN_SECRET_ADMIN,

    // AWS configuration
    AWS_REGION: process.env.AWS_REGION || "ap-south-1",
    AWS_BUCKET_NAME: process.env.AWS_BUCKET_NAME,
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,

    // Email configuration
    EMAIL_USER: process.env.EMAIL_USER,
    EMAIL_PASS: process.env.EMAIL_PASS,

    // Redis configuration
    REDIS_HOST: process.env.REDIS_HOST || "localhost",
    REDIS_PORT: process.env.REDIS_PORT || "6379",
    REDIS_USERNAME: process.env.REDIS_USERNAME || "",
    REDIS_PASSWORD: process.env.REDIS_PASSWORD || "",

  };
};

export { loadConfig };
```
### 8️⃣ Usage Rules for Developers
❌ Do NOT use:
```bash
process.env.MONGODB_URI
process.env.ACCESS_TOKEN_SECRET
```
✅ ALWAYS use:
```bash
const secrets = await loadConfig();
```


###  Run the Project
Development

```bash
npm run dev
```


Server will start on:

```bash
http://localhost:5000
```

