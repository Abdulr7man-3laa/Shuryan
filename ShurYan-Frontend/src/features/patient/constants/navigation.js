import { 
  FaSearch, FaCalendarCheck, FaPrescriptionBottleAlt, 
  FaFlask, FaUser 
} from 'react-icons/fa';

/**
 * Patient Navigation Items
 */
export const PATIENT_NAV_ITEMS = [
  {
    id: 'search',
    label: 'البحث عن طبيب',
    path: '/patient/search',
    icon: FaSearch,
  },
  {
    id: 'appointments',
    label: 'مواعيدي',
    path: '/patient/appointments',
    icon: FaCalendarCheck,
  },
  {
    id: 'prescriptions',
    label: 'الروشتات',
    path: '/patient/prescriptions',
    icon: FaPrescriptionBottleAlt,
  },
  {
    id: 'lab-results',
    label: 'التحاليل',
    path: '/patient/lab-results',
    icon: FaFlask,
  },
];
