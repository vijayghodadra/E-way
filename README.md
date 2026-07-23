# ÉLIXIR BOTANICALS - Ultra-Premium Luxury Beauty E-Commerce Ecosystem

A production-ready luxury beauty e-commerce web platform inspired by *Aesop, Forest Essentials, Just Herbs, Minimalist, Rare Beauty, and Nykaa Luxe*. Built with a modern micro-interaction architecture, high-border-radius glassmorphism, Framer Motion staggered reveals, Razorpay integration, JWT refresh tokens, dynamic admin dashboard, and full SEO optimization.

---

## 🌟 Key Features

### Storefront (`/client`)
- **Luxury Botanical Aesthetic**: Deep Emerald (`#14532D`), Alabaster (`#F5F5F4`), Champagne Gold (`#D4AF37`) palette paired with *Playfair Display* serif typography.
- **Micro-Interactions**: Floating search modal, interactive mega menu, magnetic hover cards, live cart drawer with instant free shipping progress threshold.
- **Product Discovery**: Multi-filter sidebar (category, price slider, rating, availability, skin benefits), Quick View modal, dynamic sorting, and grid/list toggles.
- **Rich Product Page**: Zoom gallery, ingredient breakdowns, benefit badges, usage guide tabs, customer reviews with star breakdowns, sticky mobile action bar.
- **Checkout & Payments**: Sleek multi-step checkout supporting **Razorpay Payment Gateway (UPI, Cards, NetBanking)** and **Cash on Delivery (COD)** with secure signature verification.
- **User Dashboard**: Order timeline tracking (`Packed` -> `Shipped` -> `Delivered`), order history, printable invoice modal, address manager, and saved wishlist.
- **SEO & Performance**: JSON-LD Schema structured data, Open Graph social cards, meta tags, and lazy-loaded imagery.

### Admin Dashboard (`/admin`)
- **Executive Analytics**: Real-time sales summary revenue charts, top performing products, stock alerts, and customer counts.
- **Full Inventory & Product Manager**: Complete CRUD operations for products (SKU, pricing, ingredients, benefits, multiple images, stock status).
- **Category & Banner Control**: Manage store categories and promotional slider hero graphics.
- **Order Lifecycle Manager**: Update status from `Pending` through `Delivered` with live customer notifications.
- **Coupon Engine**: Create percentage & fixed discount codes with usage caps & minimum purchase requirements.
- **Reports & Export**: Export sales data to CSV and print standard PDF format invoices.

### Backend Server (`/server`)
- **Express + MongoDB Architecture**: Mongoose schemas for User, Product, Category, Order, Review, Coupon, and Wishlist.
- **Security First**: Helmet header protection, CORS configuration, Rate Limiter rate-limiting, bcrypt password hashing, and HTTP-Only JWT Cookie Auth with Refresh tokens.
- **Database Seeder**: Pre-configured seeder script with 20+ luxury botanical products, sample reviews, categories, and test user/admin accounts.

---

## 📁 Repository Structure

```
c:/Users/vijay/Desktop/E-Way/
├── client/          # React 19 + Vite + Tailwind CSS Storefront Application
├── admin/           # React 19 + Vite + Tailwind CSS Admin Control Panel
├── server/          # Node.js + Express + MongoDB REST API Backend
├── docs/            # Complete API Documentation & Deployment Walkthrough
└── docker-compose.yml
```

---

## 🚀 Quick Start Guide

### 1. Environment Setup
Copy `.env.example` to `.env` inside `/server`, `/client`, and `/admin`.

#### Server Environment (`server/.env`)
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/eway_luxury_db
JWT_SECRET=luxury_secret_key_eway_2026_super_secure
JWT_REFRESH_SECRET=luxury_refresh_secret_key_eway_2026_super_secure
CLIENT_URL=http://localhost:3000
ADMIN_URL=http://localhost:3001
RAZORPAY_KEY_ID=rzp_test_YourKeyIdHere
RAZORPAY_KEY_SECRET=YourRazorpaySecretHere
```

### 2. Seed Database
```bash
cd server
npm install
npm run seed
```

### 3. Run Development Servers
```bash
# Terminal 1: Backend Server (Port 5000)
cd server
npm run dev

# Terminal 2: Storefront Client (Port 3000)
cd client
npm run dev

# Terminal 3: Admin Dashboard (Port 3001)
cd admin
npm run dev
```

---

## 🔒 Demo Credentials

- **Admin Portal Access**: `admin@elixirbotanicals.com` / `Admin@123456`
- **Customer Demo Access**: `user@elixirbotanicals.com` / `User@123456`

---

## 📄 Documentation
- Detailed API Specs: [`docs/API_DOCUMENTATION.md`](file:///c:/Users/vijay/Desktop/E-Way/docs/API_DOCUMENTATION.md)
- Deployment Walkthrough: [`docs/DEPLOYMENT_GUIDE.md`](file:///c:/Users/vijay/Desktop/E-Way/docs/DEPLOYMENT_GUIDE.md)
