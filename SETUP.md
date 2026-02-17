# SG Prime Enterprises Setup Instructions

This document provides step-by-step instructions to set up the SG Prime Enterprises web application on your local machine or VPS.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher): [Download Node.js](https://nodejs.org/)
- **MySQL** (v8.0 or higher): [Download MySQL](https://dev.mysql.com/downloads/mysql/)
- **npm** (comes with Node.js)

## Step 1: Database Setup

1. **Start MySQL server**:

   ```bash
   # Windows
   net start MySQL80

   # macOS/Linux
   sudo systemctl start mysql
   ```

2. **Login to MySQL**:

   ```bash
   mysql -u root -p
   ```

3. **Create database**:

   ```sql
   CREATE DATABASE sg_prime_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

4. **Import the schema** (creates tables only):

   ```bash
   # Exit MySQL first (type 'exit')
   mysql -u root -p sg_prime_db < database/schema.sql
   ```

5. **Install database seeder dependencies**:

   ```bash
   cd database
   npm install
   ```

6. **Configure backend environment** (required for seeders):

   Make sure `backend/.env` is configured with your database credentials (see Step 2 for details). The seeders read from this file.

7. **Seed the database** with sample data:

   ```bash
   # From the database/ directory
   npm run seed
   ```

   This will populate:
   - **3 categories**: Erosion Control, Greenhouse Products, Indoor and Outdoor Gardening
   - **7 products**: Coir Geo Textile, Coir Geotextile Bale, Coir Logs, Coir Stitched Blanket, Open Top Bag, Grow Cubes, Starter Plugs

8. **Verify the data**:
   ```bash
   mysql -u root -p sg_prime_db
   ```
   ```sql
   SELECT COUNT(*) FROM categories;  -- Should return 3
   SELECT COUNT(*) FROM products;    -- Should return 7
   SELECT COUNT(*) FROM enquiries;   -- Should return 0 (no sample enquiries by default)
   ```

### Database Management Commands

The database seeders provide useful commands for development:

```bash
cd database

# Populate database with sample data
npm run seed

# Clear all data from database (requires confirmation)
npm run seed:reset

# Clear and re-populate database
npm run seed:fresh
```

**Note**: You can safely run `npm run seed` multiple times - it uses upsert operations to avoid duplicates.

## Step 2: Backend Configuration

1. **Navigate to backend folder**:

   ```bash
   cd backend
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Create environment file**:

   ```bash
   # Windows PowerShell
   Copy-Item .env.example .env

   # macOS/Linux
   cp .env.example .env
   ```

4. **Edit `.env` file** with your configuration:

   ```env
   # Server
   PORT=5000
   NODE_ENV=development

   # Database
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=sg_prime_db

   # JWT Authentication
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRES_IN=24h

   # Admin Credentials
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=Admin@123

   # Email Configuration (for enquiry notifications)
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   EMAIL_FROM=noreply@sgprimeenterprises.com

   # Frontend URL (for CORS)
   FRONTEND_URL=http://localhost:5173
   ```

   **Important Notes**:
   - Replace `your_mysql_password` with your actual MySQL root password
   - Change `JWT_SECRET` to a random secure string
   - For Gmail SMTP, use an [App Password](https://support.google.com/accounts/answer/185833) instead of your regular password
   - The `ADMIN_USERNAME` and `ADMIN_PASSWORD` are used for admin login

5. **Create uploads directory**:

   ```bash
   # The directory should already exist, but verify:
   mkdir -p uploads/products
   ```

6. **Start the backend server**:

   ```bash
   npm start
   ```

   You should see:

   ```
   Server running on port 5000
   Database connected successfully
   ```

7. **Test the API** (in a new terminal):

   ```bash
   # Health check
   curl http://localhost:5000/api/health

   # Get categories
   curl http://localhost:5000/api/categories

   # Get products
   curl http://localhost:5000/api/products
   ```

## Step 3: Frontend Configuration

1. **Open a new terminal** and navigate to frontend folder:

   ```bash
   cd frontend
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Verify Vite configuration** (`vite.config.js`):
   The proxy should already be configured to point to `http://localhost:5000`:

   ```javascript
   server: {
     proxy: {
       '/api': 'http://localhost:5000',
       '/uploads': 'http://localhost:5000'
     }
   }
   ```

4. **Start the development server**:

   ```bash
   npm run dev
   ```

   You should see:

   ```
   VITE v5.0.11  ready in 500 ms

   ➜  Local:   http://localhost:5173/
   ➜  Network: use --host to expose
   ```

5. **Open your browser**:
   Navigate to [http://localhost:5173](http://localhost:5173)

## Step 4: Running Both Servers Simultaneously

Instead of running frontend and backend in separate terminals, you can use the root-level script:

1. **Navigate to project root**:

   ```bash
   cd ..  # If you're in frontend folder
   ```

2. **Install root dependencies**:

   ```bash
   npm install
   ```

3. **Run both servers**:

   ```bash
   npm run dev
   ```

   This will start both backend (port 5000) and frontend (port 5173) concurrently.

## Step 5: Admin Access

1. **Navigate to admin login**:
   [http://localhost:5173/admin/login](http://localhost:5173/admin/login)

2. **Login with credentials** (from your `.env` file):
   - Username: `admin` (or your custom ADMIN_USERNAME)
   - Password: `Admin@123` (or your custom ADMIN_PASSWORD)

3. **Admin features**:
   - **Dashboard**: View statistics and recent enquiries
   - **Products**: Add, edit, delete products with image uploads
   - **Categories**: Manage product categories
   - **Enquiries**: View and manage customer enquiries

## Step 6: Testing Features

### Customer-Facing Pages

1. **Home Page** (`/`):
   - Hero section with parallax animation
   - Categories section
   - Featured products
   - Why choose us section
   - CTA section

2. **Products Page** (`/products`):
   - View all products
   - Filter by category
   - Filter featured products

3. **Product Detail** (`/products/:id`):
   - Zoom-on-hover image
   - Specifications table
   - Enquiry form
   - Related products

4. **Category Page** (`/category/:slug`):
   - Category-specific products
   - Breadcrumb navigation

5. **Contact Page** (`/contact`):
   - Contact form
   - Company information
   - Send enquiries

### Admin Features

1. **Product Management**:
   - Add new product with image upload
   - Edit existing products
   - Delete products
   - Mark as featured
   - Set display order

2. **Category Management**:
   - Add/edit/delete categories
   - Manage slugs and descriptions

3. **Enquiry Management**:
   - View all enquiries
   - Filter by status (pending/contacted/resolved)
   - Update enquiry status
   - View full enquiry details

## Troubleshooting

### Database Connection Issues

**Error**: `ER_ACCESS_DENIED_ERROR`

- **Solution**: Check your MySQL username and password in `.env`

**Error**: `ER_BAD_DB_ERROR`

- **Solution**: Ensure database `sg_prime_db` exists:
  ```sql
  SHOW DATABASES;
  ```

### Backend Server Issues

**Error**: `Port 5000 already in use`

- **Solution**: Kill the process using port 5000 or change `PORT` in `.env`:

  ```bash
  # Windows
  netstat -ano | findstr :5000
  taskkill /PID <PID> /F

  # macOS/Linux
  lsof -ti:5000 | xargs kill -9
  ```

**Error**: `Cannot find module`

- **Solution**: Reinstall dependencies:
  ```bash
  cd backend
  rm -rf node_modules package-lock.json
  npm install
  ```

### Frontend Server Issues

**Error**: `Failed to resolve import`

- **Solution**: Clear cache and reinstall:
  ```bash
  cd frontend
  rm -rf node_modules .vite package-lock.json
  npm install
  ```

**Error**: `CORS error`

- **Solution**: Ensure backend `FRONTEND_URL` in `.env` matches frontend URL

### Email Issues

**Error**: `Invalid login` (Gmail)

- **Solution**: Use Gmail App Password instead of regular password
- Enable 2-factor authentication
- Generate App Password: [https://myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)

**Error**: Email not sending

- **Solution**: Check SMTP settings in `.env`
- Test with a tool like [Mailtrap](https://mailtrap.io/) for development

## Production Deployment

### Build for Production

1. **Build frontend**:

   ```bash
   cd frontend
   npm run build
   ```

   This creates a `dist` folder with optimized static files.

2. **Configure Nginx** (see main README.md for full configuration):

   ```nginx
   server {
     listen 80;
     server_name yourdomain.com;

     # Serve frontend
     location / {
       root /var/www/sg-prime/frontend/dist;
       try_files $uri $uri/ /index.html;
     }

     # Proxy API requests
     location /api {
       proxy_pass http://localhost:5000;
     }

     # Serve uploads
     location /uploads {
       alias /var/www/sg-prime/backend/uploads;
     }
   }
   ```

3. **Use PM2 for backend**:
   ```bash
   npm install -g pm2
   cd backend
   pm2 start src/server.js --name sg-prime-backend
   pm2 save
   pm2 startup
   ```

### Environment Variables for Production

Update `.env` with production values:

```env
NODE_ENV=production
FRONTEND_URL=https://yourdomain.com
JWT_SECRET=use-a-strong-random-secret-here
```

### Security Checklist

- [ ] Change default admin password
- [ ] Use strong JWT secret (at least 32 random characters)
- [ ] Configure proper SMTP credentials
- [ ] Enable HTTPS (use Let's Encrypt)
- [ ] Set appropriate file upload limits
- [ ] Configure firewall rules
- [ ] Regular database backups
- [ ] Keep dependencies updated

## Support

For issues or questions:

- Check the main [README.md](../README.md)
- Review API documentation in README.md
- Check server logs for errors

## Quick Reference

### Default Credentials

- **Admin Username**: `admin`
- **Admin Password**: `Admin@123` (change in production!)

### Default Ports

- **Backend**: 5000
- **Frontend**: 5173
- **MySQL**: 3306

### Important Directories

- **Uploads**: `backend/uploads/products/`
- **Database**: `database/schema.sql`
- **Logs**: Check terminal/console output

### Sample Data

- 3 categories (Erosion Control, Greenhouse Products, Gardening Products)
- 6 products (2 per category)
- 3 sample enquiries
