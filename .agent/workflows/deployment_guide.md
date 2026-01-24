---
description: Deployment Guide for Astro Application
---

This guide outlines how to deploy your Astro application. Since you have a separate Frontend (Vite/React) and Backend (Node/Express), the recommended approach is a **Split Deployment** using Vercel for the frontend and Render for the backend.

## Prerequisites

1.  **GitHub Repository**: Push your code to a GitHub repository.
2.  **Environment Variables**: You will need the values from your local `.env` file (`server/.env` and any frontend vars).

---

## Part 1: Deploy Backend (Render)

Render is excellent for hosting Node.js APIs.

1.  **Create Service**:
    *   Go to [dashboard.render.com](https://dashboard.render.com/).
    *   Click "New +" -> "Web Service".
    *   Connect your GitHub repository.

2.  **Configuration**:
    *   **Root Directory**: `server` (Important! Your backend is in the `server` folder).
    *   **Runtime**: Node
    *   **Build Command**: `npm install`
    *   **Start Command**: `node index.js` (or `npm start`)

3.  **Environment Variables**:
    *   Scroll down to "Environment Variables".
    *   Add the variables from your `server/.env` file:
        *   `PORT`: `10000` (Render uses this port internally, or let it default).
        *   `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`: Your email settings.
        *   `ADMIN_EMAIL`: Your admin email.
        *   `FRONTEND_URL`: You will add this *after* deploying the frontend.

4.  **Deploy**: Click "Create Web Service". Wait for it to go live. Copy the **Service URL** (e.g., `https://astro-backend.onrender.com`).

---

## Part 2: Deploy Frontend (Vercel)

Vercel is optimized for Vite/React applications.

1.  **Create Project**:
    *   Go to [vercel.com](https://vercel.com/).
    *   Click "Add New..." -> "Project".
    *   Import your GitHub repository.

2.  **Configuration**:
    *   **Root Directory**: `./` (Default is fine).
    *   **Build Command**: `npm run build` (Default).
    *   **Output Directory**: `dist` (Default).
    *   **Install Command**: `npm install` (Default).

3.  **Environment Variables**:
    *   Expand "Environment Variables".
    *   Add the following:
        *   `VITE_API_URL`: Paste the **Backend Service URL** from Part 1 (e.g., `https://astro-backend.onrender.com`).
        *   Any other `VITE_` variables you use (e.g., `VITE_RECAPTCHA_SITE_KEY`).

4.  **Deploy**: Click "Deploy".

---

## Part 3: Connect Them

1.  **Update Backend CORS**:
    *   Go back to your Render Dashboard -> Your Web Service -> Environment.
    *   Add/Update `FRONTEND_URL` with your new Vercel URL (e.g., `https://astro-app.vercel.app`).
    *   Render will auto-deploy the change.

2.  **Verify**:
    *   Open your Vercel URL.
    *   Test a form (Booking or Contact) to ensure the Frontend can talk to the Backend.

## Troubleshooting

*   **CORS Errors**: If you see CORS errors in the browser console, double-check that the `FRONTEND_URL` in Render exactly matches your Vercel URL (no trailing slash usually best, but check your code logic).
*   **Lazy Loading**: Your Lazy Loading implementation works automatically on Vercel. Vercel handles the splitting of files (`assets/*.js`) perfectly.
*   **Routing**: If refreshing a page like `/consultation` gives a 404, ensure Vercel is configured as a SPA (Single Page App). Vercel usually detects this automatically for Vite.
