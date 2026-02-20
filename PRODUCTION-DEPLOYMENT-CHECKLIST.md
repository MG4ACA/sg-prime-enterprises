# 🚀 Production Deployment Checklist
### SG Prime Enterprises - Final Pre-Deployment Verification

**Date:** ___________  
**Deployed By:** ___________  
**Domain:** ___________  
**Server IP:** ___________

---

## ✅ PRE-DEPLOYMENT (Local)

### Code Quality & Security
- [ ] All validation fixes applied (enquiry, category, product creation)
- [ ] Rate limiting enabled on `/api/admin/login` (5 attempts per 15 min)
- [ ] Password minimum length set to 8 characters
- [ ] No `.env` files committed to git (check `.gitignore`)
- [ ] No hardcoded secrets in code
- [ ] All console.log statements reviewed (keep only necessary ones)

### Database
- [ ] Current database backed up
- [ ] Migration script tested locally: `node database/migrate-to-production.js`
- [ ] Database schema matches production requirements

### Frontend
- [ ] Build command works: `cd frontend && npm run build`
- [ ] Production build tested locally: `npm run preview`
- [ ] API base URL configured correctly for production

### Dependencies
- [ ] All packages installed: `cd backend && npm install`
- [ ] express-rate-limit installed (check package.json)
- [ ] No critical security vulnerabilities: `npm audit`

---

## 🖥️ SERVER SETUP (Hostinger VPS)

### Initial Access
- [ ] SSH access confirmed: `ssh root@your_vps_ip`
- [ ] Server timezone set correctly: `timedatectl`
- [ ] Server packages updated: `apt update && apt upgrade -y`

### Required Software
- [ ] Node.js installed (v18+): `node --version`
- [ ] MySQL installed and running: `systemctl status mysql`
- [ ] Nginx installed: `nginx -v`
- [ ] PM2 installed globally: `npm install -g pm2`
- [ ] Git installed: `git --version`

### Database Setup
- [ ] MySQL root password changed (not default)
- [ ] Production database user created:
```sql
CREATE USER 'sgprime_user'@'localhost' IDENTIFIED BY 'STRONG_PASSWORD';
GRANT ALL PRIVILEGES ON sg_prime_enterprises.* TO 'sgprime_user'@'localhost';
FLUSH PRIVILEGES;
```
- [ ] Database created: `CREATE DATABASE sg_prime_enterprises;`
- [ ] Database migration completed successfully

### Domain & SSL
- [ ] Domain DNS pointed to server IP
- [ ] Domain propagation verified: `nslookup your-domain.com`
- [ ] SSL certificate installed (Let's Encrypt)
- [ ] HTTPS redirect configured in Nginx

---

## 📁 DEPLOYMENT STEPS

### 1. Upload Code
- [ ] Code repository cloned to server: `/var/www/sg-prime-enterprises`
- [ ] Correct branch checked out (main/production)
- [ ] File permissions set: `chown -R www-data:www-data /var/www/sg-prime-enterprises`

### 2. Backend Configuration
- [ ] Navigate to backend: `cd /var/www/sg-prime-enterprises/backend`
- [ ] Dependencies installed: `npm install --production`
- [ ] `.env` file created from template
- [ ] `.env` configured with production values:
  - [ ] `NODE_ENV=production`
  - [ ] `DB_PASSWORD` (production database password)
  - [ ] `JWT_SECRET` (generated 64-char random string)
  - [ ] `EMAIL_USER` and `EMAIL_PASSWORD` (Gmail App Password)
  - [ ] `FRONTEND_URL` (https://your-domain.com)
- [ ] Uploads directory exists: `mkdir -p uploads/products`
- [ ] Uploads directory writable: `chmod 755 uploads/products`

### 3. Database Migration
- [ ] Navigate to database: `cd /var/www/sg-prime-enterprises/database`
- [ ] Install migration dependencies: `npm install`
- [ ] Update `.env` path in migration script if needed
- [ ] Run migration: `node migrate-to-production.js`
- [ ] Verify enquiries table created: `mysql -u root -p -e "SHOW TABLES FROM sg_prime_enterprises;"`

### 4. Change Default Admin Password
- [ ] Log into admin panel: `https://your-domain.com/admin/login`
- [ ] Login with: `admin` / `admin123`
- [ ] Navigate to "Change Password"
- [ ] Set a strong password (min 8 chars)
- [ ] Document new admin credentials in secure location (password manager)

### 5. Frontend Build & Deployment
- [ ] Navigate to frontend: `cd /var/www/sg-prime-enterprises/frontend`
- [ ] Install dependencies: `npm install`
- [ ] Build for production: `npm run build`
- [ ] Build directory created: `ls -la dist/`
- [ ] Nginx configured to serve from `/var/www/sg-prime-enterprises/frontend/dist`

### 6. Backend Process Management
- [ ] PM2 ecosystem configured (or use direct command)
- [ ] Backend started with PM2:
```bash
cd /var/www/sg-prime-enterprises/backend
pm2 start src/server.js --name sg-prime-api
pm2 save
pm2 startup
```
- [ ] PM2 auto-start on reboot enabled
- [ ] Backend logs checked: `pm2 logs sg-prime-api`
- [ ] Backend status verified: `pm2 status`

### 7. Nginx Configuration
- [ ] Nginx config created: `/etc/nginx/sites-available/sg-prime`
- [ ] Symlink created: `ln -s /etc/nginx/sites-available/sg-prime /etc/nginx/sites-enabled/`
- [ ] Nginx config tested: `nginx -t`
- [ ] Nginx reloaded: `systemctl reload nginx`
- [ ] Port 80 and 443 open in firewall
```bash
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable
```

**Sample Nginx Config Location:** See [HOSTINGER_VPS_DEPLOYMENT.md](HOSTINGER_VPS_DEPLOYMENT.md#step-7-nginx-configuration)

---

## 🧪 POST-DEPLOYMENT TESTING

### Backend API Tests
- [ ] Health check: `curl https://your-domain.com/api/health`
- [ ] Categories endpoint: `curl https://your-domain.com/api/categories`
- [ ] Products endpoint: `curl https://your-domain.com/api/products`
- [ ] Admin login (with rate limiting):
```bash
# Should work
curl -X POST https://your-domain.com/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"your_new_password"}'

# After 6 attempts, should rate limit
```

### Frontend Tests
- [ ] Homepage loads: `https://your-domain.com`
- [ ] Products page works: `https://your-domain.com/products`
- [ ] Product detail view displays correctly
- [ ] Contact form submits successfully
- [ ] Enquiry email received at configured EMAIL_TO address
- [ ] Product images display (check uploads path)

### Admin Panel Tests
- [ ] Admin login page: `https://your-domain.com/admin/login`
- [ ] Login with new credentials succeeds
- [ ] Rate limiting works (try 6 failed login attempts)
- [ ] Dashboard displays stats correctly
- [ ] Categories management works (create, edit, delete)
- [ ] Products management works (create with image, edit, delete)
- [ ] Enquiries list displays
- [ ] Enquiry status updates work
- [ ] Password change functionality works

### Security Tests
- [ ] HTTPS redirect works (http:// → https://)
- [ ] SSL certificate valid (no browser warnings)
- [ ] Security headers present:
```bash
curl -I https://your-domain.com | grep -i security
```
- [ ] Rate limiting blocks after limit exceeded
- [ ] Input validation working (try submitting empty enquiry form)
- [ ] File upload validation (try uploading .txt file as product image)
- [ ] JWT expires after configured time (24h)
- [ ] CORS only allows configured FRONTEND_URL

---

## 📊 MONITORING & MAINTENANCE

### Immediate Post-Deploy
- [ ] Set up server monitoring (UptimeRobot, Pingdom, etc.)
- [ ] Configure log rotation for PM2 logs
```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```
- [ ] Database backup script configured (daily)
```bash
# Add to crontab: crontab -e
0 2 * * * mysqldump -u root -p sg_prime_enterprises > /backups/db_$(date +\%Y\%m\%d).sql
```

### Regular Checks
- [ ] Monitor server resources: `pm2 monit`
- [ ] Check error logs: `pm2 logs sg-prime-api --err`
- [ ] Monitor disk space: `df -h`
- [ ] Check MySQL performance: `mysql -e "SHOW PROCESSLIST;"`

### Documentation
- [ ] Server access credentials documented
- [ ] Database credentials stored securely
- [ ] Admin credentials in password manager
- [ ] SSL certificate renewal date noted (Let's Encrypt is 90 days)
- [ ] Emergency contact procedures established

---

## 🚨 ROLLBACK PLAN

If something goes wrong:

1. **Backend Issues:**
```bash
pm2 stop sg-prime-api
# Fix the issue
pm2 restart sg-prime-api
```

2. **Database Issues:**
```bash
# Restore from backup
mysql -u root -p sg_prime_enterprises < /backups/db_YYYYMMDD.sql
```

3. **Complete Rollback:**
```bash
# Stop services
pm2 stop sg-prime-api
# Restore previous code version via git
cd /var/www/sg-prime-enterprises
git checkout previous_working_commit
# Reinstall dependencies
cd backend && npm install --production
cd ../frontend && npm run build
# Restore database
mysql -u root -p sg_prime_enterprises < /backups/db_YYYYMMDD.sql
# Restart
pm2 restart sg-prime-api
systemctl reload nginx
```

---

## ✅ DEPLOYMENT COMPLETE

**Final Sign-Off:**

- [ ] All tests passed
- [ ] Client notified of successful deployment
- [ ] Monitoring alerts configured
- [ ] This checklist archived for future reference

**Deployment Date:** ___________  
**Deployed By:** ___________  
**Sign-off:** ___________

---

## 📞 SUPPORT CONTACTS

- **Hosting:** Hostinger Support
- **Domain Registrar:** ___________
- **Developer:** ___________
- **Database Admin:** ___________

---

**Notes:**
- Keep this checklist for future updates and deployments
- Update checklist based on lessons learned
- Review and improve deployment process regularly
