# Partner Specific Removal Endpoint Integration

تم إضافة endpoint جديد لحذف شريك محدد (صيدلية أو معمل) بدلاً من حذف كل الشركاء.

## 🎯 المشكلة الأصلية:
- زر السلة كان يستخدم `suggestPartner` مع منطق معقد
- رسائل النجاح كانت مربكة ("تم حفظ الشركاء" بدلاً من "تم حذف")
- لم يكن هناك endpoint مخصص لحذف شريك واحد

## ✅ الحل المنفذ:

### 1. API Service (doctor.service.js):
```javascript
/**
 * Remove specific partner type (pharmacy or laboratory)
 * @param {string} partnerType - 'pharmacy' or 'laboratory'
 * @returns {Promise} Deletion confirmation
 */
async removeSpecificPartner(partnerType) {
  const response = await apiClient.delete(`/Doctors/me/partner/suggested?type=${partnerType}`);
  return response.data;
}
```

### 2. Partner Store (partnerStore.js):
```javascript
/**
 * Remove specific partner type
 * @param {string} partnerType - 'pharmacy' or 'laboratory'
 */
removeSpecificPartner: async (partnerType) => {
  // Optimistic update - remove specific partner
  set((state) => ({
    ...(partnerType === 'pharmacy' && { suggestedPharmacy: null }),
    ...(partnerType === 'laboratory' && { suggestedLaboratory: null }),
    loading: { ...state.loading, removing: true },
    error: { ...state.error, partner: null },
  }));

  try {
    await doctorService.removeSpecificPartner(partnerType);

    const partnerTypeArabic = partnerType === 'pharmacy' ? 'الصيدلية' : 'المعمل';
    
    set((state) => ({
      loading: { ...state.loading, removing: false },
      success: { 
        ...state.success, 
        partner: `تم إزالة ${partnerTypeArabic} المقترحة بنجاح` 
      },
    }));

    return { success: true };
  } catch (error) {
    // Rollback on error
    // ... error handling
  }
}
```

### 3. Component (PartnerSection.jsx):
```javascript
// Handle remove pharmacy
const handleRemovePharmacy = async () => {
  if (!confirm('هل أنت متأكد من إزالة الصيدلية المقترحة؟')) return;
  
  try {
    // Use specific endpoint to remove only pharmacy
    await removeSpecificPartner('pharmacy');
  } catch (error) {
    console.error('Error removing pharmacy:', error);
  }
};

// Handle remove laboratory
const handleRemoveLaboratory = async () => {
  if (!confirm('هل أنت متأكد من إزالة المعمل المقترح؟')) return;
  
  try {
    // Use specific endpoint to remove only laboratory
    await removeSpecificPartner('laboratory');
  } catch (error) {
    console.error('Error removing laboratory:', error);
  }
};
```

## 🔗 API Endpoint:

### DELETE /Doctors/me/partner/suggested?type={partnerType}

**Parameters:**
- `type`: 'pharmacy' or 'laboratory'

**Response:**
```json
{
  "success": true,
  "message": "Partner removed successfully",
  "data": null
}
```

## 🎉 المميزات الجديدة:

### 1. حذف محدد:
- ✅ حذف صيدلية فقط: `removeSpecificPartner('pharmacy')`
- ✅ حذف معمل فقط: `removeSpecificPartner('laboratory')`
- ✅ الشريك الآخر يبقى كما هو

### 2. رسائل واضحة:
- ✅ "تم إزالة الصيدلية المقترحة بنجاح"
- ✅ "تم إزالة المعمل المقترح بنجاح"
- ✅ لا confusion مع رسائل الحفظ

### 3. Confirmation Dialog:
- ✅ "هل أنت متأكد من إزالة الصيدلية المقترحة؟"
- ✅ "هل أنت متأكد من إزالة المعمل المقترح؟"

### 4. Optimistic Updates:
- ✅ UI يتحدث فوراً (better UX)
- ✅ Rollback عند الخطأ
- ✅ Loading states

## 🔄 User Flow:

1. **User clicks trash icon** → Confirmation dialog
2. **User confirms** → Optimistic update (partner disappears)
3. **API call** → DELETE /Doctors/me/partner/suggested?type=pharmacy
4. **Success** → Success message appears
5. **Auto-clear** → Message disappears after 3 seconds

## 📁 الملفات المعدلة:

- ✅ `src/api/services/doctor.service.js` - إضافة removeSpecificPartner
- ✅ `src/features/doctor/stores/partnerStore.js` - إضافة removeSpecificPartner action
- ✅ `src/features/doctor/hooks/usePartner.js` - تصدير removeSpecificPartner
- ✅ `src/features/doctor/components/PartnerSection.jsx` - استخدام removeSpecificPartner

## 🎯 النتيجة:

✅ **Clean API calls** - endpoint مخصص لكل عملية
✅ **Clear messages** - رسائل واضحة ومحددة
✅ **Better UX** - confirmation + optimistic updates
✅ **Simplified logic** - لا منطق معقد في الـ component
✅ **Type safety** - parameter واضح ('pharmacy' or 'laboratory')

الآن زر السلة يعمل بالشكل المطلوب ويستخدم الـ endpoint المحدد! 🗑️✅
