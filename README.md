# SG Prime Enterprises - Industrial Coir Products Catalog

A high-end e-commerce web application for showcasing coir manufacturing products with advanced animations and professional UI/UX design.

## 📋 Quick Start

> **New to this project?** Follow the detailed step-by-step setup guide in [SETUP.md](./SETUP.md)

For experienced developers:

```bash
# 1. Import database
mysql -u root -p sg_prime_db < database/schema.sql

# 2. Configure backend
cd backend
cp .env.example .env
# Edit .env with your settings
npm install

# 3. Configure frontend
cd ../frontend
npm install

# 4. Run both servers (from project root)
cd ..
npm install
npm run dev
```

Access the application at [http://localhost:5173](http://localhost:5173)

## 🎨 Design Philosophy

**"Nature Distilled"** - A premium aesthetic combining earthy tones with modern web design principles.

### Color Palette

- **Canvas Background**: `#FFF1E8` - Airy and clean primary background
- **Secondary Accent**: `#D39A6A` - Hover states, buttons, sub-headers
- **Primary Brand**: `#9A5A2E` - Active links, primary buttons, headings
- **Deep Contrast**: `#3E1F0F` - Body text, footer backgrounds

## 🚀 Tech Stack

### Frontend

- **Vue 3** (Composition API)
- **Vite** (Build tool)
- **PrimeVue** (UI Components)
- **GSAP + ScrollTrigger** (Advanced animations)
- **VueUse** (Composition utilities)

### Backend

- **Express.js** (Node.js framework)
- **MySQL** (Database)
- **JWT** (Authentication)
- **Multer** (File uploads)
- **Nodemailer** (Email notifications)

## 📁 Project Structure

```
sg-prime-enterprises/
├── frontend/          # Vue 3 application
│   ├── src/
│   │   ├── components/
│   │   ├── views/
│   │   ├── composables/
│   │   ├── assets/
│   │   └── router/
│   └── package.json
├── backend/           # Express.js API
│   ├── src/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   └── config/
│   ├── uploads/       # Product images
│   └── package.json
└── database/          # MySQL schemas
    └── schema.sql
```

## 🛠️ Installation & Setup

### Prerequisites

- Node.js (v18 or higher)
- MySQL (v8 or higher)
- npm or yarn

### 1. Clone and Install

```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

### 2. Database Setup

```bash
# Login to MySQL
mysql -u root -p

# Create database and import schema
source database/schema.sql
```

### 3. Environment Configuration

Create `.env` file in the `backend/` directory:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=sg_prime_enterprises

# JWT
JWT_SECRET=your_super_secret_key_change_in_production
JWT_EXPIRES_IN=24h

# Admin Credentials
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_secure_password

# Email (for enquiry notifications)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_TO=contact@sgprimeenterprises.com
```

### 4. Run Development Server

```bash
# From root directory - runs both frontend and backend
npm run dev

# Or run separately:
npm run dev:frontend  # Frontend at http://localhost:5173
npm run dev:backend   # Backend at http://localhost:5000
```

## 🎯 Features

### Customer-Facing Features

- **Hero Section**: Split-screen design with parallax animations
- **Scrollytelling**: Background color transitions and staggered product cards
- **Product Catalog**: Category-based browsing with smooth animations
- **Product Details**: Animated specifications table, zoom-on-hover images
- **Enquiry Form**: Email notifications + database storage
- **SEO Optimized**: Meta tags, semantic HTML, structured data

### Admin Features

- **JWT Authentication**: Secure login system
- **Product Management**: Quick-add drawer with JSON spec editor
- **Image Upload**: Local VPS storage with multer
- **Category Management**: Add/edit/delete product categories
- **Enquiry Dashboard**: View and manage customer enquiries

## 🌐 API Endpoints

### Public Routes

- `GET /api/categories` - List all categories
- `GET /api/products` - List all products (with filtering)
- `GET /api/products/:id` - Get single product details
- `POST /api/enquiry` - Submit customer enquiry

### Admin Routes (Protected)

- `POST /api/admin/login` - Admin authentication
- `POST /api/admin/products` - Create new product
- `PUT /api/admin/products/:id` - Update product
- `DELETE /api/admin/products/:id` - Delete product
- `POST /api/admin/categories` - Create new category
- `GET /api/admin/enquiries` - List all enquiries

## 🚢 Deployment (VPS)

### Build for Production

```bash
# Build frontend
npm run build

# This creates frontend/dist/ folder
```

### VPS Setup

1. **Install PM2** (Process Manager)

```bash
npm install -g pm2
```

2. **Start Backend**

```bash
cd backend
pm2 start src/server.js --name sg-backend
pm2 save
pm2 startup
```

3. **Serve Frontend** (with Nginx)

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    # Frontend
    location / {
        root /path/to/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    # API Proxy
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Uploads
    location /uploads {
        alias /path/to/backend/uploads;
    }
}
```

## 📊 Database Schema

### Categories

- `id` (Primary Key)
- `name` (VARCHAR)
- `slug` (VARCHAR, unique)
- `description` (TEXT)
- `created_at` (TIMESTAMP)

### Products

- `id` (Primary Key)
- `category_id` (Foreign Key)
- `name` (VARCHAR)
- `description` (TEXT)
- `specs` (JSON)
- `image_url` (VARCHAR)
- `created_at` (TIMESTAMP)

### Enquiries

- `id` (Primary Key)
- `name` (VARCHAR)
- `email` (VARCHAR)
- `company` (VARCHAR)
- `phone` (VARCHAR)
- `message` (TEXT)
- `product_id` (Foreign Key, nullable)
- `status` (ENUM: 'new', 'contacted', 'resolved')
- `created_at` (TIMESTAMP)

## 🎨 Animation Features

- **GSAP ScrollTrigger**: Scroll-based animations
- **Stagger Effects**: Product cards animate in sequence
- **Parallax**: Hero section floating effect
- **Color Transitions**: Background morphs between sections
- **Hover Animations**: Interactive product cards

## 📝 License

Proprietary - SG Prime Enterprises © 2026

## 🤝 Support

For technical support, contact: support@sgprimeenterprises.com
