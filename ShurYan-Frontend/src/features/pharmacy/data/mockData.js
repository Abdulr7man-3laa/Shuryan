/**
 * Pharmacy Mock Data
 * ==================
 * هذا الملف يحتوي على جميع الـ Mock Data الخاصة بالصيدلية
 * سيتم حذف هذا الملف بالكامل عند تكامل الـ API الحقيقي
 * 
 * @note DELETE THIS FILE when API is ready
 */

/**
 * Dashboard Statistics Mock Data
 */
export const MOCK_PHARMACY_STATS = [
  {
    id: 1,
    title: 'طلبات جديدة',
    value: '24',
    icon: 'FaShoppingCart',
    color: 'from-[#00b19f] to-[#00d4be]',
    bgColor: 'bg-[#00b19f]/10',
    textColor: 'text-[#00b19f]',
  },
  {
    id: 2,
    title: 'طلبات معلقة',
    value: '8',
    icon: 'FaClock',
    color: 'from-amber-500 to-orange-500',
    bgColor: 'bg-amber-50',
    textColor: 'text-amber-600',
  },
  {
    id: 3,
    title: 'طلبات مكتملة',
    value: '156',
    icon: 'FaCheckCircle',
    color: 'from-emerald-500 to-green-500',
    bgColor: 'bg-emerald-50',
    textColor: 'text-emerald-600',
  },
  {
    id: 4,
    title: 'إيرادات اليوم',
    value: '3,450 ج.م',
    icon: 'FaMoneyBillWave',
    color: 'from-blue-500 to-indigo-500',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-600',
  },
  {
    id: 5,
    title: 'طلبات الشهر',
    value: '487',
    icon: 'FaCalendarAlt',
    color: 'from-purple-500 to-pink-500',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-600',
  },
  {
    id: 6,
    title: 'إيرادات الشهر',
    value: '89,200 ج.م',
    icon: 'FaChartLine',
    color: 'from-rose-500 to-red-500',
    bgColor: 'bg-rose-50',
    textColor: 'text-rose-600',
  },
];

/**
 * Order Status Configuration
 */
export const ORDER_STATUS = {
  pending_pharmacy_response: {
    label: "في انتظار رد الصيدلية",
    color: "yellow",
    bgColor: "bg-yellow-100",
    textColor: "text-yellow-800",
    borderColor: "border-yellow-300",
  },
  waiting_for_patient_confirmation: {
    label: "في انتظار تأكيد المريض",
    color: "blue",
    bgColor: "bg-blue-100",
    textColor: "text-blue-800",
    borderColor: "border-blue-300",
  },
  pending_payment: {
    label: "في انتظار الدفع",
    color: "orange",
    bgColor: "bg-orange-100",
    textColor: "text-orange-800",
    borderColor: "border-orange-300",
  },
  confirmed: {
    label: "تم تأكيد الطلب",
    color: "green",
    bgColor: "bg-green-100",
    textColor: "text-green-800",
    borderColor: "border-green-300",
  },
  preparation_in_progress: {
    label: "جاري تحضير الطلب",
    color: "purple",
    bgColor: "bg-purple-100",
    textColor: "text-purple-800",
    borderColor: "border-purple-300",
  },
  out_for_delivery: {
    label: "خرج للتوصيل",
    color: "indigo",
    bgColor: "bg-indigo-100",
    textColor: "text-indigo-800",
    borderColor: "border-indigo-300",
  },
  ready_for_pickup: {
    label: "جاهز للاستلام",
    color: "teal",
    bgColor: "bg-teal-100",
    textColor: "text-teal-800",
    borderColor: "border-teal-300",
  },
  delivered: {
    label: "تم التسليم",
    color: "emerald",
    bgColor: "bg-emerald-100",
    textColor: "text-emerald-800",
    borderColor: "border-emerald-300",
  },
  cancelled: {
    label: "ملغي",
    color: "red",
    bgColor: "bg-red-100",
    textColor: "text-red-800",
    borderColor: "border-red-300",
  },
};

/**
 * Medication Unit Types
 */
export const MEDICATION_UNITS = [
  { value: 'tablets', label: 'حبوب' },
  { value: 'capsules', label: 'كبسولات' },
  { value: 'syrup', label: 'شراب' },
  { value: 'ampoules', label: 'أمبولات' },
  { value: 'cream', label: 'كريم' },
  { value: 'ointment', label: 'مرهم' },
  { value: 'drops', label: 'نقط' },
  { value: 'spray', label: 'بخاخ' },
  { value: 'suppository', label: 'لبوس' },
  { value: 'injection', label: 'حقن' },
];

// ==================== Prescriptions ====================
// ✅ REMOVED - Now using API:
// - GET /api/pharmacies/me/prescriptions/pending
// - GET /api/pharmacies/me/prescriptions/{orderId}/details

/**
 * Completed Orders Mock Data
 */
export const MOCK_COMPLETED_ORDERS = [
  {
    id: 1,
    orderNumber: "ORD-2024-001",
    patientName: "أحمد محمد علي",
    orderDate: "2024-01-08T10:30:00",
    status: "delivered",
    medications: [
      { name: "Panadol", dosage: "500mg", frequency: "3 مرات يومياً", duration: "7 أيام", price: 25 },
      { name: "Augmentin", dosage: "1g", frequency: "مرتين يومياً", duration: "5 أيام", price: 85 },
      { name: "Brufen", dosage: "400mg", frequency: "عند الحاجة", duration: "10 أيام", price: 30 },
    ],
    subtotal: 140,
    deliveryFee: 20,
    totalPrice: 160,
    deliveryAddress: "القاهرة، مدينة نصر، شارع عباس العقاد، مبنى 15",
    deliveryNotes: "الدور الثالث",
  },
  {
    id: 2,
    orderNumber: "ORD-2024-002",
    patientName: "فاطمة حسن",
    orderDate: "2024-01-08T09:15:00",
    status: "out_for_delivery",
    medications: [
      { name: "Cetal", dosage: "250mg", frequency: "4 مرات يومياً", duration: "3 أيام", price: 15 },
      { name: "Amoxil", dosage: "500mg", frequency: "3 مرات يومياً", duration: "7 أيام", price: 45 },
    ],
    subtotal: 60,
    deliveryFee: 15,
    totalPrice: 75,
    deliveryAddress: "الجيزة، الدقي، شارع التحرير، مبنى 8",
    deliveryNotes: null,
  },
  {
    id: 3,
    orderNumber: "ORD-2024-003",
    patientName: "محمود السيد",
    orderDate: "2024-01-08T08:45:00",
    status: "preparation_in_progress",
    medications: [
      { name: "Omeprazole", dosage: "20mg", frequency: "مرة واحدة يومياً", duration: "14 يوم", price: 55 },
      { name: "Vitamin D", dosage: "1000 IU", frequency: "مرة واحدة يومياً", duration: "30 يوم", price: 40 },
      { name: "Aspirin", dosage: "75mg", frequency: "مرة واحدة يومياً", duration: "30 يوم", price: 20 },
    ],
    subtotal: 115,
    deliveryFee: 25,
    totalPrice: 140,
    deliveryAddress: "القاهرة، مصر الجديدة، شارع الحجاز، مبنى 22",
    deliveryNotes: "يرجى الاتصال قبل التوصيل",
  },
  {
    id: 4,
    orderNumber: "ORD-2024-004",
    patientName: "نور الدين",
    orderDate: "2024-01-08T07:20:00",
    status: "ready_for_pickup",
    medications: [
      { name: "Lipitor", dosage: "10mg", frequency: "مرة واحدة يومياً", duration: "30 يوم", price: 120 },
      { name: "Metformin", dosage: "500mg", frequency: "مرتين يومياً", duration: "30 يوم", price: 35 },
    ],
    subtotal: 155,
    deliveryFee: 0,
    totalPrice: 155,
    deliveryAddress: null, // Pickup
    deliveryNotes: null,
  },
  {
    id: 5,
    orderNumber: "ORD-2024-005",
    patientName: "سارة أحمد",
    orderDate: "2024-01-07T16:30:00",
    status: "delivered",
    medications: [
      { name: "Concor", dosage: "5mg", frequency: "مرة واحدة يومياً", duration: "30 يوم", price: 95 },
      { name: "Aspirin", dosage: "100mg", frequency: "مرة واحدة يومياً", duration: "30 يوم", price: 25 },
      { name: "Crestor", dosage: "10mg", frequency: "مرة واحدة يومياً", duration: "30 يوم", price: 150 },
      { name: "Glucophage", dosage: "850mg", frequency: "مرتين يومياً", duration: "30 يوم", price: 40 },
    ],
    subtotal: 310,
    deliveryFee: 20,
    totalPrice: 330,
    deliveryAddress: "القاهرة، المعادي، شارع 9، مبنى 12",
    deliveryNotes: "الدور الخامس، شقة 10",
  },
  {
    id: 6,
    orderNumber: "ORD-2024-006",
    patientName: "خالد عبد الله",
    orderDate: "2024-01-07T14:15:00",
    status: "confirmed",
    medications: [
      { name: "Ventolin Inhaler", dosage: "100mcg", frequency: "عند الحاجة", duration: "شهر", price: 65 },
      { name: "Flixotide", dosage: "125mcg", frequency: "مرتين يومياً", duration: "شهر", price: 180 },
    ],
    subtotal: 245,
    deliveryFee: 20,
    totalPrice: 265,
    deliveryAddress: "الجيزة، الهرم، شارع الهرم، مبنى 45",
    deliveryNotes: null,
  },
];

// Add more mock data here as needed...
