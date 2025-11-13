
export const isAppointmentCompleted = (status) => {
  if (typeof status === 'number') {
    return status === 4; // Completed = 4
  }
  
  if (typeof status === 'string') {
    return status.toLowerCase() === 'completed';
  }
  
  return false;
};

export const isAppointmentInProgress = (status) => {
  if (typeof status === 'number') {
    return status === 3; // InProgress = 3
  }
  
  if (typeof status === 'string') {
    return status.toLowerCase() === 'inprogress';
  }
  
  return false;
};

export const isAppointmentConfirmed = (status) => {
  if (typeof status === 'number') {
    return status === 1; // Confirmed = 1
  }
  
  if (typeof status === 'string') {
    return status.toLowerCase() === 'confirmed';
  }
  
  return false;
};

export const getAppointmentStatusName = (status) => {
  if (typeof status === 'number') {
    const statusMap = {
      0: 'مجدول', // Scheduled
      1: 'محجوز',
      2: 'وصل المريض',
      3: 'جاري',
      4: 'منتهي',
      5: 'لم يحضر',
      6: 'ملغي',
    };
    return statusMap[status] || 'غير معروف';
  }
  
  if (typeof status === 'string') {
    const statusMap = {
      'confirmed': 'محجوز',
      'checkedin': 'وصل المريض',
      'inprogress': 'جاري',
      'completed': 'منتهي',
      'noshow': 'لم يحضر',
      'cancelled': 'ملغي',
    };
    return statusMap[status.toLowerCase()] || status;
  }
  
  return 'غير معروف';
};

export const AppointmentStatus = {
  Scheduled: 0,
  Confirmed: 1,
  CheckedIn: 2,
  InProgress: 3,
  Completed: 4,
  NoShow: 5,
  Cancelled: 6,
};
