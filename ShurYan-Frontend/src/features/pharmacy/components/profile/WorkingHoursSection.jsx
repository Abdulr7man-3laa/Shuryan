import { useState, useEffect, useRef } from 'react';
import { FaClock, FaCheckCircle, FaExclamationCircle, FaSpinner } from 'react-icons/fa';
import TimePicker from '@/components/ui/TimePicker';
import usePharmacyProfile from '../../hooks/usePharmacyProfile';

/**
 * WorkingHoursSection Component
 * Displays and manages pharmacy working hours with auto-save
 */
const WorkingHoursSection = () => {
  const { workingHours, loading, error, success, updateWorkingHours } = usePharmacyProfile({
    autoFetch: false,
  });

  // Days mapping
  const daysMap = {
    saturday: 'السبت',
    sunday: 'الأحد',
    monday: 'الاثنين',
    tuesday: 'الثلاثاء',
    wednesday: 'الأربعاء',
    thursday: 'الخميس',
    friday: 'الجمعة',
  };

  // Initial schedule state
  const initialSchedule = {
    saturday: { enabled: false, fromTime: '09:00', toTime: '05:00', fromPeriod: 'AM', toPeriod: 'PM' },
    sunday: { enabled: false, fromTime: '09:00', toTime: '05:00', fromPeriod: 'AM', toPeriod: 'PM' },
    monday: { enabled: false, fromTime: '09:00', toTime: '05:00', fromPeriod: 'AM', toPeriod: 'PM' },
    tuesday: { enabled: false, fromTime: '09:00', toTime: '05:00', fromPeriod: 'AM', toPeriod: 'PM' },
    wednesday: { enabled: false, fromTime: '09:00', toTime: '05:00', fromPeriod: 'AM', toPeriod: 'PM' },
    thursday: { enabled: false, fromTime: '09:00', toTime: '05:00', fromPeriod: 'AM', toPeriod: 'PM' },
    friday: { enabled: false, fromTime: '09:00', toTime: '05:00', fromPeriod: 'AM', toPeriod: 'PM' },
  };

  const [schedule, setSchedule] = useState(initialSchedule);

  // Auto-save state
  const [autoSaveStatus, setAutoSaveStatus] = useState('');
  const hasChangesRef = useRef(false);
  const lastSavedDataRef = useRef(null);
  const autoSaveTimeoutRef = useRef(null);

  // Initialize schedule
  useEffect(() => {
    if (workingHours) {
      console.log('🕐 [WorkingHours] Initializing from backend:', workingHours);
      
      // Normalize data from backend - ensure all required fields exist
      const normalizedSchedule = {};
      Object.keys(initialSchedule).forEach(day => {
        const backendDay = workingHours[day] || {};
        
        // Convert backend format "HH" to TimePicker format "HH:mm"
        const fromTime = backendDay.fromTime 
          ? (backendDay.fromTime.includes(':') ? backendDay.fromTime : `${backendDay.fromTime}:00`)
          : '09:00';
        const toTime = backendDay.toTime 
          ? (backendDay.toTime.includes(':') ? backendDay.toTime : `${backendDay.toTime}:00`)
          : '05:00';
        
        normalizedSchedule[day] = {
          enabled: backendDay.enabled || false,
          fromTime,
          toTime,
          fromPeriod: backendDay.fromPeriod || 'AM',
          toPeriod: backendDay.toPeriod || 'PM',
        };
      });
      
      console.log('🕐 [WorkingHours] Normalized schedule:', normalizedSchedule);
      setSchedule(normalizedSchedule);
      lastSavedDataRef.current = JSON.stringify(normalizedSchedule);
    }
  }, [workingHours]);

  // Handle day toggle
  const handleDayToggle = (day) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        enabled: !prev[day].enabled,
      },
    }));
    hasChangesRef.current = true;
    setAutoSaveStatus('pending');
  };

  // Handle time change
  const handleTimeChange = (day, field, value) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value,
      },
    }));
    hasChangesRef.current = true;
    setAutoSaveStatus('pending');
  };

  // Auto-save function
  const performAutoSave = async () => {
    console.log('🕐 [WorkingHours] Starting auto-save...');
    const currentData = JSON.stringify(schedule);
    const hasChanges = currentData !== lastSavedDataRef.current;

    console.log('🕐 [WorkingHours] Has changes:', hasChanges);
    console.log('🕐 [WorkingHours] Current schedule:', schedule);

    if (!hasChanges) {
      console.log('🕐 [WorkingHours] No changes detected, skipping save');
      setAutoSaveStatus('');
      return;
    }

    // Validate: enabled days must have valid times
    const isValid = Object.entries(schedule).every(([day, data]) => {
      if (!data.enabled) return true;
      const valid = data.fromTime && data.toTime && data.fromPeriod && data.toPeriod;
      if (!valid) {
        console.log(`🕐 [WorkingHours] Invalid data for ${day}:`, data);
      }
      return valid;
    });

    console.log('🕐 [WorkingHours] Validation result:', isValid);

    if (!isValid) {
      console.error('🕐 [WorkingHours] Validation failed!');
      setAutoSaveStatus('error');
      return;
    }

    setAutoSaveStatus('saving');

    try {
      // Convert time format from "HH:mm" to "HH" for backend
      console.log('🕐 [WorkingHours] Original schedule before conversion:', schedule);
      
      const scheduleForBackend = {};
      Object.entries(schedule).forEach(([day, data]) => {
        scheduleForBackend[day] = {
          enabled: data.enabled,
          fromTime: data.fromTime ? data.fromTime.split(':')[0] : '',
          toTime: data.toTime ? data.toTime.split(':')[0] : '',
          fromPeriod: data.fromPeriod,
          toPeriod: data.toPeriod,
        };
      });

      console.log('🕐 [WorkingHours] Converted schedule for backend:', scheduleForBackend);
      console.log('🕐 [WorkingHours] Calling updateWorkingHours with:', { weeklySchedule: scheduleForBackend });
      const result = await updateWorkingHours({ weeklySchedule: scheduleForBackend });
      console.log('🕐 [WorkingHours] Update result:', result);

      if (result.success) {
        console.log('✅ [WorkingHours] Save successful!');
        lastSavedDataRef.current = currentData;
        hasChangesRef.current = false;
        setAutoSaveStatus('saved');

        setTimeout(() => {
          setAutoSaveStatus('');
        }, 2000);
      } else {
        console.error('❌ [WorkingHours] Save failed - result.success is false');
        console.error('❌ [WorkingHours] Error:', result.error);
        setAutoSaveStatus('error');
      }
    } catch (error) {
      console.error('❌ [WorkingHours] Auto-save error:', error);
      console.error('❌ [WorkingHours] Error response:', error.response?.data);
      setAutoSaveStatus('error');
    }
  };

  // Auto-save effect
  useEffect(() => {
    if (hasChangesRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
      autoSaveTimeoutRef.current = setTimeout(() => {
        performAutoSave();
      }, 3000);
    }

    return () => clearTimeout(autoSaveTimeoutRef.current);
  }, [schedule]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-500 to-emerald-500 px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <FaClock className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white">ساعات العمل</h2>
              <p className="text-teal-50 text-sm mt-1">أوقات عمل الصيدلية خلال الأسبوع</p>
            </div>
          </div>

          {/* Auto-save status */}
          {autoSaveStatus && (
            <div
              className={`px-4 py-2 backdrop-blur-sm rounded-lg ${
                autoSaveStatus === 'pending'
                  ? 'bg-yellow-500/20 text-yellow-100'
                  : autoSaveStatus === 'saving'
                  ? 'bg-blue-500/20 text-blue-100'
                  : autoSaveStatus === 'saved'
                  ? 'bg-green-500/30 text-green-100'
                  : autoSaveStatus === 'error'
                  ? 'bg-red-500/20 text-red-100'
                  : ''
              }`}
            >
              <span className="text-sm font-medium flex items-center gap-2">
                {autoSaveStatus === 'pending' && '⏳ سيتم الحفظ خلال 3 ثواني...'}
                {autoSaveStatus === 'saving' && (
                  <>
                    <FaSpinner className="animate-spin" />
                    جاري الحفظ...
                  </>
                )}
                {autoSaveStatus === 'saved' && (
                  <>
                    <FaCheckCircle />تم الحفظ
                  </>
                )}
                {autoSaveStatus === 'error' && (
                  <>
                    <FaExclamationCircle />فشل الحفظ
                  </>
                )}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(daysMap).map(([dayKey, dayLabel]) => {
            const dayData = schedule[dayKey];

            return (
              <div
                key={dayKey}
                className={`p-6 rounded-xl border-2 transition-all ${
                  dayData.enabled
                    ? 'border-teal-300 bg-teal-50/50'
                    : 'border-slate-200 bg-slate-50'
                }`}
              >
                {/* Day Header */}
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-slate-800">{dayLabel}</h3>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={dayData.enabled}
                      onChange={() => handleDayToggle(dayKey)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-500"></div>
                  </label>
                </div>

                {/* Time Inputs */}
                {dayData.enabled && (
                  <div className="space-y-3">
                    {/* From Time */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">
                        من
                      </label>
                      <TimePicker
                        value={dayData.fromTime}
                        period={dayData.fromPeriod}
                        onChange={(time) => handleTimeChange(dayKey, 'fromTime', time)}
                        onPeriodChange={(period) =>
                          handleTimeChange(dayKey, 'fromPeriod', period)
                        }
                        className="text-sm"
                      />
                    </div>

                    {/* To Time */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">
                        إلى
                      </label>
                      <TimePicker
                        value={dayData.toTime}
                        period={dayData.toPeriod}
                        onChange={(time) => handleTimeChange(dayKey, 'toTime', time)}
                        onPeriodChange={(period) => handleTimeChange(dayKey, 'toPeriod', period)}
                        className="text-sm"
                      />
                    </div>
                  </div>
                )}

                {/* Closed Message */}
                {!dayData.enabled && (
                  <div className="text-center py-4">
                    <p className="text-sm text-slate-500 font-medium">مغلق</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Error Messages */}
        {error.workingHours && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-sm text-red-600">{error.workingHours}</p>
          </div>
        )}

        {/* Success Messages */}
        {success.workingHours && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl">
            <p className="text-sm text-green-600 flex items-center gap-2">
              <FaCheckCircle />
              {success.workingHours}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkingHoursSection;
