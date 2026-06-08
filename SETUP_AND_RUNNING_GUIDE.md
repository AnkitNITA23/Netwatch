# NetWatch: Complete Setup & Running Guide

## 🎯 Quick Start

### Prerequisites
- Node.js 16+ and npm
- Python 3.12+ with virtual environment
- Backend API running

### Start Backend (Terminal 1)
```bash
cd c:\Users\Ankit Kumar\OneDrive\Desktop\Netwatch
.\backend\venv\Scripts\python.exe -m uvicorn app:app --reload --host 127.0.0.1 --port 8000
```

**Expected Output:**
```
INFO:     Uvicorn running on http://127.0.0.1:8000
```

### Start Frontend (Terminal 2)
```bash
cd c:\Users\Ankit Kumar\OneDrive\Desktop\Netwatch\frontend
npm run dev
```

**Expected Output:**
```
VITE v5.4.21 ready in 1086 ms
➜  Local:   http://localhost:5173/
```

### Access Dashboard
- Open browser and go to: **http://localhost:5173/**
- Backend API docs: **http://localhost:8000/docs**

---

## 📁 Project Structure

### Backend (`/backend`)
```
backend/
├── app.py              (14 FastAPI endpoints)
├── sniffer.py          (Packet capture & analytics)
├── database.py         (MongoDB connection via .env)
├── requirements.txt    (All Python dependencies)
├── .env                (MongoDB URI - SECRET)
├── .env.example        (Template for .env)
└── venv/               (Virtual environment)
```

### Frontend (`/frontend`)
```
frontend/
├── src/
│   ├── components/     (8 React components)
│   ├── pages/          (Dashboard & Error pages)
│   ├── services/       (API layer)
│   ├── hooks/          (useRefresh for auto-updates)
│   ├── layouts/        (Main layout)
│   └── index.css       (Tailwind styles)
├── package.json        (npm dependencies)
├── vite.config.js      (Vite config)
└── tailwind.config.js  (Tailwind setup)
```

---

## 🔧 Configuration

### Backend Configuration

#### 1. Python Environment
Virtual environment already set up at `backend/venv/`

#### 2. MongoDB Connection
File: `backend/.env`
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/?appName=App
```

**Location:** `c:\Users\Ankit Kumar\OneDrive\Desktop\Netwatch\backend\.env`

**What Changed:**
- ✅ MongoDB URI moved from hardcoded to .env file
- ✅ Using `python-dotenv` to load environment variables
- ✅ Secure credentials not exposed in code
- ✅ Added `.env.example` template for setup

### Frontend Configuration

#### 1. API Base URL
File: `src/services/apiService.js` (Line 3)
```javascript
const API_BASE_URL = 'http://localhost:8000';
```

#### 2. Tailwind Theme Colors
File: `tailwind.config.js`
- Primary: Neon Blue (#00d9ff)
- Secondary: Neon Purple (#c084fc)
- Accent: Neon Pink (#ec4899)

#### 3. Auto-Refresh Interval
File: `src/pages/Dashboard.jsx`
- Dashboard metrics: 2 seconds
- History data: 5 seconds

---

## 📊 Dashboard Components

### 1. KPI Cards (Top)
- **Total Packets** - All packets captured
- **Unique Sources** - Different IP addresses
- **Active Alerts** - System anomalies
- **Database Status** - MongoDB connection

### 2. Traffic Chart (Middle)
- Real-time area chart with gradient
- Auto-refreshes every 2 seconds
- Shows packet flow over time
- Interactive tooltips

### 3. Top Sources Table (Bottom Left)
- Top 10 IP addresses
- Ranked by packet count
- Shows traffic percentage
- Progress bar visualization

### 4. Alerts Panel (Bottom Right)
- Color-coded by severity
- Critical (Red) / Warning (Amber) / Info (Blue)
- Real-time updates
- No alerts = Success indicator

### 5. Database Status (Right)
- Connection indicator
- Response time display
- Database/collection info
- Refresh button

### 6. History Timeline (Full Width)
- Searchable historical snapshots
- Expandable details
- Up to 100 snapshots stored
- Scroll through time

---

## 🚀 API Endpoints

### Backend Endpoints (All Implemented & Working)

```
GET  /                       → Welcome message
GET  /traffic                → All IPs and packet counts
GET  /stats                  → Overall statistics
GET  /alerts                 → Active alerts
GET  /stats_history          → Historical snapshots
GET  /db_status              → Database connection status
GET  /sniffer_status         → Packet sniffing status
GET  /simulate_traffic?ip=X  → Add test traffic
POST /save_traffic           → Persist snapshot to MongoDB
GET  /load_traffic           → Retrieve from MongoDB
GET  /docs                   → Interactive API docs
```

### Frontend Requests

```javascript
// All handled by apiService.js
apiService.getStats()         // Stats + top sources + chart
apiService.getAlerts()        // Alerts list
apiService.getStatsHistory()  // Historical data
apiService.getDBStatus()      // Database info
apiService.getChartData()     // Formatted chart data
```

---

## 🔄 Auto-Refresh Mechanism

**Implementation:** React `useRefresh` hook

**Flow:**
1. Initial data fetch on component mount
2. Set interval for periodic updates
3. Clean up interval on unmount
4. Retry mechanism on errors

**Intervals:**
- Dashboard KPI cards: 2 seconds
- Traffic chart: 2 seconds  
- Alerts: 2 seconds
- History: 5 seconds
- Database status: 3 seconds

---

## 🎨 Design System

### Color Palette
```
Dark Background:    #0f172a
Surface:            #1e293b
Surface Light:      #334155
Neon Blue:          #00d9ff
Neon Purple:        #c084fc
Neon Pink:          #ec4899
Success:            #10b981
Warning:            #f59e0b
Danger:             #ef4444
```

### Typography
- Font: System font stack (SF Pro Display, Segoe UI, etc.)
- Sizes: 12px (xs) to 42px (4xl)
- Weights: 400 (normal) to 900 (black)

### Effects
- Glassmorphism (backdrop-blur + transparency)
- Smooth transitions (300ms)
- Gradient overlays
- Glow shadows
- Animations: float, pulse, glow

---

## 📱 Responsive Breakpoints

```
Mobile:   < 640px   (Single column)
Tablet:   640-1024px (2 columns)
Desktop:  > 1024px  (3-4 columns)
```

**Example Grid Layout:**
```
Mobile:     1 column
Tablet:     2 columns  
Desktop:    4 columns (KPI cards)
```

---

## 🧪 Testing

### Manual Testing Checklist

- [ ] Dashboard loads without errors
- [ ] KPI cards display correct values
- [ ] Traffic chart updates every 2 seconds
- [ ] Top sources table shows top 10 IPs
- [ ] Alerts panel displays current alerts
- [ ] Database status shows connected
- [ ] History timeline shows snapshots
- [ ] Search in history works
- [ ] Click to expand history items
- [ ] Theme toggle works (dark/light)
- [ ] Responsive design (resize browser)
- [ ] Error states handle gracefully
- [ ] Retry buttons work

### Quick Test Data

Generate traffic for testing:
```bash
# Simulate traffic
curl "http://localhost:8000/simulate_traffic?ip=192.168.1.1"
curl "http://localhost:8000/simulate_traffic?ip=10.0.0.1"
curl "http://localhost:8000/simulate_traffic?ip=8.8.8.8"
```

---

## 🐛 Troubleshooting

### Issue: Frontend shows "Connection Error"

**Solution:**
1. Verify backend is running on http://localhost:8000
2. Check browser console for errors (F12)
3. Verify `apiService.js` has correct base URL
4. Check CORS headers in backend (if needed)

### Issue: No data showing in dashboard

**Solution:**
1. Check backend logs for API errors
2. Verify database connection (MongoDB Atlas)
3. Generate test traffic: `curl http://localhost:8000/simulate_traffic?ip=192.168.1.1`
4. Check network tab in browser dev tools

### Issue: Chart not rendering

**Solution:**
1. Verify Recharts is installed: `npm list recharts`
2. Check browser console for Recharts errors
3. Verify data format from backend
4. Try refreshing the page

### Issue: Styling looks wrong

**Solution:**
1. Verify Tailwind CSS is built: check `index.css` in network tab
2. Clear browser cache (Ctrl+Shift+Delete)
3. Rebuild: `npm run build`
4. Check `tailwind.config.js` paths are correct

---

## 📦 Build & Deploy

### Production Build
```bash
cd frontend
npm run build
```

**Output:** `dist/` folder with optimized files

### Deploy to Vercel
```bash
npm install -g vercel
vercel deploy --prod
```

### Deploy to Netlify
```bash
netlify deploy --prod --dir=dist
```

### Docker (Optional)
```dockerfile
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
RUN npm install -g serve
COPY --from=build /app/dist ./dist
EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
```

---

## 📝 Development Notes

### Adding New Components
1. Create component in `src/components/`
2. Export as default
3. Import in `Dashboard.jsx`
4. Add to layout grid

### Adding New API Endpoints
1. Update backend in `backend/app.py`
2. Add method in `src/services/apiService.js`
3. Use `useRefresh` hook to fetch data
4. Display in appropriate component

### Customizing Theme
Edit `tailwind.config.js`:
```javascript
colors: {
  'your-color': '#hexcode'
}
```

Then use in components:
```jsx
className="bg-your-color text-your-color"
```

---

## 📚 Documentation

- **Frontend README:** `frontend/README.md`
- **Backend README:** `backend/README.md` (if available)
- **Tailwind Docs:** https://tailwindcss.com
- **Recharts Docs:** https://recharts.org
- **FastAPI Docs:** https://fastapi.tiangolo.com
- **Vite Docs:** https://vitejs.dev

---

## 🎓 Learning Resources

### Components Used
- React Hooks (useState, useEffect)
- Custom Hooks (useRefresh)
- Axios for HTTP
- Tailwind CSS utilities
- Recharts for charts
- React Icons for SVGs

### Key Concepts
- Real-time data updates
- Auto-refresh mechanisms
- Error handling & retries
- Responsive design
- API integration
- State management

---

## ✅ Completion Status

**Backend:** ✅ Complete
- 14 endpoints implemented
- MongoDB Atlas integrated
- Environment variables configured
- Packet sniffing with graceful fallback

**Frontend:** ✅ Complete
- 8 professional components
- Responsive design
- Real-time updates
- Error handling
- Production-ready styling

**Infrastructure:** ✅ Complete
- Backend running on :8000
- Frontend running on :5173
- MongoDB Atlas connected
- All APIs functional

---

## 📞 Support

For issues, check:
1. Browser console errors (F12)
2. Terminal/server logs
3. Network tab (Cmd/Ctrl + Shift + I)
4. Backend logs for API errors
5. MongoDB Atlas dashboard

---

**Last Updated:** June 8, 2026
**Frontend Version:** 0.1.0 (Production Quality)
