import React, { useState, useMemo, useCallback } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'moment/locale/ar';
import { FaToggleOn, FaToggleOff, FaClock, FaCalendarPlus, FaPlus } from 'react-icons/fa';
import TimePicker from '@/components/ui/TimePicker';

// Configure moment for Arabic
moment.locale('ar');
const localizer = momentLocalizer(moment);

/**
 * WeeklyScheduleCalendar Component
 * 
 * Modern calendar view for weekly schedule management
 * Uses React Big Calendar for better UX
 * 
 * Features:
 * - Visual week view
 * - Click to toggle days
 * - Easy time selection
 * - Color-coded days
 */
const WeeklyScheduleCalendar = ({ 
  weeklySchedule, 
  isEditing, 
  onScheduleChange,
  exceptionalDates = [],
  onRemoveException,
  newException,
  onNewExceptionChange,
  onAddException,
  loading = {}
}) => {
  const [selectedDay, setSelectedDay] = useState(null);

  // Days configuration with Arabic names
  const daysConfig = [
    { key: 'saturday', name: 'السبت', dayIndex: 6, color: '#ec4899' },
    { key: 'sunday', name: 'الأحد', dayIndex: 0, color: '#ef4444' },
    { key: 'monday', name: 'الاثنين', dayIndex: 1, color: '#3b82f6' },
    { key: 'tuesday', name: 'الثلاثاء', dayIndex: 2, color: '#10b981' },
    { key: 'wednesday', name: 'الأربعاء', dayIndex: 3, color: '#eab308' },
    { key: 'thursday', name: 'الخميس', dayIndex: 4, color: '#a855f7' },
    { key: 'friday', name: 'الجمعة', dayIndex: 5, color: '#6366f1' }
  ];

  // Convert schedule to calendar events
  const events = useMemo(() => {
    const eventsList = [];
    
    daysConfig.forEach(day => {
      const schedule = weeklySchedule[day.key];
      if (schedule && schedule.enabled && schedule.fromTime && schedule.toTime) {
        // Create a date for this week
        const today = moment();
        const dayDate = moment().day(day.dayIndex);
        
        // Parse time with period
        const fromHour = parseInt(schedule.fromTime.split(':')[0]);
        const fromMinute = parseInt(schedule.fromTime.split(':')[1] || 0);
        const toHour = parseInt(schedule.toTime.split(':')[0]);
        const toMinute = parseInt(schedule.toTime.split(':')[1] || 0);
        
        // Adjust for AM/PM
        let adjustedFromHour = fromHour;
        let adjustedToHour = toHour;
        
        if (schedule.fromPeriod === 'PM' && fromHour !== 12) {
          adjustedFromHour += 12;
        } else if (schedule.fromPeriod === 'AM' && fromHour === 12) {
          adjustedFromHour = 0;
        }
        
        if (schedule.toPeriod === 'PM' && toHour !== 12) {
          adjustedToHour += 12;
        } else if (schedule.toPeriod === 'AM' && toHour === 12) {
          adjustedToHour = 0;
        }
        
        const start = dayDate.clone().hour(adjustedFromHour).minute(fromMinute).toDate();
        const end = dayDate.clone().hour(adjustedToHour).minute(toMinute).toDate();
        
        eventsList.push({
          id: day.key,
          title: `${day.name} - ${schedule.fromTime} ${schedule.fromPeriod === 'AM' ? 'ص' : 'م'} - ${schedule.toTime} ${schedule.toPeriod === 'AM' ? 'ص' : 'م'}`,
          start,
          end,
          resource: {
            dayKey: day.key,
            dayName: day.name,
            color: day.color,
            schedule
          }
        });
      }
    });
    
    return eventsList;
  }, [weeklySchedule]);

  // Handle day toggle
  const handleToggleDay = (dayKey) => {
    if (!isEditing) return;
    
    onScheduleChange({
      ...weeklySchedule,
      [dayKey]: {
        ...weeklySchedule[dayKey],
        enabled: !weeklySchedule[dayKey].enabled
      }
    });
  };

  // Handle time change
  const handleTimeChange = (dayKey, field, value) => {
    if (!isEditing) return;
    
    onScheduleChange({
      ...weeklySchedule,
      [dayKey]: {
        ...weeklySchedule[dayKey],
        [field]: value
      }
    });
  };

  // Custom event style
  const eventStyleGetter = (event) => {
    return {
      style: {
        backgroundColor: event.resource.color,
        borderRadius: '8px',
        opacity: 0.9,
        color: 'white',
        border: '0px',
        display: 'block',
        fontSize: '12px',
        fontWeight: '600',
        padding: '4px 8px'
      }
    };
  };

  // Custom day cell wrapper
  const DayCell = ({ children, value }) => {
    const dayIndex = moment(value).day();
    const dayConfig = daysConfig.find(d => d.dayIndex === dayIndex);
    const schedule = dayConfig ? weeklySchedule[dayConfig.key] : null;
    
    return (
      <div className={`h-full ${schedule?.enabled ? 'bg-green-50' : 'bg-slate-50'}`}>
        {children}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Time Settings for Each Day with Toggle */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {daysConfig.map(day => {
          const schedule = weeklySchedule[day.key] || { enabled: false, fromTime: '', toTime: '', fromPeriod: 'AM', toPeriod: 'PM' };
          
          return (
            <div 
              key={day.key}
              className={`rounded-lg p-4 border-2 shadow-sm transition-all duration-200 ${
                schedule.enabled 
                  ? 'bg-white' 
                  : 'bg-slate-50 opacity-75'
              }`}
              style={{ borderColor: day.color }}
            >
              {/* Header with Toggle */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-6 h-6 rounded-full flex items-center justify-center text-white font-bold text-xs"
                    style={{ backgroundColor: day.color }}
                  >
                    {day.name.charAt(0)}
                  </div>
                  <span className="font-semibold text-slate-800">{day.name}</span>
                </div>
                
                {/* Toggle Button */}
                <button
                  onClick={() => handleToggleDay(day.key)}
                  disabled={!isEditing}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
                    schedule.enabled
                      ? 'bg-green-100 text-green-700 hover:bg-green-200'
                      : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                  } ${!isEditing ? 'cursor-not-allowed opacity-50' : ''}`}
                >
                  {schedule.enabled ? (
                    <>
                      <FaToggleOn className="w-4 h-4" />
                      <span>مفعل</span>
                    </>
                  ) : (
                    <>
                      <FaToggleOff className="w-4 h-4" />
                      <span>معطل</span>
                    </>
                  )}
                </button>
              </div>
              
              {/* Time Inputs */}
              <div className={`space-y-3 ${!schedule.enabled ? 'pointer-events-none opacity-50' : ''}`}>
                {/* From Time */}
                <div>
                  <label className="block text-xs text-slate-600 mb-1">من الساعة:</label>
                  <TimePicker
                    value={schedule.fromTime || ''}
                    period={schedule.fromPeriod || 'AM'}
                    onChange={(time) => handleTimeChange(day.key, 'fromTime', time)}
                    onPeriodChange={(period) => handleTimeChange(day.key, 'fromPeriod', period)}
                    disabled={!isEditing || !schedule.enabled}
                    className="text-sm"
                  />
                </div>
                
                {/* To Time */}
                <div>
                  <label className="block text-xs text-slate-600 mb-1">إلى الساعة:</label>
                  <TimePicker
                    value={schedule.toTime || ''}
                    period={schedule.toPeriod || 'PM'}
                    onChange={(time) => handleTimeChange(day.key, 'toTime', time)}
                    onPeriodChange={(period) => handleTimeChange(day.key, 'toPeriod', period)}
                    disabled={!isEditing || !schedule.enabled}
                    className="text-sm"
                  />
                </div>
              </div>
              
              {/* Disabled Overlay Message */}
              {!schedule.enabled && (
                <div className="mt-3 text-center">
                  <p className="text-xs text-slate-500 italic">قم بتفعيل اليوم لإضافة مواعيد</p>
                </div>
              )}
            </div>
          );
        })}
        
        {/* Exceptional Dates Section - Takes 2 columns */}
        <div className="md:col-span-2 lg:col-span-2 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4 border-2 border-purple-300 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                <FaCalendarPlus className="w-3 h-3 text-white" />
              </div>
              <h4 className="font-semibold text-slate-800 text-sm">المواعيد الاستثنائية</h4>
            </div>
            
            {/* Add Button - Shows form when clicked */}
            {isEditing && newException && (
              <span className="text-xs text-purple-600 font-medium">
                {exceptionalDates.length} موعد
              </span>
            )}
          </div>
          
          {/* Add New Exception Form - Compact */}
          {isEditing && newException && onNewExceptionChange && onAddException && (
            <div className="bg-white rounded-lg p-3 border border-purple-200 mb-3">
              <div className="grid grid-cols-2 gap-2 mb-2">
                {/* Date */}
                <input
                  type="date"
                  value={newException.date}
                  onChange={(e) => onNewExceptionChange({...newException, date: e.target.value})}
                  className="px-2 py-1.5 text-xs border border-purple-300 rounded-lg focus:ring-1 focus:ring-purple-200"
                  dir="ltr"
                  placeholder="التاريخ"
                />
                
                {/* Is Closed Checkbox */}
                <label className="flex items-center gap-1.5 px-2 py-1.5 bg-slate-50 rounded-lg cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newException.isClosed}
                    onChange={(e) => onNewExceptionChange({...newException, isClosed: e.target.checked})}
                    className="w-3 h-3 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <span className="text-xs text-slate-700">يوم إجازة</span>
                </label>
              </div>
              
              {/* Time Inputs - Only if not closed */}
              {!newException.isClosed && (
                <div className="space-y-2 mb-2">
                  {/* From Time */}
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">من:</label>
                    <TimePicker
                      value={newException.fromTime}
                      period={newException.fromPeriod}
                      onChange={(time) => onNewExceptionChange({...newException, fromTime: time})}
                      onPeriodChange={(period) => onNewExceptionChange({...newException, fromPeriod: period})}
                      className="text-xs"
                    />
                  </div>
                  
                  {/* To Time */}
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">إلى:</label>
                    <TimePicker
                      value={newException.toTime}
                      period={newException.toPeriod}
                      onChange={(time) => onNewExceptionChange({...newException, toTime: time})}
                      onPeriodChange={(period) => onNewExceptionChange({...newException, toPeriod: period})}
                      className="text-xs"
                    />
                  </div>
                </div>
              )}
              
              {/* Add Button */}
              <button
                onClick={onAddException}
                disabled={!newException.date || loading.exceptions}
                className="w-full px-3 py-1.5 bg-purple-600 text-white text-xs font-medium rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 transition-all duration-200"
              >
                <FaPlus className="w-3 h-3" />
                إضافة موعد
              </button>
            </div>
          )}
          
          {/* Existing Exceptions List */}
          {exceptionalDates && exceptionalDates.length > 0 ? (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {exceptionalDates.map((exception, index) => (
                <div 
                  key={exception.id || index}
                  className="bg-white rounded-lg p-3 border border-purple-200 flex items-center justify-between hover:shadow-md transition-all duration-200"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <FaClock className="w-3 h-3 text-purple-600" />
                      <span className="text-xs font-semibold text-slate-800">
                        {new Date(exception.date).toLocaleDateString('ar-EG', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </span>
                    </div>
                    {exception.isClosed ? (
                      <p className="text-xs text-red-600 font-medium">إجازة - مغلق</p>
                    ) : (
                      <p className="text-xs text-slate-600">
                        {exception.fromTime} {exception.fromPeriod === 'AM' ? 'ص' : 'م'} - {exception.toTime} {exception.toPeriod === 'AM' ? 'ص' : 'م'}
                      </p>
                    )}
                  </div>
                  
                  {isEditing && onRemoveException && (
                    <button
                      onClick={() => onRemoveException(exception.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded transition-all duration-200"
                      title="حذف"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <FaCalendarPlus className="w-8 h-8 text-purple-300 mx-auto mb-2" />
              <p className="text-xs text-slate-500">لا توجد مواعيد استثنائية</p>
            </div>
          )}
        </div>
      </div>

      {/* Calendar View */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200">
        <h4 className="text-lg font-semibold text-slate-800 mb-4">عرض الجدول الأسبوعي</h4>
        <div className="h-96" dir="ltr">
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: '100%' }}
            defaultView="week"
            views={['week']}
            eventPropGetter={eventStyleGetter}
            components={{
              dateCellWrapper: DayCell
            }}
            messages={{
              week: 'أسبوع',
              day: 'يوم',
              today: 'اليوم',
              previous: 'السابق',
              next: 'التالي',
              showMore: (total) => `+${total} المزيد`
            }}
            formats={{
              dayHeaderFormat: (date) => moment(date).format('dddd'),
              dayRangeHeaderFormat: ({ start, end }) => 
                `${moment(start).format('D MMM')} - ${moment(end).format('D MMM YYYY')}`
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default WeeklyScheduleCalendar;
