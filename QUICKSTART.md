# Quick Start Guide

Get your ProjectHub Dashboard up and running in minutes. This guide provides step-by-step instructions for both Docker and local development setups.

## 📋 Prerequisites Checklist

Before starting, ensure you have:

- [ ] Node.js 20+ installed (`node --version`)
- [ ] npm installed (`npm --version`)
- [ ] Docker Desktop installed (for Docker setup)
- [ ] A Supabase account ([sign up here](https://supabase.com))
- [ ] A Supabase project created

## 🚀 Quick Start Options

Choose the setup method that best fits your needs:

- **Docker Setup** (Recommended) - Fastest, most consistent environment
- **Local Development** - Better for active development and debugging

---

## Option 1: Docker Setup (Recommended)

Docker provides a consistent environment and is the fastest way to get started.

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd saasmini
```

### Step 2: Configure Environment Variables

```bash
# Copy the example environment file
cp .env.example .env.local
```

Edit `.env.local` and add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
JWT_SECRET=your-jwt-secret-here
```

**Where to find your Supabase credentials:**
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Navigate to **Settings** → **API**
4. Copy the **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
5. Copy the **service_role** key → `SUPABASE_SERVICE_ROLE_KEY`

**Generate JWT Secret:**
```bash
# On Linux/Mac
openssl rand -base64 32

# On Windows (PowerShell)
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

### Step 3: Set Up Database Schema

1. Open your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Run the following SQL:

```sql
-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
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

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
```

4. Click **Run** to execute the SQL

### Step 4: Start the Application

```bash
# Build and start the container
docker-compose up -d --build

# View logs to verify it's running
docker-compose logs -f app
```

The application will be available at **http://localhost:3000**

### Step 5: Create Your First Account

1. Open http://localhost:3000 in your browser
2. Click "Don't have an account? Sign up"
3. Fill in your details and register
4. You'll be automatically logged in

---

## Option 2: Local Development Setup

This setup is ideal for active development and debugging.

### Step 1: Install Dependencies

```bash
# Clone the repository (if not already done)
git clone <repository-url>
cd saasmini

# Install all dependencies
npm install
```

### Step 2: Configure Environment Variables

```bash
# Copy the example file
cp .env.example .env.local
```

Edit `.env.local` with your Supabase credentials (same as Docker setup above).

### Step 3: Set Up Database Schema

Follow the same database setup steps as in the Docker setup (Step 3 above).

### Step 4: Start Development Server

```bash
npm run dev
```

The development server will start at **http://localhost:3000**

### Step 5: Create Your First Account

1. Navigate to http://localhost:3000
2. Register a new account
3. Start using the dashboard!

---

## ✅ Verification Steps

After setup, verify everything is working:

1. **Application loads**: Open http://localhost:3000
2. **Registration works**: Create a new account
3. **Login works**: Log out and log back in
4. **Database connection**: Check Supabase dashboard → Table Editor → See your user record
5. **Projects work**: Create a test project

---

## 🎯 First Steps After Setup

1. **Explore the Dashboard**
   - View the empty projects table
   - Try the search and filter features

2. **Create Your First Project**
   - Click "Add New Project"
   - Fill in project details
   - Save and see it appear in the table

3. **Test Filtering**
   - Create projects with different statuses
   - Use the status filter buttons

4. **Test Search**
   - Use the search box to find projects by title, assigned member, or description

---

## 🐛 Troubleshooting

### Issue: "Cannot connect to Supabase"

**Symptoms:**
- Error messages about Supabase connection
- Authentication fails

**Solutions:**
1. Verify `NEXT_PUBLIC_SUPABASE_URL` in `.env.local` is correct
   - Should start with `https://`
   - Should end with `.supabase.co`
   - No trailing slash

2. Verify `SUPABASE_SERVICE_ROLE_KEY` is correct
   - Must be the **service_role** key, not the **anon** key
   - Found in Settings → API → service_role key

3. Check Supabase project status
   - Ensure project is not paused
   - Check Supabase dashboard for any service alerts

4. Verify database tables exist
   - Go to Supabase → Table Editor
   - Should see `users` and `projects` tables

### Issue: "Port 3000 already in use"

**Solutions:**

**For Docker:**
```bash
# Edit docker-compose.yml and change the port mapping
ports:
  - "3001:3000"  # Use port 3001 instead
```

**For Local Development:**
```bash
# Use a different port
PORT=3001 npm run dev
```

Then access at http://localhost:3001

### Issue: "Build errors" or "Module not found"

**Solutions:**

1. **Clear cache and reinstall:**
   ```bash
   rm -rf node_modules .next package-lock.json
   npm install
   ```

2. **On Windows:**
   ```powershell
   Remove-Item -Recurse -Force node_modules, .next, package-lock.json
   npm install
   ```

3. **Verify Node.js version:**
   ```bash
   node --version  # Should be 20.0.0 or higher
   ```

### Issue: "JWT authentication errors"

**Symptoms:**
- Can't stay logged in
- Token errors in console

**Solutions:**

1. Verify `JWT_SECRET` is set in `.env.local`
2. Ensure JWT_SECRET is at least 32 characters
3. Restart the application after changing JWT_SECRET
4. Clear browser cookies and try again

### Issue: "Database table errors"

**Symptoms:**
- "Table does not exist" errors
- Column name errors

**Solutions:**

1. **Verify tables exist:**
   - Go to Supabase → Table Editor
   - Should see `users` and `projects` tables

2. **Check column names:**
   - Use snake_case: `password_hash`, `created_at`, `updated_at`
   - Not camelCase: `passwordHash`, `createdAt`

3. **Re-run SQL schema:**
   - Go to Supabase → SQL Editor
   - Re-run the CREATE TABLE statements

### Issue: Docker container won't start

**Solutions:**

1. **Check Docker is running:**
   ```bash
   docker ps
   ```

2. **View container logs:**
   ```bash
   docker-compose logs app
   ```

3. **Rebuild container:**
   ```bash
   docker-compose down
   docker-compose up -d --build
   ```

4. **Check disk space:**
   ```bash
   docker system df
   ```

---

## 🔄 Next Steps

Once your application is running:

1. **Read the Documentation**
   - [README.md](./README.md) - Full project documentation
   - [ENV_SETUP.md](./ENV_SETUP.md) - Environment variables guide

2. **Customize the Application**
   - Modify project statuses
   - Add new fields to projects
   - Customize the UI styling

3. **Deploy to Production**
   - Set up production environment variables
   - Configure production Supabase project
   - Deploy to your preferred hosting platform

---

## 📞 Need Help?

If you encounter issues not covered here:

1. Check the [README.md](./README.md) for detailed documentation
2. Review [ENV_SETUP.md](./ENV_SETUP.md) for environment configuration
3. Open an issue on the GitHub repository
4. Check Supabase documentation: [supabase.com/docs](https://supabase.com/docs)

---

**Happy coding! 🚀**
