# ⚙️ Medi Store — Backend API

The robust, type-safe backbone of the Medi Store platform. This API handles multi-vendor authentication, medicine inventory, order processing, and administrative controls with a focus on security and performance.

## 🚀 Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: Better Auth (Email/Password & Google OAuth)
- **Validation**: Zod
- **File Handling**: Cloudinary
- **Mailing**: Nodemailer with EJS templates
- **Security**: Helmet, CORS, and Tiered Rate Limiting

## ✨ Key Features

- **Multi-Vendor Support**: Isolated data management for sellers and global oversight for admins.
- **Authentication Suite**: Secure login, registration, email verification (OTP), and password reset workflows.
- **Security First**:
  - **Tiered Rate Limiting**: Global, Auth-specific, and Mutation-specific limits to prevent abuse.
  - **Environment-aware Cookies**: Automatic secure cookie enforcement in production.
- **Image Processing**: Seamless integration with Cloudinary for product and profile images.
- **Transactional Emails**: Automated OTP and notification emails using optimized EJS templates.
- **Production Optimized**: Error stack trace masking and compiled TypeScript deployment.

## 🛠️ Installation & Setup

### Prerequisites

- Node.js 18+
- PostgreSQL database (Local or Cloud like Neon)

### Steps

1. Navigate to the server folder:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Generate Prisma Client:
   ```bash
   npx prisma generate
   ```

### Database Initialization

```bash
# Run migrations
npx prisma migrate dev

# Seed initial data (Creates Super Admin)
npm run seed:admin
```

### Environment Variables

Create a `.env` file in the server directory:

```env
DATABASE_URL="postgresql://user:pass@host:5432/db"
PORT=5000
NODE_ENV=development

# Auth
BETTER_AUTH_SECRET=your_secret
BETTER_AUTH_URL=http://localhost:5000
FRONTEND_URL=http://localhost:3000

# Social Auth
GOOGLE_CLIENT_ID=your_google_id
GOOGLE_CLIENT_SECRET=your_google_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/callback/google

# SMTP
EMAIL_SENDER_SMTP_USER=your_email
EMAIL_SENDER_SMTP_PASS=your_app_password
EMAIL_SENDER_SMTP_HOST=smtp.gmail.com
EMAIL_SENDER_SMTP_PORT=465
EMAIL_SENDER_SMTP_FROM=your_email

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
```

## 📦 Deployment

The server is configured for seamless deployment on platforms like **Railway** or **Render**.

- **Build Command**: `npm run build`
- **Start Command**: `npm run start`
- **Post-Build**: Automatically copies EJS templates to the `dist` folder using a cross-platform node script.

---

Medi Store API — Empowering Modern Pharmacy.
