# Environment Variables Setup Guide

This comprehensive guide explains how to configure environment variables for different environments in the ProjectHub Dashboard project.

## 📖 Table of Contents

- [Overview](#overview)
- [Environment File Structure](#environment-file-structure)
- [Quick Setup](#quick-setup)
- [Required Variables](#required-variables)
- [Optional Variables](#optional-variables)
- [Environment-Specific Configuration](#environment-specific-configuration)
- [Security Best Practices](#security-best-practices)
- [Verification](#verification)
- [Troubleshooting](#troubleshooting)

## Overview

Environment variables are used to configure the application without hardcoding sensitive information. This project uses Next.js's built-in environment variable system, which supports different files for different environments.

### Why Environment Variables?

- **Security**: Keep secrets out of source code
- **Flexibility**: Different configurations for dev/staging/production
- **Portability**: Easy to deploy across different environments
- **Best Practice**: Industry standard for configuration management

## Environment File Structure

The project uses the following environment file structure:

```
saasmini/
├── .env.example              # Template file (committed to git)
├── .env.local                # Local development (gitignored)
├── .env.development.local    # Development overrides (gitignored)
└── .env.production.local     # Production overrides (gitignored)
```

### File Purposes

| File | Purpose | Committed to Git? |
|------|---------|-------------------|
| `.env.example` | Template with placeholder values | ✅ Yes |
| `.env.local` | Your local development variables | ❌ No |
| `.env.development.local` | Development environment overrides | ❌ No |
| `.env.production.local` | Production environment overrides | ❌ No |

## Quick Setup

### For Local Development

1. **Copy the template file:**
   ```bash
   cp .env.example .env.local
   ```

2. **Edit `.env.local` with your actual values:**
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   JWT_SECRET=your-generated-secret
   ```

3. **Restart your development server:**
   ```bash
   npm run dev
   ```

### For Docker

1. **Create `.env.local` file** (same as above)

2. **Docker will automatically load it:**
   ```bash
   docker-compose up -d
   ```

### For Production

1. **Copy the production template:**
   ```bash
   cp .env.production.example .env.production.local
   ```

2. **Edit with production values**

3. **Build and run:**
   ```bash
   npm run build
   NODE_ENV=production npm start
   ```

## Required Variables

These variables must be set for the application to function.

### `NEXT_PUBLIC_SUPABASE_URL`

**Description:** Your Supabase project URL

**Where to Find:**
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Navigate to **Settings** → **API**
4. Copy the **Project URL**

**Format:**
```
https://xxxxxxxxxxxxx.supabase.co
```

**Example:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
```

**Important Notes:**
- Must start with `https://`
- No trailing slash
- This is a public variable (accessible in browser)

### `SUPABASE_SERVICE_ROLE_KEY`

**Description:** Supabase service role key (bypasses Row Level Security)

**Where to Find:**
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Navigate to **Settings** → **API**
4. Find **service_role** key (under "Project API keys")
5. Click "Reveal" and copy the key

**Format:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6...
```

**Example:**
```env
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoic2VydmljZV9yb2xlIiwiaWF0IjoxNjE2MjM5MDIyfQ.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Security Warning:**
- ⚠️ **NEVER** expose this in client-side code
- ⚠️ **NEVER** commit this to version control
- ⚠️ This key has full database access
- ⚠️ Use only in server-side code (API routes)

### `JWT_SECRET`

**Description:** Secret key for signing and verifying JWT tokens

**How to Generate:**

**Linux/Mac:**
```bash
openssl rand -base64 32
```

**Windows (PowerShell):**
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

**Windows (Command Prompt):**
```cmd
powershell -Command "[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))"
```

**Online Generator:**
- Visit: https://generate-secret.vercel.app/32

**Example:**
```env
JWT_SECRET=K8mP2nR5vX9wY3zA6bC7dE1fG4hI0jK2lM5nO8pQ1rS4tU7vW0xY3zA6bC9d
```

**Requirements:**
- Minimum 32 characters recommended
- Use different secrets for development and production
- Keep it secret and secure

## Optional Variables

These variables have defaults but can be customized.

### `NEXT_PUBLIC_APP_URL`

**Description:** Public URL of your application

**Default:** `http://localhost:3000`

**Development:**
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Production:**
```env
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

**Use Cases:**
- CORS configuration
- Email links
- OAuth redirects
- API documentation

### `NODE_ENV`

**Description:** Environment mode

**Values:**
- `development` - Development mode (default)
- `production` - Production mode
- `test` - Testing mode

**Note:** Usually set automatically by Next.js, but can be overridden if needed.

## Environment-Specific Configuration

### Development Environment

Create `.env.local` for local development:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-dev-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-dev-service-role-key

# Authentication
JWT_SECRET=dev-secret-key-min-32-characters-long

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Production Environment

Create `.env.production.local` for production:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-prod-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-prod-service-role-key

# Authentication (MUST be strong and unique)
JWT_SECRET=production-secret-min-32-characters-very-secure

# Application
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NODE_ENV=production
```

## Environment Variable Loading Order

Next.js loads environment variables in this order (later files override earlier ones):

1. `.env`
2. `.env.local` (ignored by git)
3. `.env.development` / `.env.production` / `.env.test`
4. `.env.development.local` / `.env.production.local` / `.env.test.local` (ignored by git)

**Best Practice:** Use `.env.local` for all local development variables.

## Docker Environment Variables

When using Docker, environment variables are loaded from:

1. `.env.local` file (via `env_file` in docker-compose.yml)
2. Environment variables set in `docker-compose.yml`
3. System environment variables

**Docker Compose Configuration:**
```yaml
services:
  app:
    env_file:
      - .env.local  # Loads variables from this file
    environment:
      NODE_ENV: production  # Can override here
```

## Security Best Practices

### 1. Never Commit Secrets

✅ **DO:**
- Commit `.env.example` with placeholder values
- Use `.gitignore` to exclude `.env.local` files
- Document required variables in README

❌ **DON'T:**
- Commit `.env.local` or any `.env` files with real values
- Share secrets in chat, email, or documentation
- Hardcode secrets in source code

### 2. Use Different Secrets Per Environment

- **Development**: Use simpler secrets (still secure)
- **Staging**: Use production-like secrets
- **Production**: Use strong, unique secrets

### 3. Rotate Secrets Regularly

- Change `JWT_SECRET` periodically in production
- Rotate `SUPABASE_SERVICE_ROLE_KEY` if compromised
- Update secrets after team member changes

### 4. Protect Service Role Key

- ⚠️ Never use in client-side code
- ⚠️ Only use in server-side API routes
- ⚠️ Consider using Row Level Security (RLS) when possible
- ⚠️ Monitor Supabase logs for unauthorized access

### 5. Environment Variable Naming

- Use `NEXT_PUBLIC_` prefix only for variables needed in browser
- Keep sensitive variables without prefix (server-only)
- Use descriptive, clear names

## Verification

### Method 1: Check Application Logs

**Development:**
```bash
npm run dev
# Look for any environment variable errors in console
```

**Docker:**
```bash
docker-compose logs app
# Check for environment variable errors
```

### Method 2: Test Supabase Connection

1. Try to register a new user
2. Check Supabase dashboard → Table Editor → `users` table
3. If user appears, connection is working

### Method 3: Verify in Code (Development Only)

**⚠️ Never log secrets in production!**

```typescript
// In a server-side file (e.g., API route)
console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
// ✅ Safe - this is a public variable

// console.log('Service Key:', process.env.SUPABASE_SERVICE_ROLE_KEY);
// ❌ NEVER do this - even in development!
```

### Method 4: Check Environment Variables

**Linux/Mac:**
```bash
# Check if variables are loaded (won't show values)
env | grep NEXT_PUBLIC
```

**Docker:**
```bash
docker-compose exec app env | grep NEXT_PUBLIC
```

## Troubleshooting

### Variables Not Loading

**Symptoms:**
- `undefined` values in code
- Connection errors
- Authentication failures

**Solutions:**

1. **Verify file exists:**
   ```bash
   ls -la .env.local
   ```

2. **Check file location:**
   - Must be in project root directory
   - Same level as `package.json`

3. **Restart server:**
   - Environment variables load at startup
   - Changes require server restart

4. **Check syntax:**
   ```env
   # ✅ Correct
   VARIABLE_NAME=value

   # ❌ Wrong
   VARIABLE_NAME = value  # Spaces around =
   VARIABLE_NAME="value"  # Quotes not needed (but OK)
   ```

5. **For Docker:**
   ```bash
   docker-compose down
   docker-compose up -d --build
   ```

### Supabase Connection Errors

**Symptoms:**
- "Cannot connect to Supabase" errors
- Authentication fails
- Database queries fail

**Solutions:**

1. **Verify URL format:**
   ```env
   # ✅ Correct
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co

   # ❌ Wrong
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co/  # Trailing slash
   NEXT_PUBLIC_SUPABASE_URL=http://xxxxx.supabase.co     # HTTP instead of HTTPS
   ```

2. **Verify service role key:**
   - Must be the `service_role` key, not `anon` key
   - Check in Supabase → Settings → API
   - Key should start with `eyJ...`

3. **Check project status:**
   - Ensure Supabase project is active (not paused)
   - Check for service alerts in dashboard

### JWT Authentication Errors

**Symptoms:**
- Can't stay logged in
- Token verification fails
- "Unauthorized" errors

**Solutions:**

1. **Verify JWT_SECRET is set:**
   ```bash
   # Check if variable exists (won't show value)
   grep JWT_SECRET .env.local
   ```

2. **Check secret length:**
   - Should be at least 32 characters
   - Generate new one if too short

3. **Ensure consistency:**
   - Same secret must be used across all instances
   - Restart all services after changing secret

4. **Clear browser cookies:**
   - Old tokens may be invalid
   - Clear cookies and re-login

### Docker Environment Issues

**Symptoms:**
- Variables not available in container
- Different values than expected

**Solutions:**

1. **Check docker-compose.yml:**
   ```yaml
   env_file:
     - .env.local  # Must be present
   ```

2. **Rebuild container:**
   ```bash
   docker-compose down
   docker-compose up -d --build
   ```

3. **Verify file is mounted:**
   - `.env.local` must exist in project root
   - Docker reads from host filesystem

4. **Check container logs:**
   ```bash
   docker-compose logs app | grep -i env
   ```

## Additional Resources

- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [Supabase Documentation](https://supabase.com/docs)
- [Docker Environment Variables](https://docs.docker.com/compose/environment-variables/)
- [JWT Best Practices](https://datatracker.ietf.org/doc/html/rfc8725)

## Quick Reference

### Minimum Required Setup

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
JWT_SECRET=your-32-character-secret-here
```

### Generate JWT Secret

```bash
# Linux/Mac
openssl rand -base64 32

# Windows PowerShell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

### Verify Setup

1. File exists: `ls .env.local`
2. Variables set: `grep -v "^#" .env.local | grep -v "^$"`
3. Application starts: `npm run dev` or `docker-compose up`

---

**Need help?** Check the [README.md](./README.md) or [QUICKSTART.md](./QUICKSTART.md) for more information.
