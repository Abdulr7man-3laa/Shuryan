import {
  FaCalendarAlt,
  FaChartLine,
  FaUsers,
  FaStar,
} from 'react-icons/fa';

/**
 * Doctor Dashboard Navigation Items
 * @constant {Array<Object>}
 */
export const DOCTOR_NAV_ITEMS = [
  {
    id: 'dashboard',
    name: 'الرئيسية',
    href: '/doctor/dashboard',
    icon: FaChartLine,
  },
  {
    id: 'patients',
    name: 'المرضى',
    href: '/doctor/patients',
    icon: FaUsers,
  },
  {
    id: 'appointments',
    name: 'المواعيد',
    href: '/doctor/appointments',
    icon: FaCalendarAlt,
  },
  {
    id: 'reviews',
    name: 'التقييمات',
    href: '/doctor/reviews',
    icon: FaStar,
  },
];
