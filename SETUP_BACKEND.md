# Backend Setup Instructions

## Problem
The funnel analytics is showing "Network Error - No response from server" because the backend server at `https://telexph-admin.onrender.com/api` is not running.

## Solution: Start Backend Locally

### 1. Open Terminal
Navigate to the backend directory:
```bash
cd c:\Users\acoloma\Desktop\website-admin-backend
```

### 2. Start Backend Server
Run the development server:
```bash
npm run dev
```

This will start the backend server on `http://localhost:3000`

### 3. Update Frontend Configuration
Create a `.env.local` file in the frontend directory (`c:\Users\acoloma\Desktop\TelexPH`) with:
```
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

### 4. Restart Frontend
Stop and restart your Next.js frontend to pick up the new environment variable.

## Alternative: Use Production Backend
If you prefer to use the production backend, ensure:
1. The backend is deployed and running on Render
2. Check the Render dashboard for any deployment issues
3. Verify the backend URL is accessible

## Verification
Once the backend is running, you should see:
- Console logs showing successful API requests
- Real funnel data in the analytics dashboard
- No more network errors

## Backend Features
The backend now provides:
- `/api/page-views/funnels` - Funnel analytics data
- `/api/page-views/funnels/:url` - Individual funnel details
- Real-time aggregation from GHL page views
- Authentication with JWT tokens
