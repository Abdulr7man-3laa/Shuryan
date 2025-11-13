/**
 * Time Formatting Utilities
 * Handles both HH:mm and HH:mm:ss (TimeSpan) formats from backend
 * Format 24-hour time to 12-hour with Arabic AM/PM
 */
export const formatTime12h = (time24, amText = 'ص', pmText = 'م') => {
  if (!time24) return '--:--';
  
  try {
    // Split and take only hours and minutes (ignore seconds if present)
    const parts = time24.split(':');
    const hours = parseInt(parts[0], 10);
    const minutes = parseInt(parts[1], 10);
    
    // Validate
    if (isNaN(hours) || isNaN(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
      console.error('formatTime12h: Invalid time format:', time24);
      return '--:--';
    }
    
    const period = hours >= 12 ? pmText : amText;
    const hours12 = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
    return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
  } catch (error) {
    console.error('formatTime12h: Error formatting time:', error);
    return '--:--';
  }
};

/**
 * Normalize time from HH:mm:ss to HH:mm
 */
export const normalizeTime = (time) => {
  if (!time) return null;
  
  try {
    const parts = time.split(':');
    if (parts.length < 2) return null;
    
    const hours = parseInt(parts[0], 10);
    const minutes = parseInt(parts[1], 10);
    
    if (isNaN(hours) || isNaN(minutes)) return null;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  } catch (error) {
    console.error('normalizeTime: Error normalizing time:', error);
    return null;
  }
};

/**
 * Format date to Arabic
 */
export const formatDateArabic = (dateStr) => {
  if (!dateStr) return '';
  
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      console.error('formatDateArabic: Invalid date:', dateStr);
      return '';
    }
    
    const dayNames = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
    const monthNames = [
      'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
      'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
    ];
    
    return `${dayNames[date.getDay()]}، ${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`;
  } catch (error) {
    console.error('formatDateArabic: Error formatting date:', error);
    return '';
  }
};

/**
 * Parse time string to Date object
 * Supports both HH:mm and HH:mm:ss formats
 */
export const parseTime = (timeStr) => {
  if (!timeStr) {
    console.error('parseTime: timeStr is null or undefined');
    return null;
  }
  
  try {
    // Split and take only hours and minutes (ignore seconds if present)
    const parts = timeStr.split(':');
    const hours = parseInt(parts[0], 10);
    const minutes = parseInt(parts[1], 10);
    
    // Validate hours and minutes
    if (isNaN(hours) || isNaN(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
      console.error(`parseTime: Invalid time format: ${timeStr}`);
      return null;
    }
    
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
  } catch (error) {
    console.error(`parseTime: Error parsing time ${timeStr}:`, error);
    return null;
  }
};

/**
 * Format Date object to HH:mm string
 */
export const formatTimeToString = (date) => {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
    console.error('formatTimeToString: Invalid date object');
    return '00:00';
  }
  
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};
