import React from 'react';
import { FaClock } from 'react-icons/fa';

/**
 * TimePicker Component
 * Custom time picker with hour/minute dropdowns + AM/PM
 * 
 * Format: 12-hour (01-12) + AM/PM
 * Display: Arabic "ص" و "م"
 */
const TimePicker = ({ 
  value = '', 
  period = 'AM', 
  onChange, 
  onPeriodChange,
  disabled = false,
  placeholder = 'اختر الوقت',
  className = ''
}) => {
  // Parse time value (HH:mm)
  const parseTime = (timeStr) => {
    if (!timeStr || !timeStr.includes(':')) {
      return { hours: '', minutes: '' };
    }
    const [hours, minutes] = timeStr.split(':');
    return { 
      hours: hours.padStart(2, '0'), 
      minutes: minutes.padStart(2, '0') 
    };
  };

  const { hours, minutes } = parseTime(value);

  // Generate hours (01-12 for 12-hour format)
  const hourOptions = Array.from({ length: 12 }, (_, i) => {
    const hour = (i + 1).toString().padStart(2, '0');
    return { value: hour, label: hour };
  });

  // Generate minutes (00-59)
  const minuteOptions = Array.from({ length: 60 }, (_, i) => {
    const minute = i.toString().padStart(2, '0');
    return { value: minute, label: minute };
  });

  // Handle hour change
  const handleHourChange = (newHour) => {
    if (!newHour) {
      onChange(''); // Clear time if hour is empty
      return;
    }
    const newTime = `${newHour}:${minutes || '00'}`;
    onChange(newTime);
  };

  // Handle minute change
  const handleMinuteChange = (newMinute) => {
    if (!newMinute) {
      onChange(''); // Clear time if minute is empty
      return;
    }
    const newTime = `${hours || '09'}:${newMinute}`;
    onChange(newTime);
  };

  return (
    <div className={`flex gap-2 items-center ${className}`}>
      {/* Hour Dropdown */}
      <select
        value={hours}
        onChange={(e) => handleHourChange(e.target.value)}
        disabled={disabled}
        className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-400 text-center font-mono disabled:bg-slate-100 disabled:cursor-not-allowed"
        dir="ltr"
      >
        <option value="">--</option>
        {hourOptions.map(opt => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {/* Separator */}
      <span className="text-slate-600 font-bold">:</span>

      {/* Minute Dropdown */}
      <select
        value={minutes}
        onChange={(e) => handleMinuteChange(e.target.value)}
        disabled={disabled}
        className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-400 text-center font-mono disabled:bg-slate-100 disabled:cursor-not-allowed"
        dir="ltr"
      >
        <option value="">--</option>
        {minuteOptions.map(opt => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {/* AM/PM Dropdown */}
      <select
        value={period}
        onChange={(e) => onPeriodChange(e.target.value)}
        disabled={disabled}
        className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-400 disabled:bg-slate-100 disabled:cursor-not-allowed"
      >
        <option value="AM">ص</option>
        <option value="PM">م</option>
      </select>

      {/* Clock Icon */}
      <FaClock className="text-slate-400" />
    </div>
  );
};

export default TimePicker;
