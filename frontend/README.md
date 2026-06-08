# NetWatch Frontend

A production-quality, real-time network monitoring dashboard built with React, Vite, Tailwind CSS, and Recharts.

## Overview

NetWatch is a modern network operations center (NOC) dashboard inspired by enterprise tools like Datadog, SolarWinds, Nagios, and Zabbix. The frontend provides real-time visualization of network traffic, anomaly detection alerts, and historical analytics.

## Tech Stack

- **React 18.3.1** - UI library
- **Vite 5.0.8** - Build tool and dev server
- **Tailwind CSS 3.4.1** - Utility-first CSS framework
- **Recharts 2.10.3** - React charting library
- **Axios 1.6.2** - HTTP client
- **React Icons 4.12.0** - Icon library

## Features

✨ **Dark Theme with Professional NOC Appearance**
- Glassmorphism effects
- Smooth animations and transitions
- Neon gradient accents (blue, purple, pink)

📊 **Real-Time Dashboard**
- KPI cards (Total Packets, Unique Sources, Active Alerts, DB Status)
- Interactive traffic chart with auto-refresh every 2 seconds
- Top IP sources table with ranking and percentages
- Active alerts panel with severity indicators
- Database status widget

🔔 **Advanced Features**
- Anomaly detection alerts
- Historical snapshots timeline with search
- Responsive design (desktop, tablet, mobile)
- Auto-refresh on 2-second intervals
- Loading states and error handling

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── StatCard.jsx
│   │   ├── TrafficChart.jsx
│   │   ├── TopSourcesTable.jsx
│   │   ├── AlertsPanel.jsx
│   │   ├── DatabaseStatus.jsx
│   │   ├── HistoryTimeline.jsx
│   │   └── LoadingSkeleton.jsx
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   └── ErrorPage.jsx
│   ├── layouts/
│   │   └── MainLayout.jsx
│   ├── services/
│   │   └── apiService.js
│   ├── hooks/
│   │   └── useRefresh.js
│   ├── assets/
│   ├── utils/
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── public/
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── package.json
└── .gitignore
```

## Installation

### Prerequisites

- Node.js 16+ and npm/yarn installed
- Backend API running on `http://localhost:8000`

### Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## API Integration

The frontend communicates with the backend API at `http://localhost:8000`. 

### Endpoints Used

- `GET /stats` - Traffic statistics and top sources
- `GET /alerts` - Active alerts
- `GET /stats_history` - Historical snapshots
- `GET /db_status` - Database connection status
- `GET /traffic` - All traffic data

### Auto-Refresh

The dashboard automatically refreshes every 2 seconds:
- Dashboard metrics (KPI cards)
- Traffic chart
- Alerts
- Chart data

Historical data refreshes every 5 seconds.

## Design System

### Color Palette

- **Primary:** Neon Blue (#00d9ff)
- **Secondary:** Neon Purple (#c084fc)
- **Accent:** Neon Pink (#ec4899)
- **Success:** Emerald (#10b981)
- **Warning:** Amber (#f59e0b)
- **Danger:** Red (#ef4444)

### Components

**StatCard**
- Professional metric display with icon
- Glassmorphism styling
- Animated hover effects
- Trend indicators

**TrafficChart**
- Area chart with gradient fill
- Real-time data visualization
- Interactive tooltips
- Live indicator

**TopSourcesTable**
- Ranked IP addresses
- Packet counts and percentages
- Progress bars
- Expandable details

**AlertsPanel**
- Color-coded by severity
- Alert descriptions
- Pulsing indicators
- Real-time updates

**DatabaseStatus**
- Connection indicator
- Response time display
- Database/collection info
- Refresh button

**HistoryTimeline**
- Scrollable historical data
- Search functionality
- Expandable snapshots
- Alert information

## Performance

- Lazy loading for components
- Optimized re-renders with React hooks
- Efficient API calls with auto-refresh
- Responsive design with Tailwind CSS
- Smooth animations with CSS transitions

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## Development

### Available Scripts

```bash
# Development server with hot reload
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

### Customization

- **Colors:** Edit `tailwind.config.js`
- **Refresh Interval:** Modify `useRefresh` hook interval parameter
- **API Base URL:** Update `apiService.js`

## Deployment

### Build for Production

```bash
npm run build
```

The optimized build output will be in the `dist/` directory.

### Deploy Options

- Vercel: `vercel deploy`
- Netlify: `netlify deploy --prod --dir=dist`
- AWS S3 + CloudFront
- Docker container

Example Dockerfile:

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

## Troubleshooting

### Backend not connecting

- Ensure backend is running on `http://localhost:8000`
- Check `apiService.js` base URL
- Verify CORS settings in backend

### Charts not displaying

- Ensure stats data is being sent from backend
- Check browser console for errors
- Verify Recharts installation

### Styling issues

- Verify Tailwind CSS build process
- Check `tailwind.config.js` content paths
- Clear node_modules and reinstall if needed

## License

MIT

## Support

For issues or feature requests, please open an issue in the repository.
