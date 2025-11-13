/**
 * Mock Data for Pharmacy Reports
 * ⚠️ TO BE REMOVED when API endpoint is ready
 * 
 * This file contains temporary mock data for testing the pharmacy report feature.
 * Replace with actual API call: GET /api/pharmacy-reports/{pharmacyId}/{prescriptionId}
 */

export const MOCK_PHARMACY_REPORTS = {
  // Pharmacy 1 - Has responded
  '1': {
    pharmacyId: '1',
    pharmacyName: 'صيدلية النور',
    status: 'responded',
    respondedAt: '2024-11-12T10:30:00',
    medications: [
      {
        id: 'med1',
        name: 'أموكسيسيلين 500 مجم',
        availability: 'available', // available, unavailable, has_alternative
        unit: 'كبسولة',
        unitPrice: 2.5,
        quantity: 20,
        totalPrice: 50,
      },
      {
        id: 'med2',
        name: 'باراسيتامول 500 مجم',
        availability: 'available',
        unit: 'قرص',
        unitPrice: 0.5,
        quantity: 30,
        totalPrice: 15,
      },
      {
        id: 'med3',
        name: 'فيتامين د 1000 وحدة',
        availability: 'unavailable',
        unit: 'كبسولة',
        unitPrice: null,
        quantity: 30,
        totalPrice: null,
        reason: 'غير متوفر حالياً',
      },
      {
        id: 'med4',
        name: 'أوميجا 3',
        availability: 'has_alternative',
        unit: 'كبسولة',
        unitPrice: 3.0,
        quantity: 30,
        totalPrice: 90,
        originalName: 'أوميجا 3 - ماركة أ',
        alternativeName: 'أوميجا 3 - ماركة ب',
        alternativeReason: 'بديل بنفس الفعالية',
      },
    ],
    summary: {
      totalItems: 4,
      availableItems: 2,
      unavailableItems: 1,
      alternativeItems: 1,
      subtotal: 155,
      deliveryFee: 15,
      total: 170,
    },
    notes: 'جميع الأدوية المتوفرة من مصادر موثوقة. البديل المقترح لأوميجا 3 له نفس الفعالية.',
  },
  
  // Pharmacy 2 - Pending
  '2': {
    pharmacyId: '2',
    status: 'pending',
  },
  
  // Pharmacy 3 - Pending
  '3': {
    pharmacyId: '3',
    status: 'pending',
  },
};

/**
 * Get availability status config
 */
export const AVAILABILITY_STATUS = {
  available: {
    label: 'متوفر',
    color: 'green',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    textColor: 'text-green-700',
    iconColor: 'text-green-600',
  },
  unavailable: {
    label: 'غير متوفر',
    color: 'red',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    textColor: 'text-red-700',
    iconColor: 'text-red-600',
  },
  has_alternative: {
    label: 'بديل متوفر',
    color: 'amber',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    textColor: 'text-amber-700',
    iconColor: 'text-amber-600',
  },
};

/**
 * Simulates API call to fetch pharmacy report
 */
export const fetchPharmacyReport = async (pharmacyId, prescriptionId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('📋 Fetching report for pharmacy:', pharmacyId, 'prescription:', prescriptionId);
      const report = MOCK_PHARMACY_REPORTS[pharmacyId] || { status: 'pending' };
      resolve(report);
    }, 500);
  });
};
