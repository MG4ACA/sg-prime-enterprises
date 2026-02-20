# 🚀 Hostinger VPS Deployment Guide

## SG Prime Enterprises (MEVN Stack)

This guide will walk you through deploying your SG Prime Enterprises application (Coir Products Industrial Catalog - Vue.js frontend + Express.js backend) on a Hostinger VPS with the MEVN stack template.

---

## 📋 Prerequisites

- Hostinger VPS with Ubuntu 22.04 + MEVN Stack template installed
- SSH access to your VPS
- Your VPS IP address
- Domain name (optional, but recommended)

---

## 🎯 Architecture Overview

```
┌─────────────────────────────────────────┐
│         Hostinger VPS Server            │
│                                         │
│  ┌────────────────────────────────┐    │
│  │  Nginx (Reverse Proxy)         │    │
│  │  Port 80/443                   │    │
│  └──────────┬─────────────────────┘    │
│             │                           │
│  ┌──────────▼──────────┐  ┌──────────┐ │
│  │  Vue.js Frontend    │  │  Backend │ │
│  │  (Static Files)     │  │  API     │ │
│  │                     │  │  Port    │ │
│  │                     │  │  3001    │ │
│  └─────────────────────┘  └────┬─────┘ │
│                                 │       │
│                          ┌──────▼─────┐ │
│                          │   MySQL    │ │
│                          │  Database  │ │
│                          └────────────┘ │
└─────────────────────────────────────────┘
```

---

## 📦 Step 1: Connect to Your VPS

```bash
# Connect via SSH
ssh root@your_vps_ip

# Or if you have a username
ssh username@your_vps_ip
```

---

## 🔧 Step 2: Initial Server Setup

### 2.1 Update System Packages

```bash
sudo apt update && sudo apt upgrade -y
```

### 2.2 Install Required Tools

```bash
# Install Git
sudo apt install git -y

# Install PM2 (Process Manager)
sudo npm install -g pm2

# Install Nginx (if not already installed)
sudo apt install nginx -y

# Install MySQL client (if needed)
sudo apt install mysql-server -y
sudo apt install mysql-client -y
sudo systemctl status mysql
sudo systemctl start mysql
```

### 2.3 Configure Firewall

```bash
# Allow SSH, HTTP, and HTTPS
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

---

## 🗄️ Step 3: Set Up MySQL Database

### 3.1 Secure MySQL Installation

```bash
sudo mysql_secure_installation
```

Follow the prompts to:

- Set root password
- Remove anonymous users
- Disallow root login remotely
- Remove test database

### 3.2 Create Database and User

```bash
# Login to MySQL
sudo mysql -u root -p

# Run these SQL commands:
```

```sql
-- Create database
CREATE DATABASE sg_prime_db;

-- Create user (replace 'your_password' with a strong password)
CREATE USER 'sg_prime_user'@'localhost' IDENTIFIED BY 'your_secure_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON sg_prime_db.* TO 'sg_prime_user'@'localhost';

-- Flush privileges
FLUSH PRIVILEGES;

-- Exit MySQL
EXIT;
```

---

## 📥 Step 4: Deploy Your Application

### 4.1 Create Application Directory

```bash
# Create directory for your app
sudo mkdir -p /var/www/sg-prime-enterprises
cd /var/www/sg-prime-enterprises
```

### 4.2 Clone Your Repository

```bash
# If your code is on GitHub (replace with your repository URL)
sudo git clone https://github.com/YOUR_USERNAME/sg-prime-enterprises.git backend

# Or upload your code using SCP from your local machine:
# scp -r /path/to/sg-prime-enterprises root@your_vps_ip:/var/www/sg-prime-enterprises
```

### 4.3 Set Correct Permissions

```bash
# Change ownership
sudo chown -R $USER:$USER /var/www/sg-prime-enterprises

# Set permissions
sudo chmod -R 755 /var/www/sg-prime-enterprises
```

---

cd backend

git fetch --all
git branch
git checkout 'your_branch'
git pull origin main

if errors occur try below
git reset --hard

## 🔨 Step 5: Set Up Backend

### 5.1 Navigate to Backend Directory

```bash
cd /var/www/sg-prime-enterprises/backend
```

### 5.2 Install Dependencies

```bash
npm install --production
```

### 5.3 Configure Environment Variables

```bash
# Create .env file
nano .env
```

Add the following configuration:

```env
# Server Configuration
PORT=3001
NODE_ENV=production

# Database Configuration
DB_HOST=localhost
DB_USER=sg_prime_user
DB_PASSWORD=your_secure_password
DB_NAME=sg_prime_db

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_min_32_chars
JWT_EXPIRES_IN=24h

# Admin Credentials (Single Admin)
ADMIN_USERNAME=admin
ADMIN_PASSWORD=Admin@2026

# Email Configuration (for enquiry notifications)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_TO=contact@sgprimeenterprises.com

# Frontend URL (for CORS)
FRONTEND_URL=https://sgprimeenterprises.lumicore-labs.com

# Upload Configuration
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/webp
```

**To generate a secure JWT secret:**

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 5.4 Initialize Database

```bash
# Navigate to database directory
cd ../database

# Install database dependencies
npm install

# Run complete database setup (creates DB, tables, and seeds data)
npm run setup

# Navigate back to backend
cd ../backend
```

### 5.5 Test Backend Locally

```bash
# Test if backend works
npm start

# In another terminal, test the API
curl http://localhost:3001/api/health
```

If successful, you should see a response. Press `Ctrl+C` to stop.

### 5.6 Set Up PM2 for Backend

```bash
# Start backend with PM2
pm2 start src/server.js --name sg-prime-backend

# Save PM2 configuration
pm2 save

# Set PM2 to start on boot
pm2 startup

# Check status
pm2 status
```

**Useful PM2 Commands:**

```bash
# View logs
pm2 logs sg-prime-backend

# Restart app
pm2 restart sg-prime-backend

# Stop app
pm2 stop sg-prime-backend

# Monitor
pm2 monit
```

---

## 🎨 Step 6: Set Up Frontend

### 6.1 Navigate to Frontend Directory

## clone frotend repo then

```bash
cd /var/www/sg-prime-enterprises/frontend
```

### 6.2 Configure API Endpoint

create environment file:

```bash
nano .env.production
```

```env
VITE_API_BASE_URL=https://sgprimeenterprises.lumicore-labs.com/api
```

or Update the frontend to point to your backend API:

```bash
nano src/services/api.js
```

Update the base URL:

```javascript
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'https://sgprimeenterprises.lumicore-labs.com/api';
```

### 6.3 Install Dependencies and Build

```bash
# Install dependencies
npm install

# Build for production
npm run build
```

This creates a `dist` folder with optimized static files.

### 6.4 Move Build to Nginx Directory

```bash
# Create directory for frontend
sudo mkdir -p /var/www/sg-prime-enterprises/dist

# Copy built files
sudo cp -r dist/* /var/www/sg-prime-enterprises/dist/

# Set permissions
sudo chown -R www-data:www-data /var/www/sg-prime-enterprises/dist
sudo chmod -R 755 /var/www/sg-prime-enterprises/dist
```

---

## 🌐 Step 7: Configure Nginx

### 7.1 Create Nginx Configuration

```bash
sudo nano /etc/nginx/sites-available/sg-prime-enterprises
```

Add this configuration:

```nginx
# Upstream backend
upstream sgprime_backend {
    server localhost:3001;
    keepalive 64;
}

server {
    listen 80;
    server_name sgprimeenterprises.lumicore-labs.com www.sgprimeenterprises.lumicore-labs.com;
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Frontend - Serve Vue.js app
    location / {
        root /var/www/sg-prime-enterprises/dist;
        index index.html;
        try_files $uri $uri/ /index.html;

        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    # Backend API - Proxy to Express.js
    location /api/ {
        proxy_pass http://sgprime_backend/api/;
        proxy_http_version 1.1;

        # Headers
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;

        # Disable cache for API
        proxy_cache_bypass $http_upgrade;
    }

    # Health check endpoint
    location /health {
        proxy_pass http://sgprime_backend/health;
        access_log off;
    }

    # Serve uploaded product images
    location /uploads/ {
        alias /var/www/sg-prime-enterprises/backend/uploads/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Logs
    access_log /var/log/nginx/sg-prime-access.log;
    error_log /var/log/nginx/sg-prime-error.log;
}
```

### 7.2 Enable Site

```bash
# Create symbolic link
sudo ln -s /etc/nginx/sites-available/sg-prime-enterprises /etc/nginx/sites-enabled/

# Remove default site (optional)
sudo rm /etc/nginx/sites-enabled/default

# Test Nginx configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx

# Enable Nginx on boot
sudo systemctl enable nginx
```

---

## 🔒 Step 8: Set Up SSL (Optional but Recommended)

### 8.1 Install Certbot

```bash
sudo apt install certbot python3-certbot-nginx -y
```

### 8.2 Obtain SSL Certificate

**Note:** You need a domain name pointed to your VPS IP for this step.

```bash
# Replace with your domain
sudo certbot --nginx -d sgprimeenterprises.lumicore-labs.com -d www.sgprimeenterprises.lumicore-labs.com
```

Certbot will:

- Obtain certificate
- Automatically configure Nginx
- Set up automatic renewal

### 8.3 Test Auto-Renewal

```bash
sudo certbot renew --dry-run
```

### 8.4 Update Frontend API URL

After SSL is set up, update your frontend API URL to use HTTPS:

```bash
nano /var/www/sg-prime-enterprises/frontend/src/services/api.js
```

Change to:

```javascript
const API_BASE_URL = 'https://sgprimeenterprises.lumicore-labs.com/api';
```

Rebuild and redeploy:

```bash
cd /var/www/sg-prime-enterprises/frontend
npm run build
sudo cp -r dist/* /var/www/sg-prime-enterprises/frontend/
```

---

## ✅ Step 9: Verify Deployment

### 9.1 Check Backend

```bash
# Check PM2 status
pm2 status

# Check backend logs
pm2 logs sg-prime-backend

# Test API directly
curl http://localhost:3001/api/health
```

### 9.2 Check Nginx

```bash
# Check Nginx status
sudo systemctl status nginx

# Check Nginx logs
sudo tail -f /var/log/nginx/sg-prime-error.log
```

### 9.3 Test Application

Open your browser and visit:

- `http://your_vps_ip` (or `https://sgprimeenterprises.lumicore-labs.com`)

You should see your SG Prime Enterprises catalog homepage!

---

## 🔄 Step 10: Deployment Script (For Updates)

Create a deployment script for easy updates:

```bash
nano /var/www/sg-prime-enterprises/deploy.sh
```

```bash
#!/bin/bash

echo "🚀 Starting deployment..."

# Navigate to project directory
cd /var/www/sg-prime-enterprises

# Pull latest changes (if using Git)
echo "📥 Pulling latest changes..."
git pull origin main

# Backend deployment
echo "🔨 Deploying backend..."
cd backend
npm install --production
pm2 restart sg-prime-backend

# Frontend deployment
echo "🎨 Deploying frontend..."
cd ../frontend
npm install
npm run build
sudo cp -r dist/* /var/www/sg-prime-enterprises/frontend/

# Restart Nginx
echo "🌐 Restarting Nginx..."
sudo systemctl restart nginx

echo "✅ Deployment complete!"
```

Make it executable:

```bash
chmod +x /var/www/sg-prime-enterprises/deploy.sh
```

Run deployment:

```bash
./deploy.sh
```

---

## 🛠️ Maintenance Commands

### Check Application Status

```bash
# Check all services
pm2 status
sudo systemctl status nginx
sudo systemctl status mysql

# Check disk space
df -h

# Check memory usage
free -m
```

### View Logs

```bash
# Backend logs
pm2 logs sg-prime-backend

# Nginx access logs
sudo tail -f /var/log/nginx/sg-prime-access.log

# Nginx error logs
sudo tail -f /var/log/nginx/sg-prime-error.log

# MySQL logs
sudo tail -f /var/log/mysql/error.log
```

### Backup Database

```bash
# Create backup directory
mkdir -p ~/backups

# Backup database
mysqldump -u sg_prime_user -p sg_prime_db > ~/backups/sg_prime_db_$(date +%Y%m%d_%H%M%S).sql

# Create automated backup script
nano ~/backup-db.sh
```

```bash
#!/bin/bash
BACKUP_DIR=~/backups
mkdir -p $BACKUP_DIR
mysqldump -u sg_prime_user -p'your_secure_password' sg_prime_db > $BACKUP_DIR/sg_prime_db_$(date +%Y%m%d_%H%M%S).sql

# Keep only last 7 days of backups
find $BACKUP_DIR -name "sg_prime_db_*.sql" -mtime +7 -delete
```

```bash
chmod +x ~/backup-db.sh

# Add to crontab for daily backups at 2 AM
crontab -e
# Add: 0 2 * * * /home/username/backup-db.sh
```

---

## 🐛 Troubleshooting

### Backend Not Starting

```bash
# Check logs
pm2 logs sg-prime-backend

# Common issues:
# 1. Port 3001 already in use
sudo lsof -i :3001
sudo kill -9 <PID>

# 2. Database connection failed
# Check .env file and MySQL credentials
mysql -u sg_prime_user -p sg_prime_db
```

### Frontend Not Loading

```bash
# Check Nginx error logs
sudo tail -f /var/log/nginx/sg-prime-error.log

# Verify files exist
ls -la /var/www/sg-prime-enterprises/frontend

# Test Nginx configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

### 502 Bad Gateway

```bash
# Backend is not running
pm2 status
pm2 restart sg-prime-backend

# Check backend is listening on port 3001
sudo netstat -tlnp | grep 3001
```

### Database Connection Issues

```bash
# Test MySQL connection
mysql -u sg_prime_user -p sg_prime_db

# Check MySQL is running
sudo systemctl status mysql

# Restart MySQL
sudo systemctl restart mysql

# Check backend .env file
cat backend/.env
```

---

## 📊 Monitoring Setup (Optional)

### Install Monitoring Tools

```bash
# Install htop for resource monitoring
sudo apt install htop -y

# Use PM2 monitoring
pm2 install pm2-server-monit
```

### Set Up PM2 Web Dashboard

```bash
# Install PM2 web interface
pm2 install pm2-web

# Access at: http://your_vps_ip:9615
```

---

## 🎯 Performance Optimization

### Enable Gzip Compression in Nginx

Edit `/etc/nginx/nginx.conf`:

```bash
sudo nano /etc/nginx/nginx.conf
```

Add inside `http` block:

```nginx
gzip on;
gzip_vary on;
gzip_proxied any;
gzip_comp_level 6;
gzip_types text/plain text/css text/xml text/javascript application/json application/javascript application/xml+rss application/rss+xml font/truetype font/opentype application/vnd.ms-fontobject image/svg+xml;
```

### Configure Node.js for Production

In PM2 configuration:

```bash
pm2 start src/server.js --name sg-prime-backend -i max --node-args="--max-old-space-size=1024"
```

---

## 📚 Additional Resources

- [Hostinger VPS Documentation](https://www.hostinger.com/tutorials/vps)
- [PM2 Documentation](https://pm2.keymetrics.io/docs/usage/quick-start/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [Let's Encrypt Certbot](https://certbot.eff.org/)

---

## 📞 Support

If you encounter issues:

1. Check logs first (`pm2 logs`, nginx logs)
2. Verify all services are running
3. Check firewall settings
4. Review configuration files
5. Restart services in order: MySQL → Backend → Nginx

---

## 🎉 Congratulations!

Your SG Prime Enterprises Coir Products Catalog is now live on Hostinger VPS!

**Access your application at:**

- 🌐 Frontend: `https://sgprimeenterprises.lumicore-labs.com`
- 🔌 Backend API: `https://sgprimeenterprises.lumicore-labs.com/api`

**Default Admin Login:**

- Username: `admin`
- Password: `Admin@2026` (change this in production .env file)

---

## 📝 Post-Deployment Checklist

- [ ] Backend is running via PM2
- [ ] Database is created and seeded
- [ ] Frontend is built and served by Nginx
- [ ] API endpoints are accessible
- [ ] Application login works
- [ ] SSL certificate is installed (if using domain)
- [ ] Firewall is configured
- [ ] Backups are automated
- [ ] Monitoring is set up
- [ ] Deployment script is ready

---

**Last Updated:** February 2026  
**Version:** 1.0.0  
**Project:** SG Prime Enterprises - Coir Products Industrial Catalog
