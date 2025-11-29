/**
 * Date Formatting Utilities
 * Handles date formatting with Arabic locale support
 */

/**
 * Format date to Arabic (e.g., "الأحد، 15 يناير 2024")
 */
export const formatDate = (dateStr) => {
  if (!dateStr) return '';
  
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      console.error('formatDate: Invalid date:', dateStr);
      return '';
    }
    
    const dayNames = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
    const monthNames = [
      'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
      'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
    ];
    
    return `${dayNames[date.getDay()]}، ${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`;
  } catch (error) {
    console.error('formatDate: Error formatting date:', error);
    return '';
  }
};

/**
 * Format date to short format (e.g., "15 يناير 2024")
 */
export const formatDateShort = (dateStr) => {
  if (!dateStr) return '';
  
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      console.error('formatDateShort: Invalid date:', dateStr);
      return '';
    }
    
    const monthNames = [
      'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
      'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
    ];
    
    return `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`;
  } catch (error) {
    console.error('formatDateShort: Error formatting date:', error);
    return '';
  }
};

/**
 * Format date and time (e.g., "15 يناير 2024 - 10:30 ص")
 */
export const formatDateTime = (dateStr) => {
  if (!dateStr) return '';
  
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      console.error('formatDateTime: Invalid date:', dateStr);
      return '';
    }
    
    const monthNames = [
      'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
      'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
    ];
    
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const period = hours >= 12 ? 'م' : 'ص';
    const hours12 = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
    
    return `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()} - ${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
  } catch (error) {
    console.error('formatDateTime: Error formatting date time:', error);
    return '';
  }
};

/**
 * Get relative time (e.g., "منذ 5 دقائق", "منذ ساعتين", "منذ يومين")
 */
export const getRelativeTime = (dateStr) => {
  if (!dateStr) return '';
  
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      console.error('getRelativeTime: Invalid date:', dateStr);
      return '';
    }
    
    const now = new Date();
    const diffMs = now - date;
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffSeconds < 60) {
      return 'الآن';
    } else if (diffMinutes < 60) {
      return `منذ ${diffMinutes} ${diffMinutes === 1 ? 'دقيقة' : diffMinutes === 2 ? 'دقيقتين' : 'دقائق'}`;
    } else if (diffHours < 24) {
      return `منذ ${diffHours} ${diffHours === 1 ? 'ساعة' : diffHours === 2 ? 'ساعتين' : 'ساعات'}`;
    } else if (diffDays < 7) {
      return `منذ ${diffDays} ${diffDays === 1 ? 'يوم' : diffDays === 2 ? 'يومين' : 'أيام'}`;
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `منذ ${weeks} ${weeks === 1 ? 'أسبوع' : weeks === 2 ? 'أسبوعين' : 'أسابيع'}`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `منذ ${months} ${months === 1 ? 'شهر' : months === 2 ? 'شهرين' : 'أشهر'}`;
    } else {
      const years = Math.floor(diffDays / 365);
      return `منذ ${years} ${years === 1 ? 'سنة' : years === 2 ? 'سنتين' : 'سنوات'}`;
    }
  } catch (error) {
    console.error('getRelativeTime: Error calculating relative time:', error);
    return '';
  }
};

/**
 * Format date to ISO string (YYYY-MM-DD)
 */
export const formatDateISO = (date) => {
  if (!date) return '';
  
  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) {
      console.error('formatDateISO: Invalid date:', date);
      return '';
    }
    
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  } catch (error) {
    console.error('formatDateISO: Error formatting date:', error);
    return '';
  }
};

/**
 * Check if date is today
 */
export const isToday = (dateStr) => {
  if (!dateStr) return false;
  
  try {
    const date = new Date(dateStr);
    const today = new Date();
    
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  } catch (error) {
    console.error('isToday: Error checking date:', error);
    return false;
  }
};

/**
 * Check if date is in the past
 */
export const isPast = (dateStr) => {
  if (!dateStr) return false;
  
  try {
    const date = new Date(dateStr);
    const now = new Date();
    
    return date < now;
  } catch (error) {
    console.error('isPast: Error checking date:', error);
    return false;
  }
};
