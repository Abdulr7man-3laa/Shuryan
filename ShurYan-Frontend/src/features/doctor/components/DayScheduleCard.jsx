import React from 'react';
import PropTypes from 'prop-types';
import { FaToggleOn, FaToggleOff } from 'react-icons/fa';

/**
 * DayScheduleCard Component - Reusable day schedule card
 * 
 * Features:
 * - Toggle day enabled/disabled
 * - Time range selection
 * - AM/PM period selection
 * - Custom color per day
 * 
 * @param {Object} props - Component props
 */
const DayScheduleCard = ({
  dayKey,
  dayName,
  dayColor,
  schedule,
  isEditing,
  onToggle,
  onTimeChange,
}) => {
  return (
    <div className="bg-white rounded-lg p-4 border border-slate-200 transition-all duration-200 hover:shadow-md">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 ${dayColor} rounded-lg flex items-center justify-center shadow-sm`}>
            <span className="text-white text-sm font-bold">
              {dayName.charAt(0)}
            </span>
          </div>
          <span className="font-medium text-slate-800">{dayName}</span>
        </div>
        
        <button
          onClick={onToggle}
          disabled={!isEditing}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all duration-200 ${
            schedule.enabled 
              ? 'bg-green-100 text-green-700 hover:bg-green-200' 
              : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
          } ${!isEditing ? 'cursor-not-allowed opacity-60' : 'shadow-sm hover:shadow'}`}
        >
          {schedule.enabled ? (
            <>
              <FaToggleOn className="w-4 h-4" />
              <span className="text-sm font-medium">مفعل</span>
            </>
          ) : (
            <>
              <FaToggleOff className="w-4 h-4" />
              <span className="text-sm font-medium">معطل</span>
            </>
          )}
        </button>
      </div>

      {schedule.enabled && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fadeIn">
          {/* From Time */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              من الساعة:
            </label>
            <div className="flex gap-2">
              <input
                type="time"
                value={schedule.fromTime || ''}
                onChange={(e) => onTimeChange('fromTime', e.target.value)}
                disabled={!isEditing}
                className={`flex-1 px-3 py-2 border rounded-lg transition-all duration-200 ${
                  isEditing 
                    ? 'border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200' 
                    : 'border-slate-200 bg-slate-50'
                }`}
                dir="ltr"
              />
              <select
                value={schedule.fromPeriod || 'AM'}
                onChange={(e) => onTimeChange('fromPeriod', e.target.value)}
                disabled={!isEditing}
                className={`px-3 py-2 border rounded-lg transition-all duration-200 ${
                  isEditing 
                    ? 'border-blue-300 focus:border-blue-500' 
                    : 'border-slate-200 bg-slate-50'
                }`}
              >
                <option value="AM">ص</option>
                <option value="PM">م</option>
              </select>
            </div>
          </div>

          {/* To Time */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              إلى الساعة:
            </label>
            <div className="flex gap-2">
              <input
                type="time"
                value={schedule.toTime || ''}
                onChange={(e) => onTimeChange('toTime', e.target.value)}
                disabled={!isEditing}
                className={`flex-1 px-3 py-2 border rounded-lg transition-all duration-200 ${
                  isEditing 
                    ? 'border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200' 
                    : 'border-slate-200 bg-slate-50'
                }`}
                dir="ltr"
              />
              <select
                value={schedule.toPeriod || 'PM'}
                onChange={(e) => onTimeChange('toPeriod', e.target.value)}
                disabled={!isEditing}
                className={`px-3 py-2 border rounded-lg transition-all duration-200 ${
                  isEditing 
                    ? 'border-blue-300 focus:border-blue-500' 
                    : 'border-slate-200 bg-slate-50'
                }`}
              >
                <option value="AM">ص</option>
                <option value="PM">م</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

DayScheduleCard.propTypes = {
  dayKey: PropTypes.string.isRequired,
  dayName: PropTypes.string.isRequired,
  dayColor: PropTypes.string.isRequired,
  schedule: PropTypes.shape({
    enabled: PropTypes.bool,
    fromTime: PropTypes.string,
    toTime: PropTypes.string,
    fromPeriod: PropTypes.string,
    toPeriod: PropTypes.string,
  }).isRequired,
  isEditing: PropTypes.bool,
  onToggle: PropTypes.func.isRequired,
  onTimeChange: PropTypes.func.isRequired,
};

DayScheduleCard.defaultProps = {
  isEditing: false,
};

export default DayScheduleCard;
