# Patient Lab Prescriptions API - Get by Appointment

## 📌 Endpoint: جلب التحاليل المطلوبة في حجز معين

### 🔗 URL
```
GET /api/patients/me/appointments/{appointmentId}/lab-prescriptions
```

### 🔐 Authentication
- **Required**: ✅ نعم
- **Role**: Patient
- **Header**: `Authorization: Bearer {token}`

### 📥 Request Parameters

| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|-------------|
| `appointmentId` | GUID | URL Path | ✅ | معرف الحجز |

### 📤 Response Structure

**Success Response (200 OK):**
```json
{
  "isSuccess": true,
  "message": "تم جلب التحاليل المطلوبة",
  "data": {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "appointmentId": "4fa85f64-5717-4562-b3fc-2c963f66afa8",
    "doctorId": "5fa85f64-5717-4562-b3fc-2c963f66afa9",
    "doctorName": "د. أحمد محمود",
    "doctorSpecialty": "Cardiology",
    "doctorProfileImage": "https://example.com/images/doctor.jpg",
    "generalNotes": "يُفضل الصيام 12 ساعة قبل التحليل",
    "createdAt": "2024-12-04T20:30:00Z",
    "tests": [
      {
        "id": "7fa85f64-5717-4562-b3fc-2c963f66afab",
        "labTestId": "8fa85f64-5717-4562-b3fc-2c963f66afac",
        "testName": "Complete Blood Count (CBC)",
        "testCode": "LAB-001",
        "category": "CompleteBloodCount",
        "specialInstructions": "يفضل الصيام",
        "doctorNotes": "تحليل عاجل"
      }
    ],
    "hasOrder": false,
    "labOrderId": null,
    "orderStatus": null
  },
  "errors": null,
  "statusCode": 200
}
```

**Not Found Response (404):**
```json
{
  "isSuccess": false,
  "message": "لا توجد تحاليل مطلوبة لهذا الحجز",
  "data": null,
  "errors": null,
  "statusCode": 404
}
```

### 📋 Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | GUID | معرف روشتة التحاليل |
| `appointmentId` | GUID | معرف الحجز |
| `doctorId` | GUID | معرف الدكتور |
| `doctorName` | String | اسم الدكتور |
| `doctorSpecialty` | String | تخصص الدكتور |
| `doctorProfileImage` | String? | صورة الدكتور |
| `generalNotes` | String? | ملاحظات عامة من الدكتور |
| `createdAt` | DateTime | تاريخ كتابة الروشتة |
| `tests` | Array | قائمة التحاليل المطلوبة |
| `hasOrder` | Boolean | هل تم إنشاء طلب معمل |
| `labOrderId` | GUID? | معرف طلب المعمل (إن وجد) |
| يتatus` | String? | حالة الطلب (إن وجد) |

#### Tests Array Fields:

| Field | Type | Description |
|-------|------|-------------|
| `id` | GUID | معرف العنصر |
| `labTestId` | GUID | معرف التحليل |
| `testName` | String | اسم التحليل |
| `testCode` | String | كود التحليل |
| `category` | String | فئة التحليل |
| `specialInstructions` | String? | إرشادات خاصة بالتحليل |
| `doctorNotes` | String? | ملاحظات الدكتور |

### ✅ Use Case

**السيناريو**: المريض عنده حجز مع دكتور، الدكتور طلب منه تحاليل في نهاية الجلسة. المريض يقدر يشوف التحاليل دي باستخدام الـ appointmentId

**الخطوات**:
1. المريض يدخل على صفحةالحجز
2. النظام يجلب تفاصيل الحجز
3. لو في تحاليل مطلوبة، النظام يعرض قسم "التحاليل المطلوبة"
4. المريض يقدر يشوف التحاليل ويتصرف (مثلاً ينشئ طلب معمل)

### 🔒 Security

- المريض يقدر يجلب التحاليل اللي طلبها دكتور ليه في حجز خاص بيه بس
- النظام بيتحقق من الـ `patientId` و الـ `appointmentId` قبل إرجاع البيانات
