/**
 * Verifier Feature Constants
 */

// Application Status (Backend Verification Status Enum)
export const APPLICATION_STATUS = {
  PENDING: 5,        // Sent - waiting for review
  UNDER_REVIEW: 1,   // UnderReview
  APPROVED: 2,       // Verified
  REJECTED: 3,       // Rejected
};

// Status Labels (Arabic)
export const STATUS_LABELS = {
  [APPLICATION_STATUS.PENDING]: 'جديد',           // 5 = Sent
  [APPLICATION_STATUS.UNDER_REVIEW]: 'قيد المراجعة', // 1 = UnderReview
  [APPLICATION_STATUS.APPROVED]: 'موثّق',          // 2 = Verified
  [APPLICATION_STATUS.REJECTED]: 'مرفوض',          // 3 = Rejected
};

// Status Colors
export const STATUS_COLORS = {
  5: { // PENDING (Sent)
    bg: 'bg-teal-100',
    text: 'text-teal-800',
    border: 'border-teal-300',
    badge: 'bg-[#009689]',
    hex: '#009689',
  },
  1: { // UNDER_REVIEW
    bg: 'bg-amber-100',
    text: 'text-amber-800',
    border: 'border-amber-300',
    badge: 'bg-amber-500',
  },
  2: { // APPROVED (Verified)
    bg: 'bg-green-100',
    text: 'text-green-800',
    border: 'border-green-300',
    badge: 'bg-green-500',
  },
  3: { // REJECTED
    bg: 'bg-red-100',
    text: 'text-red-800',
    border: 'border-red-300',
    badge: 'bg-red-500',
  },
};

// Application Type
export const APPLICATION_TYPE = {
  DOCTOR: 'doctor',
  PHARMACY: 'pharmacy',
  LABORATORY: 'laboratory',
};

// Type Labels (Arabic)
export const TYPE_LABELS = {
  [APPLICATION_TYPE.DOCTOR]: 'طبيب',
  [APPLICATION_TYPE.PHARMACY]: 'صيدلية',
  [APPLICATION_TYPE.LABORATORY]: 'معمل',
};

// Type Icons (React Icons)
export const TYPE_ICONS = {
  [APPLICATION_TYPE.DOCTOR]: 'FaUserMd',
  [APPLICATION_TYPE.PHARMACY]: 'FaPills',
  [APPLICATION_TYPE.LABORATORY]: 'FaFlask',
};

// Document Status
export const DOCUMENT_STATUS = {
  NOT_SUBMITTED: 'not_submitted',      // رفع المستند بس لسه مبعتش تقرير
  PENDING: 'pending',                  // قيد المراجعة (بعد إرسال التقرير)
  APPROVED: 'approved',
  REJECTED: 'rejected',
  CLARIFICATION_NEEDED: 'clarification_needed',
};

// Document Status Labels
export const DOCUMENT_STATUS_LABELS = {
  [DOCUMENT_STATUS.NOT_SUBMITTED]: 'غير مُرسل',
  [DOCUMENT_STATUS.PENDING]: 'قيد المراجعة',
  [DOCUMENT_STATUS.APPROVED]: 'مقبول',
  [DOCUMENT_STATUS.REJECTED]: 'مرفوض',
  [DOCUMENT_STATUS.CLARIFICATION_NEEDED]: 'يحتاج توضيح',
};

// Document Status Colors
export const DOCUMENT_STATUS_COLORS = {
  [DOCUMENT_STATUS.NOT_SUBMITTED]: {
    bg: 'bg-slate-100',
    text: 'text-slate-700',
    icon: '📄',
  },
  [DOCUMENT_STATUS.PENDING]: {
    bg: 'bg-amber-100',
    text: 'text-amber-700',
    icon: '⏳',
  },
  [DOCUMENT_STATUS.APPROVED]: {
    bg: 'bg-green-100',
    text: 'text-green-700',
    icon: '✅',
  },
  [DOCUMENT_STATUS.REJECTED]: {
    bg: 'bg-red-100',
    text: 'text-red-700',
    icon: '❌',
  },
  [DOCUMENT_STATUS.CLARIFICATION_NEEDED]: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-700',
    icon: '📝',
  },
};

// Navigation Items
export const VERIFIER_NAV_ITEMS = [
  {
    label: 'الإحصائيات',
    path: '/verifier/statistics',
    icon: 'FaChartBar',
  },
];
