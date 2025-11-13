/**
 * Phone Number Helpers
 * Utilities for converting between old format (phone1, phone2, landline) 
 * and new format (phoneNumbers array)
 */

/**
 * Phone number types enum
 */
export const PhoneType = {
  MOBILE1: 0,
  MOBILE2: 1,
  LANDLINE: 2,
};

/**
 * Convert old format to new phoneNumbers array
 * @param {Object} oldFormat - {phone1, phone2, landline}
 * @returns {Array} phoneNumbers array
 */
export const convertToPhoneNumbersArray = (oldFormat) => {
  const phoneNumbers = [];

  if (oldFormat.phone1 || oldFormat.clinicPhone1) {
    phoneNumbers.push({
      number: oldFormat.phone1 || oldFormat.clinicPhone1,
      type: PhoneType.MOBILE1,
    });
  }

  if (oldFormat.phone2 || oldFormat.clinicPhone2) {
    phoneNumbers.push({
      number: oldFormat.phone2 || oldFormat.clinicPhone2,
      type: PhoneType.MOBILE2,
    });
  }

  if (oldFormat.landline || oldFormat.clinicLandline) {
    phoneNumbers.push({
      number: oldFormat.landline || oldFormat.clinicLandline,
      type: PhoneType.LANDLINE,
    });
  }

  return phoneNumbers;
};

/**
 * Convert phoneNumbers array to old format
 * @param {Array} phoneNumbers - Array of {number, type}
 * @returns {Object} {phone1, phone2, landline}
 */
export const convertFromPhoneNumbersArray = (phoneNumbers = []) => {
  const result = {
    phone1: '',
    phone2: '',
    landline: '',
  };

  phoneNumbers.forEach((phone) => {
    switch (phone.type) {
      case PhoneType.MOBILE1:
        result.phone1 = phone.number;
        break;
      case PhoneType.MOBILE2:
        result.phone2 = phone.number;
        break;
      case PhoneType.LANDLINE:
        result.landline = phone.number;
        break;
      default:
        break;
    }
  });

  return result;
};

/**
 * Get phone number by type
 * @param {Array} phoneNumbers - Array of {number, type}
 * @param {number} type - Phone type (0, 1, or 2)
 * @returns {string} Phone number or empty string
 */
export const getPhoneByType = (phoneNumbers = [], type) => {
  const phone = phoneNumbers.find((p) => p.type === type);
  return phone ? phone.number : '';
};

/**
 * Update or add phone number
 * @param {Array} phoneNumbers - Current phoneNumbers array
 * @param {string} number - Phone number
 * @param {number} type - Phone type
 * @returns {Array} Updated phoneNumbers array
 */
export const updatePhoneNumber = (phoneNumbers = [], number, type) => {
  const filtered = phoneNumbers.filter((p) => p.type !== type);
  
  if (number && number.trim()) {
    return [...filtered, { number: number.trim(), type }];
  }
  
  return filtered;
};

/**
 * Validate Egyptian phone number
 * @param {string} phone - Phone number
 * @param {number} type - Phone type
 * @returns {boolean} Is valid
 */
export const isValidEgyptianPhone = (phone, type) => {
  if (!phone || !phone.trim()) return true; // Empty is valid (optional)

  const cleanPhone = phone.replace(/\s+/g, '');

  // Mobile validation (01xxxxxxxxx)
  if (type === PhoneType.MOBILE1 || type === PhoneType.MOBILE2) {
    return /^01[0-2,5]{1}[0-9]{8}$/.test(cleanPhone);
  }

  // Landline validation (0[2-9]xxxxxxx or 0[2-9]xxxxxxxx)
  if (type === PhoneType.LANDLINE) {
    return /^0[2-9][0-9]{7,8}$/.test(cleanPhone);
  }

  return false;
};

/**
 * Format phone number for display
 * @param {string} phone - Phone number
 * @returns {string} Formatted phone
 */
export const formatPhoneNumber = (phone) => {
  if (!phone) return '';
  
  const cleaned = phone.replace(/\D/g, '');
  
  // Mobile: 0111 222 3333
  if (cleaned.startsWith('01') && cleaned.length === 11) {
    return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`;
  }
  
  // Landline: 02 1234 5678
  if (cleaned.startsWith('0') && cleaned.length >= 9) {
    return `${cleaned.slice(0, 2)} ${cleaned.slice(2, 6)} ${cleaned.slice(6)}`;
  }
  
  return phone;
};

/**
 * Get phone type label in Arabic
 * @param {number} type - Phone type
 * @returns {string} Arabic label
 */
export const getPhoneTypeLabel = (type) => {
  switch (type) {
    case PhoneType.MOBILE1:
      return 'موبايل 1';
    case PhoneType.MOBILE2:
      return 'موبايل 2';
    case PhoneType.LANDLINE:
      return 'تليفون أرضي';
    default:
      return 'غير معروف';
  }
};
