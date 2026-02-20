-- ============================================
-- SG Prime Enterprises Database Schema
-- Coir Products Industrial Catalog
-- ============================================

-- Note: Database is created by seeders/setup.js
-- Run: npm run setup (for first-time setup)

-- ============================================
-- ADMINS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(150),
    role ENUM('admin', 'superadmin') DEFAULT 'admin',
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- CATEGORIES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_slug (slug),
    INDEX idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- PRODUCTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT NOT NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    specs JSON,
    image_url VARCHAR(500),
    is_featured BOOLEAN DEFAULT FALSE,
    display_order INT DEFAULT 0,
    status ENUM('active', 'draft', 'archived') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
    INDEX idx_category (category_id),
    INDEX idx_status (status),
    INDEX idx_featured (is_featured),
    INDEX idx_display_order (display_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- ENQUIRIES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS enquiries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    company VARCHAR(150),
    phone VARCHAR(20),
    message TEXT NOT NULL,
    product_id INT,
    status ENUM('pending', 'contacted', 'resolved') DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL,
    INDEX idx_status (status),
    INDEX idx_created_at (created_at),
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- SAMPLE DATA (Moved to Node.js Seeders)
-- ============================================
-- Sample data has been moved to database/seeders/ for better management
--
-- To populate the database with sample data:
--   cd database
--   npm install
--   npm run seed
--
-- Available seeder commands:
--   npm run seed         - Populate database with sample data
--   npm run seed:reset   - Clear all data from tables
--   npm run seed:fresh   - Reset and re-seed database
--
-- Seed data includes:
--   - 3 Categories (Erosion Control, Greenhouse, Gardening)
--   - 7 Products with detailed specifications
--
-- ============================================

-- ============================================
-- USEFUL QUERIES FOR REFERENCE
-- ============================================
-- USEFUL QUERIES FOR REFERENCE
-- ============================================

-- Get all products with category information
-- SELECT p.*, c.name as category_name, c.slug as category_slug 
-- FROM products p 
-- JOIN categories c ON p.category_id = c.id 
-- WHERE p.status = 'active'
-- ORDER BY p.display_order;

-- Get products by category slug
-- SELECT p.* FROM products p
-- JOIN categories c ON p.category_id = c.id
-- WHERE c.slug = 'erosion-control' AND p.status = 'active';

-- Get featured products
-- SELECT p.*, c.name as category_name 
-- FROM products p
-- JOIN categories c ON p.category_id = c.id
-- WHERE p.is_featured = TRUE AND p.status = 'active'
-- ORDER BY p.display_order;

-- Get all new enquiries
-- SELECT e.*, p.name as product_name 
-- FROM enquiries e
-- LEFT JOIN products p ON e.product_id = p.id
-- WHERE e.status = 'new'
-- ORDER BY e.created_at DESC;
