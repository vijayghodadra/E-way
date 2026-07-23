# ÉLIXIR BOTANICALS - Deployment Guide

This guide details how to deploy the entire production stack to **Vercel** (Storefront & Admin) and **Railway** (Express Backend & MongoDB).

---

## 1. Deploy Backend to Railway

1. **Push Repository**: Ensure your code is pushed to GitHub.
2. **New Railway Project**:
   - Go to [Railway.app](https://railway.app) and create a new project from your GitHub repo.
   - Set Root Directory to `/server`.
3. **Provision MongoDB**:
   - Add a MongoDB plugin/service in Railway or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
   - Obtain your MongoDB connection string (`mongodb+srv://...`).
4. **Configure Railway Environment Variables**:
   ```env
   PORT=5000
   NODE_ENV=production
   MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/elixir_db
   JWT_SECRET=your_super_secret_jwt_key
   JWT_REFRESH_SECRET=your_super_secret_refresh_jwt_key
   CLIENT_URL=https://your-storefront.vercel.app
   ADMIN_URL=https://your-admin.vercel.app
   RAZORPAY_KEY_ID=rzp_live_xxxxxxxx
   RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxx
   ```
5. **Deploy**: Railway will automatically detect Node.js, run `npm install`, and launch `npm start`.

---

## 2. Deploy Storefront (`/client`) to Vercel

1. Log into [Vercel](https://vercel.com).
2. Import project from GitHub and select `/client` as the Root Directory.
3. Select Framework Preset: **Vite**.
4. Configure Build Command: `npm run build` and Output Directory: `dist`.
5. Add Environment Variables:
   ```env
   VITE_API_URL=https://your-backend.up.railway.app/api/v1
   VITE_RAZORPAY_KEY_ID=rzp_live_xxxxxxxx
   ```
6. Deploy!

---

## 3. Deploy Admin Dashboard (`/admin`) to Vercel

1. In Vercel, click **Add New Project**.
2. Select the same GitHub repo, but set the Root Directory to `/admin`.
3. Framework Preset: **Vite**.
4. Configure Environment Variables:
   ```env
   VITE_API_URL=https://your-backend.up.railway.app/api/v1
   ```
5. Deploy!

---

## 4. Razorpay Webhooks Configuration

1. Log into Razorpay Dashboard -> **Settings** -> **Webhooks**.
2. Add Webhook URL: `https://your-backend.up.railway.app/api/v1/orders/razorpay/webhook`.
3. Enable events: `payment.captured`, `order.paid`, `payment.failed`.
4. Add Secret key to your Railway environment variables (`RAZORPAY_WEBHOOK_SECRET`).
