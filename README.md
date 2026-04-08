# TechUpdate

A full-stack blogging platform built with a React frontend and a Node.js/Express backend. Users can create an account, publish and manage their own posts, upload cover images, save drafts, and read posts from other users through a clean, responsive interface.

## Project Overview

TechUpdate is a modern blogging application designed for writers and readers. It supports authentication, post publishing, image uploads, drafts, and author-controlled editing and deletion.

### Key Features

- User signup, login, logout, and profile-based access
- Create, read, update, and delete blog posts
- Only the post owner can edit or delete their content
- View published posts from all users
- Upload and preview cover images
- Draft and publish workflow
- Responsive frontend UI
- Secure cookie-based authentication
- REST API with validation and error handling

## Tech Stack

### Frontend

- React
- React Router DOM
- Redux Toolkit
- React Redux
- React Hook Form
- Tailwind CSS
- Vite
- TinyMCE
- Lucide React
- React Toastify

### Backend

- Node.js
- Express.js
- Mongoose
- JWT
- bcryptjs
- Multer
- Cookie Parser
- CORS
- dotenv

### Database

- MongoDB

## Features

- Authentication
  - User registration
  - User login/logout
  - Current user session handling
- Post Management
  - Create new posts
  - Edit existing posts
  - Delete posts
  - Save drafts
  - Publish posts
- Authorization
  - Only authenticated users can create posts
  - Only owners can update or delete their posts
  - Only owners can attach images they uploaded
- Media
  - Image upload support for cover images
  - Image preview and fallback handling
- UI/UX
  - Responsive layout
  - Reader-friendly post pages
  - Search/filter support on post lists
  - Toast notifications and loading states

## Folder Structure

```bash
.
├── frontend/
│   ├── public/
│   │   └── assets/
│   ├── src/
│   │   ├── app/              # Redux store, slices, local storage helpers
│   │   ├── appwrite/         # API service wrappers for auth/posts/uploads
│   │   ├── components/       # Reusable UI and feature components
│   │   ├── conf/             # Frontend configuration
│   │   ├── pages/            # Route-level pages
│   │   ├── App.jsx           # Root app layout
│   │   ├── main.jsx          # React entry point
│   │   └── index.css         # Global styles
│   ├── .env.example
│   ├── package.json
│   └── vite.config.js
├── backend/
│   ├── src/
│   │   ├── config/           # Environment and DB config
│   │   ├── controllers/      # Route controllers
│   │   ├── middleware/       # Auth, validation, upload, error handlers
│   │   ├── models/           # Mongoose models
│   │   ├── routes/           # API routes
│   │   ├── utils/            # Helpers and transformers
│   │   ├── validators/       # Request validation logic
│   │   ├── app.js            # Express app
│   │   └── server.js         # Server entry point
│   ├── uploads/              # Uploaded files
│   ├── .env.example
│   └── package.json
└── README.md
```

## Environment Variables

Create `.env` files in both `frontend` and `backend` based on the examples below.

### Frontend `.env`

```env
VITE_API_BASE_URL=your-backend-api-url
VITE_DEV_PROXY_TARGET=your-backend-dev-url
VITE_TINYMCE_REACT_API_KEY=your-tinymce-api-key
```

### Backend `.env`

```env
PORT=your-backend-port
NODE_ENV=development_or_production
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=your-long-random-secret
JWT_EXPIRES_IN=your-jwt-expiry
CORS_ORIGIN=your-frontend-origin-or-comma-separated-origins
UPLOAD_DIR=your-upload-folder-name
PUBLIC_SERVER_URL=your-public-backend-url
COOKIE_SAME_SITE=lax_or_none
COOKIE_SECURE=true_or_false
```

## Installation & Setup

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd <your-project-folder>
```

### 2. Install backend dependencies

```bash
cd backend
npm install
```

### 3. Install frontend dependencies

```bash
cd ../frontend
npm install
```

### 4. Configure environment variables

Create the following files:

- `backend/.env`
- `frontend/.env`

Use the `.env.example` files as reference.

### 5. Start the backend development server

```bash
cd backend
npm run dev
```

### 6. Start the frontend development server

```bash
cd frontend
npm run dev
```

### 7. Open the app

By default, the frontend runs on a Vite development port and connects to the backend API using the configured environment variables or dev proxy.

## Scripts

### Frontend

```bash
npm run dev      # Start Vite development server
npm run build    # Build frontend for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### Backend

```bash
npm run dev      # Start backend with nodemon
npm start        # Start backend in production mode
```

## API Overview

Main backend routes:

```bash
/api/auth/register
/api/auth/login
/api/auth/logout
/api/auth/me

/api/posts
/api/posts/:identifier

/api/uploads
/api/uploads/:id
/api/uploads/:id/preview
```

## Deployment

### Frontend

- Build the frontend with:

```bash
npm run build
```

- Deploy the generated `dist` folder to a static hosting provider such as Vercel, Netlify, or similar.
- Set `VITE_API_BASE_URL` to your deployed backend API URL.

### Backend

- Deploy the Express backend to a Node-compatible host such as Render, Railway, VPS, or similar.
- Set all backend environment variables in the deployment dashboard.
- Ensure MongoDB is accessible from the deployed backend.
- Set `PUBLIC_SERVER_URL` to the deployed backend base URL.
- Configure `CORS_ORIGIN` with your deployed frontend domain.
- In production, use secure cookie settings:
  - `COOKIE_SECURE=true`
  - `COOKIE_SAME_SITE=none` if frontend and backend are on different domains

## Notes

- Uploaded images are served from the backend, so the backend deployment must allow persistent or supported file storage.
- The `uploads/` folder should not be committed in production workflows unless intentionally required.
- If frontend and backend run on different domains, CORS and cookie settings must be configured correctly.
- TinyMCE works best with a valid API key in `VITE_TINYMCE_REACT_API_KEY`.
- For production, always use strong secrets for `JWT_SECRET`.
- MongoDB and all API/config secrets should only be stored in environment variables.

## Production Readiness Checklist

- Set all required frontend and backend environment variables
- Use a production MongoDB connection string
- Configure correct frontend/backend URLs
- Verify CORS origins
- Enable secure cookies in production
- Build frontend successfully with `npm run build`
- Confirm backend starts successfully with `npm start`

## License

This project is available for personal and educational use. Adjust the license section if your repository uses a specific license.
