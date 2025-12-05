# Doctor Lab Prescriptions API Documentation

## نظرة عامة
هذا الـ API يسمح للدكتور بعرض التحاليل المطلوبة من مريض معين

---

## 1️⃣ Endpoint: عرض قائمة التحاليل (Summary)

### 📌 الوصف
يعرض جميع التحاليل اللي طلبها الدكتور من مريض معين (عرض مختصر)

### 🔗 URL
```
GET /api/doctors/me/patients/{patientId}/lab-prescriptions
```

### 🔐 Authentication
- **Required**: ✅ نعم
- **Role**: Doctor
- **Header**: `Authorization: Bearer {token}`

### 📥 Request Parameters

| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|-------------|
| `patientId` | GUID | URL Path | ✅ | معرف المريض |

### 📤 Response Structure

**Success Response (200 OK):**
```json
{
  "isSuccess": true,
  "message": "تم جلب التحاليل بنجاح",
  "data": [
    {
      "prescriptionId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "testName": "Complete Blood Count (CBC)",
      "requestedDate": "2024-12-04T20:30:00Z"
    },
    {
      "prescriptionId": "3fa85f64-5717-4562-b3fc-2c963f66afa7",
      "testName": "Lipid Profile",
      "requestedDate": "2024-12-03T15:20:00Z"
    }
  ],
  "errors": null,
  "statusCode": 200
}
```

### 📋 Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `prescriptionId` | GUID | معرف الروشتة - استخدمه لعرض التفاصيل |
| `testName` | String | اسم التحليل |
| `requestedDate` | DateTime | تاريخ طلب التحليل |

## 2️⃣ Endpoint: عرض تفاصيل تحليل معين

### 📌 الوصف
يعرض كل تفاصيل روشتة تحليل معينة

### 🔗 URL
```
GET /api/doctors/me/lab-prescriptions/{prescriptionId}/details
```

### 🔐 Authentication
- **Required**: ✅ نعم
- **Role**: Doctor
- **Header**: `Authorization: Bearer {token}`

### 📥 Request Parameters

| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|-------------|
| `prescriptionId` | GUID | URL Path | ✅ | معرف الروشتة اللي جاي من الـ endpoint الأول |

### 📤 Response Structure

**Success Response (200 OK):**
```json
{
  "isSuccess": true,
  "message": "تم جلب تفاصيل التحليل بنجاح",
  "data": {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "appointmentId": "4fa85f64-5717-4562-b3fc-2c963f66afa8",
    "doctorId": "5fa85f64-5717-4562-b3fc-2c963f66afa9",
    "doctorName": "د. أحمد محمود",
    "patientId": "6fa85f64-5717-4562-b3fc-2c963f66afaa",
    "patientName": "محمد علي",
    "generalNotes": "يُفضل الصيام 12 ساعة قبل التحليل",
    "items": [
      {
        "id": "7fa85f64-5717-4562-b3fc-2c963f66afab",
        "labTestId": "8fa85f64-5717-4562-b3fc-2c963f66afac",
        "testName": "Complete Blood Count (CBC)",
        "testCode": "LAB-001",
        "doctorNotes": "تحليل عاجل",
        "createdAt": "2024-12-04T20:30:00Z"
      },
      {
        "id": "7fa85f64-5717-4562-b3fc-2c963f66afad",
        "labTestId": "8fa85f64-5717-4562-b3fc-2c963f66afae",
        "testName": "Blood Sugar (Fasting)",
        "testCode": "LAB-015",
        "doctorNotes": null,
        "createdAt": "2024-12-04T20:30:00Z"
      }
    ],
    "createdAt": "2024-12-04T20:30:00Z",
    "updatedAt": null,
    "isDeleted": false
  },
  "errors": null,
  "statusCode": 200
}
```

### 📋 Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | GUID | معرف الروشتة |
| `appointmentId` | GUID | معرف الموعد المرتبط |
| `doctorId` | GUID | معرف الدكتور |
| `doctorName` | String | اسم الدكتور |
| `patientId` | GUID | معرف المريض |
| `patientName` | String | اسم المريض |
| `generalNotes` | String? | ملاحظات عامة على الروشتة |
| `items` | Array | قائمة التحاليل المطلوبة |
| `createdAt` | DateTime | تاريخ إنشاء الروشتة |

#### Items Array Fields:

| Field | Type | Description |
|-------|------|-------------|
| `id` | GUID | معرف العنصر |
| `labTestId` | GUID | معرف التحليل |
| `testName` | String | اسم التحليل |
| `testCode` | String | كود التحليل |
| `doctorNotes` | String? | ملاحظات الدكتور على هذا التحليل |
| `createdAt` | DateTime | تاريخ الإضافة |
