import { FaHome, FaShoppingCart, FaUser } from 'react-icons/fa';

/**
 * Pharmacy Navigation Items
 * @constant {Array<Object>}
 */
export const PHARMACY_NAV_ITEMS = [
  {
    id: 'dashboard',
    name: 'الرئيسية',
    href: '/pharmacy/dashboard',
    icon: FaHome,
  },
  {
    id: 'orders',
    name: 'الطلبات',
    href: '/pharmacy/orders',
    icon: FaShoppingCart,
  },
];
