# BlogApp

A full-stack blog application built with Node.js, Express, MongoDB, and React. The application supports multiple user roles (USER, AUTHOR, ADMIN) with role-based access control, allowing users to read and comment on articles, authors to create and manage their content, and administrators to oversee user management.

## Table of Contents

- [Project Description](#project-description)
- [Features and Functionalities](#features-and-functionalities)
- [Technologies Used](#technologies-used)
- [Folder Structure Explanation](#folder-structure-explanation)
- [Prerequisites](#prerequisites)
- [Installation Steps](#installation-steps)
- [Environment Variables Setup](#environment-variables-setup)
- [Steps to Run the Project Locally](#steps-to-run-the-project-locally)
- [API Endpoints Explanation](#api-endpoints-explanation)
- [Frontend Pages/Components Description](#frontend-pagescomponents-description)
- [Database Information and Schema Overview](#database-information-and-schema-overview)
- [Authentication/Authorization Flow](#authenticationauthorization-flow)
- [Screenshots Section Placeholder](#screenshots-section-placeholder)
- [Future Enhancements](#future-enhancements)
- [Contributors Section](#contributors-section)
- [License Information](#license-information)

## Project Description

BlogApp is a comprehensive blogging platform that enables content creation, consumption, and management. Users can register as readers (USER) or content creators (AUTHOR), while administrators (ADMIN) maintain oversight. The application features secure authentication, image uploads via Cloudinary, and a responsive React frontend with a Node.js/Express backend powered by MongoDB.

## Features and Functionalities

### User Management
- **Registration**: Users can register as USER or AUTHOR roles with profile image upload
- **Authentication**: JWT-based login with role-based access control
- **Profile Management**: View and manage user profiles

### Content Management
- **Article Reading**: Browse published articles with author information
- **Article Details**: View full articles with comments
- **Commenting**: Authenticated users can add comments to articles

### Author Features
- **Article Creation**: Authors can write and publish new articles
- **Article Editing**: Modify existing articles (title, category, content)
- **Article Management**: Soft delete articles (toggle active/inactive status)
- **Author Dashboard**: View all personal articles

### Admin Features
- **User Oversight**: View all users and authors
- **Account Management**: Activate/deactivate user accounts
- **Content Control**: Automatically manage article visibility when author accounts change
- **Permanent Deletion**: Remove users/authors and their associated content

### Technical Features
- **Image Upload**: Cloudinary integration for profile images and potential article media
- **Responsive Design**: Mobile-friendly interface using TailwindCSS
- **State Management**: Zustand for client-side state management
- **Form Handling**: React Hook Form for efficient form management
- **Notifications**: React Hot Toast for user feedback
- **Routing**: React Router for client-side navigation

## Technologies Used

### Backend
- **Node.js**: JavaScript runtime for server-side development
- **Express.js**: Web application framework for API development
- **MongoDB**: NoSQL database for data storage
- **Mongoose**: ODM for MongoDB schema management
- **JWT (jsonwebtoken)**: Token-based authentication
- **bcrypt**: Password hashing for security
- **Cloudinary**: Cloud-based image storage and management
- **Multer**: Middleware for handling file uploads
- **CORS**: Cross-origin resource sharing configuration
- **Cookie Parser**: HTTP cookie handling

### Frontend
- **React**: UI library for building user interfaces
- **Vite**: Fast build tool and development server
- **React Router**: Client-side routing
- **TailwindCSS**: Utility-first CSS framework
- **Zustand**: Lightweight state management
- **Axios**: HTTP client for API requests
- **React Hook Form**: Performant forms with easy validation
- **React Hot Toast**: Toast notifications
- **ESLint**: Code linting and formatting

### Development Tools
- **Nodemon**: Automatic server restart during development
- **Vite Dev Server**: Fast development server with HMR
- **REST Client (VS Code)**: API testing with .http files

## Folder Structure Explanation

```
BlogApp/
├── notes.md                           # Project notes and todos
├── package.json                       # Root package.json for monorepo management
├── backendOfBlogApp/                  # Backend application directory
│   ├── package.json                   # Backend dependencies and scripts
│   ├── readme.md                      # Backend development notes
│   ├── server.js                      # Main Express server file
│   ├── Userrequest.http               # HTTP requests for testing user APIs
│   ├── adminRequest.http              # HTTP requests for testing admin APIs
│   ├── authorRequest.http             # HTTP requests for testing author APIs
│   ├── APIs/                          # API route handlers
│   │   ├── AdminAPI.js                # Admin-specific endpoints (user management)
│   │   ├── AuthorAPI.js               # Author-specific endpoints (article CRUD)
│   │   ├── CommonAPI.js               # Shared endpoints (auth: register/login)
│   │   └── UserAPI.js                 # User-specific endpoints (read articles, comments)
│   ├── config/                        # Configuration files
│   │   ├── cloudinary.js              # Cloudinary cloud service configuration
│   │   ├── cloudinaryUpload.js        # Image upload utility functions
│   │   └── multer.js                  # File upload middleware configuration
│   ├── middlewares/                   # Express middleware functions
│   │   └── VerifyToken.js             # JWT token verification and role authorization
│   └── models/                        # Mongoose data models
│       ├── articleModel.js            # Article schema and model
│       └── userModel.js               # User schema and model
├── frontendofBlogApp/                 # Frontend React application
│   ├── eslint.config.js               # ESLint configuration
│   ├── index.html                     # Main HTML template
│   ├── package.json                   # Frontend dependencies and scripts
│   ├── README.md                      # Default Vite template README
│   ├── vite.config.js                 # Vite build configuration
│   ├── public/                        # Static assets
│   └── src/                           # Source code
│       ├── App.css                    # Global CSS styles
│       ├── App.jsx                    # Main React application component
│       ├── index.css                  # Base CSS styles
│       ├── main.jsx                   # React application entry point
│       ├── api/                       # API client configuration
│       │   └── axios.js               # Axios instance with interceptors
│       ├── assets/                    # Static assets (images, icons)
│       ├── components/                # React components
│       │   ├── AdminProfile.jsx       # Admin dashboard component
│       │   ├── ArticleById.jsx        # Individual article view component
│       │   ├── AuthorArticle.jsx      # Author's article list component
│       │   ├── AuthorProfile.jsx      # Author profile and navigation
│       │   ├── Editarticle.jsx        # Article editing form component
│       │   ├── Footer.jsx             # Site footer component
│       │   ├── Header.jsx             # Site header with navigation
│       │   ├── HomeComponent.jsx      # Home page with article grid
│       │   ├── Login.jsx              # Login form component
│       │   ├── ProtectedRoute.jsx     # Route protection wrapper
│       │   ├── RegisterComponent.jsx  # Registration form component
│       │   ├── RootComponent.jsx      # Root layout component
│       │   ├── Unauthorized.jsx       # Unauthorized access page
│       │   ├── UserProfile.jsx        # User profile component
│       │   └── WriteArticle.jsx       # Article writing form component
│       ├── store/                     # State management
│       │   └── authStore.js           # Authentication state with Zustand
│       └── styles/                    # Styling utilities
│           └── common.js              # Shared CSS class definitions
```

### Key Directories and Files

- **backendOfBlogApp/server.js**: Main server file that sets up Express app, connects to MongoDB, configures CORS, and mounts API routes
- **backendOfBlogApp/models/**: Contains Mongoose schemas for User and Article collections
- **backendOfBlogApp/APIs/**: Modular API endpoints organized by user role
- **backendOfBlogApp/middlewares/VerifyToken.js**: JWT authentication middleware with role-based access control
- **frontendofBlogApp/src/App.jsx**: React Router configuration with protected routes
- **frontendofBlogApp/src/api/axios.js**: Configured Axios client with request/response interceptors
- **frontendofBlogApp/src/store/authStore.js**: Zustand store managing authentication state
- **frontendofBlogApp/src/components/**: Reusable React components for different pages and features

## Prerequisites

- **Node.js** (v16 or higher)
- **MongoDB** (local installation or MongoDB Atlas)
- **npm** or **yarn** package manager
- **Git** for version control

## Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd BlogApp
   ```

2. **Install root dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd backendOfBlogApp
   npm install
   cd ..
   ```

4. **Install frontend dependencies**
   ```bash
   cd frontendofBlogApp
   npm install
   cd ..
   ```

## Environment Variables Setup

Create a `.env` file in the `backendOfBlogApp` directory with the following variables:

```env
# Database Configuration
DB_URL=mongodb://localhost:27017/blogapp
# For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/blogapp

# JWT Configuration
SECRET_KEY=your-super-secret-jwt-key-here

# Server Configuration
PORT=4000

# Cloudinary Configuration (for image uploads)
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
```

Create a `.env` file in the `frontendofBlogApp` directory:

```env
# API Base URL
VITE_API_URL=http://localhost:4000
```

## Steps to Run the Project Locally

1. **Start MongoDB** (if running locally)
   ```bash
   # On Windows with MongoDB installed
   mongod

   # Or use MongoDB Compass/Atlas for cloud database
   ```

2. **Start the backend server**
   ```bash
   npm run backend
   ```
   The backend will start on `http://localhost:4000`

3. **Start the frontend development server**
   ```bash
   npm run frontend
   ```
   The frontend will start on `http://localhost:5173`

4. **Access the application**
   - Open `http://localhost:5173` in your browser
   - Register as a USER or AUTHOR
   - Login and explore the features

## API Endpoints Explanation

### Authentication Endpoints (`/auth`)
- `POST /auth/users` - User registration (USER/AUTHOR roles)
- `POST /auth/login` - User login (all roles)
- `GET /auth/logout` - User logout

### User Endpoints (`/user-api`) - Requires USER/AUTHOR authentication
- `GET /user-api/articles` - Get all active articles
- `GET /user-api/article/:id` - Get single article with comments
- `PUT /user-api/articles` - Add comment to article

### Author Endpoints (`/author-api`) - Requires AUTHOR authentication
- `POST /author-api/article` - Create new article
- `GET /author-api/articles` - Get author's articles
- `PUT /author-api/articles` - Edit article
- `PATCH /author-api/articles` - Toggle article active status

### Admin Endpoints (`/admin-api`) - Requires ADMIN authentication
- `GET /admin-api/users` - Get all users and authors
- `PATCH /admin-api/user-status` - Toggle user active status
- `DELETE /admin-api/user-delete` - Permanently delete user/author

## Frontend Pages/Components Description

### Public Pages
- **Home (/)**: Article grid display (requires authentication)
- **Register (/register)**: User registration form
- **Login (/login)**: User authentication form
- **Unauthorized (/unauthorized)**: Access denied page

### Protected Pages
- **User Profile (/user-profile)**: User dashboard (USER role only)
- **Author Profile (/author-profile)**: Author dashboard with nested routes (AUTHOR role only)
  - **Articles (/author-profile/articles)**: List of author's articles
  - **Write Article (/author-profile/write-article)**: Article creation form
- **Article View (/article/:id)**: Individual article with comments
- **Edit Article (/edit-article)**: Article editing form
- **Admin Profile (/admin-profile)**: Admin management dashboard (ADMIN role only)

### Key Components
- **RootComponent**: Layout wrapper with header/footer
- **Header**: Navigation bar with role-based menu items
- **Footer**: Site footer with links
- **ProtectedRoute**: HOC for role-based route protection
- **HomeComponent**: Article grid with loading/error states
- **ArticleById**: Article detail view with comment functionality
- **WriteArticle/Editarticle**: Rich text forms for content creation
- **AdminProfile**: User management interface

## Database Information and Schema Overview

### MongoDB Collections

#### Users Collection
```javascript
{
  firstName: String (required),
  lastName: String,
  email: String (required, unique),
  password: String (required, hashed),
  role: String (enum: ["USER", "AUTHOR", "ADMIN"], required),
  profileImageUrl: String,
  isUserActive: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

#### Articles Collection
```javascript
{
  author: ObjectId (ref: "user", required),
  title: String (required),
  category: String (required),
  content: String (required),
  comments: [{
    user: ObjectId (ref: "user", required),
    comment: String (required)
  }],
  isArticleActive: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

### Database Relationships
- Articles reference Users via `author` field
- Comments reference Users via `user` field
- Admin actions cascade to related articles (activation/deactivation/deletion)

## Authentication/Authorization Flow

1. **Registration**: Users register with role selection (USER/AUTHOR)
2. **Login**: JWT token generated and stored in cookies + localStorage
3. **Token Verification**: Middleware validates JWT and checks role permissions
4. **Protected Routes**: Frontend routes check authentication state
5. **Role-Based Access**: Different endpoints/components based on user role
6. **Logout**: Token cleared from storage and cookies

### Security Features
- Password hashing with bcrypt
- JWT token expiration
- CORS configuration for frontend origin
- Role-based middleware protection
- Input validation and sanitization

