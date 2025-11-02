# Troubleshooting Network Error in Appointments Page

## Issue
Getting `AxiosError: Network Error` when trying to fetch appointments.

## Common Causes & Solutions

### 1. Backend Server Not Running ⚠️ (Most Common)
**Solution:**
- Open a terminal in the `backend` folder
- Run: `npm start` or `node server.js`
- Make sure the server starts on port 5000 (default)
- You should see: `Server running on port 5000`

### 2. Backend Running on Different Port
**Check:** Look at the backend server output to see which port it's using
**Solution:** Update `frontend/src/utils/api.js`:
```javascript
const API_BASE_URL = 'http://localhost:YOUR_PORT'; // Replace YOUR_PORT
```

### 3. CORS Issues
**Check:** If you see CORS errors in the browser console
**Solution:** Ensure `backend/server.js` has CORS configured correctly:
```javascript
app.use(cors({ 
  origin: ['http://localhost:5173', ...], 
  credentials: true 
}));
```

### 4. Missing Environment Variables
**Solution:** 
- Create `.env` file in `backend` folder
- Add required variables (database connection, etc.)

### 5. Database Not Connected
**Check:** Backend server logs should show database connection status
**Solution:** Ensure MongoDB/database is running and connection string is correct

## Quick Check Commands

1. **Check if backend is running:**
   ```bash
   # In backend folder
   npm start
   ```

2. **Test API endpoint directly:**
   ```bash
   curl http://localhost:5000/api/appointments/myappointments
   ```
   (You'll need authentication token for this)

3. **Check frontend API configuration:**
   - Open `frontend/src/utils/api.js`
   - Verify `API_BASE_URL` matches your backend URL

## Error Messages

The app now shows user-friendly error messages:
- "Cannot connect to the server..." → Backend not running
- "No response from server..." → Backend timeout or not reachable
- "Server error: XXX" → Backend error (check backend logs)

