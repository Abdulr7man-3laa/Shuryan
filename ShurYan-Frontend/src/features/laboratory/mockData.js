// ⚠️ TEMPORARY MOCK DATA - DELETE THIS FILE WHEN BACKEND IS READY ⚠️
// This file contains all mock data for laboratory feature for easy removal

/**
 * Mock Statistics Data
 */
export const mockStatistics = {
  newOrdersToday: 8,
  pendingOrders: 15,
  completedOrders: 142,
  todayRevenue: 3250,
  monthlyOrders: 89,
  monthlyRevenue: 45600
};

/**
 * Mock Orders Data (Detailed - for Dashboard)
 */
export const mockOrders = [
  {
    orderId: 'LAB-2024-001',
    orderNumber: 'ORD-001',
    patientName: 'أحمد محمود',
    patientPhone: '01012345678',
    laboratoryOrderStatus: 6, // جاري تجهيز العينات
    totalPrice: 450,
    receivedAt: new Date().toISOString(),
    tests: [
      { testName: 'صورة دم كاملة (CBC)', price: 150, isAvailable: true },
      { testName: 'وظائف كلى', price: 200, isAvailable: true },
      { testName: 'سكر صائم', price: 100, isAvailable: true }
    ],
    deliveryInfo: {
      address: 'شارع النصر، المنصورة، الدقهلية',
      city: 'المنصورة',
      governorate: 'الدقهلية',
      notes: 'يرجى الاتصال قبل الوصول'
    }
  },
  {
    orderId: 'LAB-2024-002',
    orderNumber: 'ORD-002',
    patientName: 'فاطمة علي',
    patientPhone: '01098765432',
    laboratoryOrderStatus: 7, // خرج للتوصيل
    totalPrice: 320,
    receivedAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    tests: [
      { testName: 'تحليل بول', price: 120, isAvailable: true },
      { testName: 'فيتامين د', price: 200, isAvailable: true }
    ],
    deliveryInfo: {
      address: 'شارع الجمهورية، طنطا، الغربية',
      city: 'طنطا',
      governorate: 'الغربية',
      notes: ''
    }
  },
  {
    orderId: 'LAB-2024-003',
    orderNumber: 'ORD-003',
    patientName: 'محمد حسن',
    patientPhone: '01156789012',
    laboratoryOrderStatus: 5, // تم تأكيد الطلب
    totalPrice: 850,
    receivedAt: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
    tests: [
      { testName: 'وظائف كبد', price: 250, isAvailable: true },
      { testName: 'دهون ثلاثية', price: 200, isAvailable: true },
      { testName: 'كوليسترول', price: 150, isAvailable: true },
      { testName: 'تحليل غدة درقية (TSH)', price: 250, isAvailable: true }
    ],
    deliveryInfo: {
      address: 'شارع سعد زغلول، دمياط الجديدة، دمياط',
      city: 'دمياط',
      governorate: 'دمياط',
      notes: 'العينات يجب أن تكون صائمة'
    }
  },
  {
    orderId: 'LAB-2024-004',
    orderNumber: 'ORD-004',
    patientName: 'سارة إبراهيم',
    patientPhone: '01223456789',
    laboratoryOrderStatus: 8, // جاهز للاستلام
    totalPrice: 600,
    receivedAt: new Date(Date.now() - 14400000).toISOString(), // 4 hours ago
    tests: [
      { testName: 'تحليل حمل رقمي (Beta HCG)', price: 300, isAvailable: true },
      { testName: 'صورة دم كاملة (CBC)', price: 150, isAvailable: true },
      { testName: 'فصيلة الدم', price: 150, isAvailable: true }
    ],
    deliveryInfo: {
      address: 'شارع الثورة، كفر الشيخ، كفر الشيخ',
      city: 'كفر الشيخ',
      governorate: 'كفر الشيخ',
      notes: 'استلام من الفرع'
    }
  },
  {
    orderId: 'LAB-2024-005',
    orderNumber: 'ORD-005',
    patientName: 'عمر خالد',
    patientPhone: '01187654321',
    laboratoryOrderStatus: 6, // جاري تجهيز العينات
    totalPrice: 1200,
    receivedAt: new Date(Date.now() - 21600000).toISOString(), // 6 hours ago
    tests: [
      { testName: 'PCR لفيروس كورونا', price: 500, isAvailable: true },
      { testName: 'أشعة على الصدر', price: 400, isAvailable: true },
      { testName: 'صورة دم كاملة (CBC)', price: 150, isAvailable: true },
      { testName: 'سرعة ترسيب (ESR)', price: 150, isAvailable: true }
    ],
    deliveryInfo: {
      address: 'شارع الجلاء، المنصورة، الدقهلية',
      city: 'المنصورة',
      governorate: 'الدقهلية',
      notes: 'ضروري جداً - حالة طارئة'
    }
  }
];

/**
 * Mock Orders List (Lightweight - for Orders Page)
 */
export const mockOrdersList = [
  ...mockOrders,
  {
    orderId: 'LAB-2024-006',
    orderNumber: 'ORD-006',
    patientName: 'نور أحمد',
    patientPhone: '01034567890',
    laboratoryOrderStatus: 9, // تم التسليم
    totalPrice: 380,
    receivedAt: new Date(Date.now() - 86400000).toISOString(), // Yesterday
    tests: [
      { testName: 'سكر تراكمي (HbA1c)', price: 250, isAvailable: true },
      { testName: 'تحليل بول', price: 130, isAvailable: true }
    ],
    deliveryInfo: {
      address: 'شارع البحر، دمياط، دمياط',
      city: 'دمياط',
      governorate: 'دمياط',
      notes: ''
    }
  },
  {
    orderId: 'LAB-2024-007',
    orderNumber: 'ORD-007',
    patientName: 'ياسمين سامي',
    patientPhone: '01145678901',
    laboratoryOrderStatus: 9, // تم التسليم
    totalPrice: 520,
    receivedAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    tests: [
      { testName: 'هرمونات الغدة الدرقية الكاملة', price: 400, isAvailable: true },
      { testName: 'صورة دم كاملة (CBC)', price: 120, isAvailable: true }
    ],
    deliveryInfo: {
      address: 'شارع المحطة، طنطا، الغربية',
      city: 'طنطا',
      governorate: 'الغربية',
      notes: 'تم التسليم بنجاح'
    }
  },
  {
    orderId: 'LAB-2024-008',
    orderNumber: 'ORD-008',
    patientName: 'كريم محمد',
    patientPhone: '01267890123',
    laboratoryOrderStatus: 5, // تم تأكيد الطلب
    totalPrice: 720,
    receivedAt: new Date(Date.now() - 28800000).toISOString(), // 8 hours ago
    tests: [
      { testName: 'حمض البوليك', price: 180, isAvailable: true },
      { testName: 'وظائف كلى كاملة', price: 300, isAvailable: true },
      { testName: 'تحليل أملاح', price: 240, isAvailable: true }
    ],
    deliveryInfo: {
      address: 'شارع الجيش، كفر الشيخ، كفر الشيخ',
      city: 'كفر الشيخ',
      governorate: 'كفر الشيخ',
      notes: 'المريض يعاني من النقرس'
    }
  }
];

/**
 * Helper: Get order by ID
 */
export const getMockOrderById = (orderId) => {
  return mockOrdersList.find(order => order.orderId === orderId) || null;
};

/**
 * Helper: Simulate API delay
 */
export const simulateDelay = (ms = 800) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Mock API Response Structure
 */
export const createMockResponse = (data, success = true) => {
  return {
    success,
    data,
    message: success ? 'Success' : 'Error',
    timestamp: new Date().toISOString()
  };
};
