import { FaHome, FaFlask, FaUser, FaMicroscope } from 'react-icons/fa';

/**
 * Laboratory Navigation Items
 * @constant {Array<Object>}
 */
export const LABORATORY_NAV_ITEMS = [
  {
    id: 'dashboard',
    name: 'الرئيسية',
    href: '/laboratory/dashboard',
    icon: FaHome,
  },
  {
    id: 'services',
    name: 'الخدمات',
    href: '/laboratory/services',
    icon: FaMicroscope,
  },
  {
    id: 'orders',
    name: 'الطلبات',
    href: '/laboratory/orders',
    icon: FaFlask,
  },
];
