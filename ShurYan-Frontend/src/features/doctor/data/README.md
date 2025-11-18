# Mock Data for Reviews Feature

## 🗑️ TEMPORARY FILES - DELETE WHEN API IS READY

هذا المجلد يحتوي على بيانات وهمية مؤقتة لميزة التقييمات.

### Files:
- `mockReviews.js` - بيانات التقييمات الوهمية

## 🔄 How to Switch from Mock Data to Real API

### Step 1: Update Store (reviewsStore.js)
```javascript
// 1. Uncomment real API import
import reviewsService from '../../../api/services/reviews.service';

// 2. Remove mock data imports
// import { mockReviews, mockStatistics, ... } from '../data/mockReviews';

// 3. Replace mock implementations with real API calls
// In fetchReviews(), fetchStatistics(), replyToReview()
```

### Step 2: Delete Mock Data Files
```bash
# Delete the entire data folder
rm -rf src/features/doctor/data/
```

### Step 3: Test Real API Integration
- [ ] Test GET /Doctors/me/reviews
- [ ] Test GET /Doctors/me/reviews/statistics  
- [ ] Test POST /Reviews/{id}/reply
- [ ] Test pagination
- [ ] Test filtering
- [ ] Test error handling

## 📋 Mock Data Structure

### Reviews (8 samples):
- ✅ Multiple rating categories (5 fields)
- ✅ Anonymous reviews support
- ✅ Doctor replies (some with, some without)
- ✅ Patient information
- ✅ Edit indicators
- ✅ Timestamps

### Statistics:
- ✅ Average rating: 4.1
- ✅ Total reviews: 8
- ✅ Verified reviews: 6
- ✅ Rating distribution (5,4,3,2,1 stars)
- ✅ Category averages

### Features Simulated:
- ✅ API delays (300-800ms)
- ✅ Filtering by rating
- ✅ Sorting by date/rating
- ✅ Pagination
- ✅ Reply functionality
- ✅ Loading states
- ✅ Console logging

## 🎯 Current Status:
- ✅ Mock data is active
- ✅ All UI components working
- ✅ All interactions functional
- ⏳ Ready for API integration

## 🚀 When API is Ready:
1. Update `reviewsStore.js` (uncomment real API calls)
2. Delete `src/features/doctor/data/` folder
3. Test all functionality
4. Remove this README
