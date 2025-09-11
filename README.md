# 📰 Tech Update - Blogging Platform

## Introduction
Tech Update is an interactive and responsive blogging platform where registered users can create, edit, and manage posts, while unregistered users can only view content.  
It provides a clean and user-friendly interface with rich-text editing, authentication, and post management, offering a seamless blogging experience.

---

## Project Type
Frontend | Backend (Appwrite Services) | Fullstack

---

## Deployed App
- **Frontend:** [https://tech-update-blog.vercel.app/](https://your-deployment-link.com)  
- **Backend (Appwrite):** [https://appwrite.io](https://appwrite.io)  
- **Database:** [https://appwrite.io/database](https://appwrite.io/database)  

---

## Directory Structure
```
tech-update/
├── public/assets/ # Logos & images
├── src/
│ ├── app/ # Redux slices & store
│ ├── appwrite/ # Auth & config
│ ├── components/ # UI components & layouts
│ ├── pages/ # Core pages (Home, AddPost, ViewPost, etc.)
│ ├── conf/ # Config files
│ ├── App.jsx # Root app
│ └── main.jsx # Entry point
```


---

## Features
📝 **Post Management** — Create, edit, delete, and view blog posts with a rich-text editor.  
👤 **Authentication** — Sign up, login, logout, and role-based access via Appwrite.  
📂 **Drafts & Publishing** — Save drafts before publishing content.  
💻 **Responsive UI** — Fully responsive design with Tailwind CSS & DaisyUI.  
⚡ **Modern UX** — Toast notifications, animations (Framer Motion), and theme switching.  

---

## Design Decisions or Assumptions
- **Appwrite** chosen for authentication, database, and file storage.  
- **Redux Toolkit** ensures predictable state management.  
- **Tailwind CSS + DaisyUI** for rapid, consistent UI styling.  
- **TinyMCE** editor for rich-text post creation.  

---

## Installation & Getting Started

# Clone repository
git clone https://github.com/Sk-Sakirul/tech-update.git

# Install dependencies
cd tech-update
npm install

# Start development server
npm run dev

## Example .env
```bash
VITE_APPWRITE_URL="your-appwrite-url"
VITE_APPWRITE_PROJECT_ID="your-project-id"
VITE_APPWRITE_DATABASE_ID="your-database-id"
VITE_APPWRITE_COLLECTION_ID="your-collection-id"
VITE_APPWRITE_BUCKET_ID="your-bucket-id"
```