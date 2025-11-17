# ProjectHub Dashboard

A modern, full-stack project management dashboard built with Next.js 14, Supabase, and TypeScript. This application provides a complete solution for managing projects with authentication, filtering, search capabilities, and full CRUD operations.

## 🚀 Features

- **🔐 Secure Authentication**: JWT-based authentication system with password hashing
- **📊 Project Management**: Complete CRUD operations for project tracking
- **🔍 Advanced Filtering**: Filter projects by status (active, on hold, completed)
- **🔎 Full-Text Search**: Search across project titles, assigned members, and descriptions
- **📱 Responsive Design**: Modern, mobile-friendly UI built with Tailwind CSS
- **☁️ Cloud Database**: Powered by Supabase (hosted PostgreSQL)
- **🐳 Docker Support**: Containerized deployment with Docker Compose
- **🔒 Type-Safe**: Built with TypeScript for enhanced developer experience

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: React 18

### Backend
- **Runtime**: Node.js 20+
- **API**: Next.js API Routes
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt

### Database & Infrastructure
- **Database**: Supabase (PostgreSQL)
- **ORM**: Supabase Client
- **Containerization**: Docker & Docker Compose
- **Validation**: Zod

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 20.0.0 or higher
- **npm** 9.0.0 or higher (comes with Node.js)
- **Docker** 20.10+ and **Docker Compose** 2.0+ (for containerized deployment)
- **Git** (for cloning the repository)
- **Supabase Account** (free tier available at [supabase.com](https://supabase.com))

## 🏃 Quick Start

### Option 1: Docker Deployment (Recommended)

The fastest way to get started is using Docker Compose:

```bash
# 1. Clone the repository
git clone <repository-url>
cd ProjectHub

# 2. Set up environment variables
cp .env.example .env.local

# 3. Edit .env.local with your Supabase credentials
# See ENV_SETUP.md for detailed instructions

# 4. Set up database schema in Supabase
# Run the SQL schema provided in the database setup section

# 5. Start the application
docker-compose up -d --build

# 6. Access the application
# Open http://localhost:3000 in your browser
```

For detailed setup instructions, see [QUICKSTART.md](./QUICKSTART.md).

### Option 2: Local Development

For local development without Docker:

```bash
# 1. Clone and navigate to the project
git clone <repository-url>
cd ProjectHub

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Edit .env.local with your credentials

# 4. Set up database schema in Supabase

# 5. Start the development server
npm run dev

# 6. Open http://localhost:3000
```

## 📁 Project Structure

```
ProjectHub/
├── app/                          # Next.js App Router directory
│   ├── api/                      # API routes
│   │   ├── auth/                 # Authentication endpoints
│   │   │   ├── login/            # POST /api/auth/login
│   │   │   ├── register/         # POST /api/auth/register
│   │   │   ├── logout/           # POST /api/auth/logout
│   │   │   └── me/               # GET /api/auth/me
│   │   └── projects/             # Project CRUD endpoints
│   │       ├── [id]/             # Individual project operations
│   │       └── route.ts          # Project list operations
│   ├── login/                    # Authentication page
│   │   └── page.tsx
│   ├── layout.tsx                # Root layout component
│   ├── page.tsx                  # Main dashboard page
│   └── globals.css               # Global styles
├── components/                   # React components
│   ├── ProjectModal.tsx          # Project create/edit modal
│   └── ProjectTable.tsx          # Projects table display
├── lib/                          # Utility libraries
│   ├── auth.ts                   # Authentication utilities
│   └── supabaseClient.ts         # Supabase client configuration
├── docker-compose.yml            # Docker Compose configuration
├── Dockerfile                    # Docker image definition
├── .env.example                  # Environment variables template
├── ENV_SETUP.md                  # Environment setup guide
├── QUICKSTART.md                 # Quick start guide
└── README.md                     # This file
```

## 🗄️ Database Schema

The application uses Supabase (PostgreSQL) with the following schema:

### Users Table

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | Unique user identifier |
| `email` | VARCHAR(255) | UNIQUE, NOT NULL | User email address |
| `password_hash` | VARCHAR(255) | NOT NULL | Bcrypt hashed password |
| `name` | VARCHAR(255) | NOT NULL | User's full name |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Account creation timestamp |

### Projects Table

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | Unique project identifier |
| `title` | VARCHAR(255) | NOT NULL | Project title |
| `status` | VARCHAR(50) | NOT NULL, CHECK | Status: 'active', 'on hold', 'completed' |
| `deadline` | DATE | | Project deadline |
| `assigned_to` | VARCHAR(255) | | Assigned team member |
| `budget` | DECIMAL(10,2) | | Project budget |
| `description` | TEXT | | Project description (optional) |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Creation timestamp |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Last update timestamp |

### Database Setup

Run the following SQL in your Supabase SQL Editor:

```sql
-- Create users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create projects table
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  status VARCHAR(50) NOT NULL CHECK (status IN ('active', 'on hold', 'completed')),
  deadline DATE,
  assigned_to VARCHAR(255),
  budget DECIMAL(10,2),
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create index for faster email lookups
CREATE INDEX idx_users_email ON users(email);

-- Create index for project status filtering
CREATE INDEX idx_projects_status ON projects(status);
```

## 🔌 API Reference

### Authentication Endpoints

#### `POST /api/auth/register`
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123",
  "name": "John Doe"
}
```

**Response:** `201 Created`
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "token": "jwt-token"
}
```

#### `POST /api/auth/login`
Authenticate an existing user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response:** `200 OK`
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "token": "jwt-token"
}
```

#### `GET /api/auth/me`
Get the current authenticated user.

**Response:** `200 OK`
```json
{
  "user": {
    "userId": 1,
    "email": "user@example.com"
  }
}
```

#### `POST /api/auth/logout`
Logout the current user (deletes authentication cookie).

**Response:** `200 OK`
```json
{
  "message": "Logged out successfully"
}
```

### Project Endpoints

All project endpoints require authentication via JWT token in cookies.

#### `GET /api/projects`
List all projects with optional filtering.

**Query Parameters:**
- `status` (optional): Filter by status (`active`, `on hold`, `completed`)
- `search` (optional): Search in title, assigned_to, and description

**Example:** `GET /api/projects?status=active&search=website`

**Response:** `200 OK`
```json
[
  {
    "id": "uuid",
    "title": "Project Name",
    "status": "active",
    "deadline": "2024-12-31",
    "assigned_to": "John Doe",
    "budget": 50000.00,
    "description": "Project description",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
]
```

#### `POST /api/projects`
Create a new project.

**Request Body:**
```json
{
  "title": "New Project",
  "status": "active",
  "deadline": "2024-12-31",
  "assigned_to": "John Doe",
  "budget": 50000,
  "description": "Project description"
}
```

**Response:** `201 Created`

#### `GET /api/projects/[id]`
Get a single project by ID.

**Response:** `200 OK` or `404 Not Found`

#### `PUT /api/projects/[id]`
Update a project (partial update supported).

**Request Body:** (all fields optional)
```json
{
  "title": "Updated Title",
  "status": "completed"
}
```

**Response:** `200 OK` or `404 Not Found`

#### `DELETE /api/projects/[id]`
Delete a project.

**Response:** `200 OK`
```json
{
  "message": "Project deleted successfully"
}
```

## 🧪 Development

### Running the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

### Building for Production

```bash
npm run build
npm start
```

### Code Quality

```bash
# Run ESLint
npm run lint

# Type checking (via TypeScript)
npm run build  # This will also type-check
```

## 🐳 Docker Commands

```bash
# Start the application
docker-compose up -d

# View logs
docker-compose logs -f app

# Stop the application
docker-compose down

# Rebuild after code changes
docker-compose up -d --build

# View container status
docker-compose ps
```

## ⚙️ Environment Variables

For detailed environment variable setup, see [ENV_SETUP.md](./ENV_SETUP.md).

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | `https://xxxxx.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| `JWT_SECRET` | Secret for JWT token signing | Generate with `openssl rand -base64 32` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_APP_URL` | Public URL of your application | `http://localhost:3000` |
| `NODE_ENV` | Environment mode | `development` |

## 🔒 Security Considerations

- **Password Security**: All passwords are hashed using bcrypt with a cost factor of 10
- **JWT Tokens**: Tokens expire after 7 days and are stored in HTTP-only cookies
- **Service Role Key**: Never expose `SUPABASE_SERVICE_ROLE_KEY` in client-side code
- **Input Validation**: All inputs are validated using Zod schemas
- **Error Messages**: Generic error messages prevent user enumeration attacks
- **HTTPS**: Always use HTTPS in production environments
- **Environment Variables**: Never commit `.env` files to version control

## 🐛 Troubleshooting

### Common Issues

**Application won't start:**
- Verify all environment variables are set correctly
- Check that Supabase project is active
- Ensure database tables are created

**Authentication not working:**
- Verify JWT_SECRET is set and matches across restarts
- Check that cookies are enabled in your browser
- Ensure Supabase service role key is correct

**Database connection errors:**
- Verify `NEXT_PUBLIC_SUPABASE_URL` is correct (no trailing slash)
- Check that `SUPABASE_SERVICE_ROLE_KEY` is the service_role key, not anon key
- Ensure your Supabase project is not paused

For more troubleshooting help, see [QUICKSTART.md](./QUICKSTART.md).

## 📚 Additional Documentation

- [QUICKSTART.md](./QUICKSTART.md) - Quick start guide with step-by-step instructions
- [ENV_SETUP.md](./ENV_SETUP.md) - Comprehensive environment variable setup guide

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Write meaningful commit messages
- Add comments for complex logic
- Ensure all tests pass before submitting PR
- Update documentation for new features

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [Supabase](https://supabase.com/) - Open source Firebase alternative
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [TypeScript](https://www.typescriptlang.org/) - Typed JavaScript

## 📞 Support

For issues, questions, or contributions, please open an issue on the GitHub repository.

---

**Built with ❤️ using Next.js and Supabase**
