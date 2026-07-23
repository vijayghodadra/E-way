# ÉLIXIR BOTANICALS - REST API Documentation

Base URL: `http://localhost:5000/api/v1`

---

## 1. Authentication Endpoints (`/api/v1/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Register new customer account | No |
| POST | `/auth/login` | User/Admin login (returns JWT token & sets refresh cookie) | No |
| POST | `/auth/refresh` | Issue new JWT access token via Refresh Cookie | No |
| POST | `/auth/logout` | Clear refresh cookie and invalidate session | Yes |
| GET | `/auth/profile` | Get current logged-in user profile | Yes |
| PUT | `/auth/profile` | Update profile information & default address | Yes |

---

## 2. Product Endpoints (`/api/v1/products`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/products` | List products (Query params: `search`, `category`, `minPrice`, `maxPrice`, `rating`, `sort`, `page`, `limit`) | No |
| GET | `/products/featured` | Fetch featured luxury products for Home slider | No |
| GET | `/products/bestsellers` | Fetch best-selling products | No |
| GET | `/products/:slug` | Get full product details by URL slug | No |

---

## 3. Category Endpoints (`/api/v1/categories`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/categories` | Get all active store categories | No |
| GET | `/categories/:slug` | Get single category with sub-products | No |

---

## 4. Order & Checkout Endpoints (`/api/v1/orders`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/orders` | Create new order (Calculates tax, shipping, discounts) | Yes |
| POST | `/orders/razorpay/create` | Initialize Razorpay Order ID | Yes |
| POST | `/orders/razorpay/verify` | Verify Razorpay payment signature & confirm order | Yes |
| GET | `/orders/my-orders` | Retrieve authenticated user's order history | Yes |
| GET | `/orders/:id` | Get individual order details & tracking breakdown | Yes |

---

## 5. Reviews & Coupons (`/api/v1/reviews`, `/api/v1/coupons`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/reviews/product/:productId` | List approved reviews for a product | No |
| POST | `/reviews` | Submit new product review | Yes |
| POST | `/coupons/validate` | Validate coupon code and return discount value | Yes |

---

## 6. Admin Endpoints (`/api/v1/admin`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/admin/analytics` | Get total revenue, order count, user count, sales chart data | Admin Only |
| POST | `/admin/products` | Create product record | Admin Only |
| PUT | `/admin/products/:id` | Update product record | Admin Only |
| DELETE | `/admin/products/:id` | Soft/Hard delete product | Admin Only |
| GET | `/admin/orders` | Fetch all system orders | Admin Only |
| PUT | `/admin/orders/:id/status` | Update order fulfillment status | Admin Only |
| POST | `/admin/coupons` | Create promotional coupon | Admin Only |
