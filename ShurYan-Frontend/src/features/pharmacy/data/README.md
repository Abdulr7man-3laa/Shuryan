# Pharmacy Mock Data

⚠️ **IMPORTANT: DELETE THIS ENTIRE FOLDER WHEN API IS READY**

## Purpose
This folder contains all mock data for the pharmacy feature during development.

## Files
- `mockData.js` - All pharmacy mock data (stats, orders, etc.)
- `index.js` - Exports

## When to Delete
Delete this entire `data` folder when:
1. Backend API endpoints are ready
2. API integration is complete
3. All mock data is replaced with real API calls

## How to Delete
```bash
# Simply delete the entire folder
rm -rf src/features/pharmacy/data
```

Then update imports in:
- `PharmacyDashboard.jsx` - Remove mock data import
- Any other files using mock data

---
**Created:** 2025-01-08  
**Status:** Temporary (for development only)
