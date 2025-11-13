import React from 'react';
import PropTypes from 'prop-types';

/**
 * ServiceCard Component - Reusable service card
 * 
 * Features:
 * - Display service info (price, duration)
 * - Edit mode support
 * - Custom icon and gradient colors
 * - Validation feedback
 * 
 * @param {Object} props - Component props
 * @param {string} props.title - Service title
 * @param {string} props.description - Service description
 * @param {Object} props.icon - Icon component
 * @param {string} props.gradientFrom - Gradient start color
 * @param {string} props.gradientTo - Gradient end color
 * @param {string} props.iconBg - Icon background color
 * @param {string} props.iconColor - Icon color
 * @param {number} props.price - Service price
 * @param {number} props.duration - Service duration (read-only, shared)
 * @param {Function} props.onPriceChange - Price change handler
 * @param {Function} props.onDurationChange - Duration change handler (not used if hideDuration=true)
 * @param {boolean} props.isEditing - Edit mode flag
 * @param {boolean} props.loading - Loading state
 * @param {boolean} props.hideDuration - Hide duration input (duration is shared)
 */
const ServiceCard = ({
  title,
  description,
  icon: Icon,
  gradientFrom,
  gradientTo,
  iconBg,
  iconColor,
  price,
  duration,
  onPriceChange,
  onDurationChange,
  isEditing,
  loading,
  hideDuration,
}) => {
  return (
    <div className={`bg-gradient-to-r ${gradientFrom} ${gradientTo} rounded-2xl p-6 transition-all duration-300 ${
      isEditing ? 'ring-2 ring-offset-2 ring-blue-400' : ''
    }`}>
      {/* Header */}
      <div className="flex items-start gap-4 mb-6">
        <div className={`w-14 h-14 ${iconBg} rounded-xl flex items-center justify-center flex-shrink-0`}>
          <Icon className={`w-7 h-7 ${iconColor}`} />
        </div>
        <div className="flex-1">
          <h4 className="text-xl font-bold text-slate-800 mb-1">{title}</h4>
          <p className="text-sm text-slate-600">{description}</p>
        </div>
      </div>

      {/* Price Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          سعر الكشف <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            type="number"
            min="0"
            step="1"
            value={price || ''}
            onChange={(e) => onPriceChange(parseFloat(e.target.value) || null)}
            disabled={!isEditing || loading}
            placeholder="أدخل سعر الكشف"
            className={`w-full pl-4 pr-12 py-3 border rounded-lg transition-all duration-200 text-left ${
              isEditing 
                ? 'border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200' 
                : 'border-slate-200 bg-slate-50'
            } ${!price && isEditing ? 'border-red-300' : ''}`}
            dir="ltr"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium pointer-events-none">
            ج.م
          </span>
        </div>
        {!price && isEditing && (
          <p className="text-xs text-red-500 mt-1">يجب إدخال السعر</p>
        )}
      </div>

      {/* Duration Display (Read-only) */}
      {!hideDuration && (
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            مدة الجلسة المتوقعة <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="number"
              min="5"
              max="120"
              step="5"
              value={duration || ''}
              onChange={(e) => onDurationChange(parseFloat(e.target.value) || null)}
              disabled={!isEditing || loading}
              placeholder="أدخل مدة الجلسة"
              className={`w-full px-4 py-3 border rounded-lg transition-all duration-200 text-left ${
                isEditing 
                  ? 'border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200' 
                  : 'border-slate-200 bg-slate-50'
              } ${!duration && isEditing ? 'border-red-300' : ''}`}
              dir="ltr"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium pointer-events-none">
              دقيقة
            </span>
          </div>
          {!duration && isEditing && (
            <p className="text-xs text-red-500 mt-1">يجب إدخال مدة الجلسة</p>
          )}
          {duration && (duration < 5 || duration > 120) && isEditing && (
            <p className="text-xs text-orange-500 mt-1">المدة يجب أن تكون بين 5 و 120 دقيقة</p>
          )}
        </div>
      )}
      
      {/* Duration Display (Shared - Read-only) */}
      {hideDuration && duration && (
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-600">مدة الجلسة:</span>
            <span className="text-base font-bold text-slate-800">{duration} دقيقة</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">مدة موحدة لجميع أنواع الكشف</p>
        </div>
      )}


    </div>
  );
};

ServiceCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  icon: PropTypes.elementType.isRequired,
  gradientFrom: PropTypes.string.isRequired,
  gradientTo: PropTypes.string.isRequired,
  iconBg: PropTypes.string.isRequired,
  iconColor: PropTypes.string.isRequired,
  price: PropTypes.number,
  duration: PropTypes.number,
  onPriceChange: PropTypes.func.isRequired,
  onDurationChange: PropTypes.func,
  isEditing: PropTypes.bool,
  loading: PropTypes.bool,
  hideDuration: PropTypes.bool,
};

ServiceCard.defaultProps = {
  price: null,
  duration: null,
  isEditing: false,
  loading: false,
  hideDuration: false,
  onDurationChange: null,
};

export default ServiceCard;
