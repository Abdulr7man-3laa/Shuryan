import React from 'react';
import PropTypes from 'prop-types';
import { FaCalendarAlt, FaTrash } from 'react-icons/fa';

/**
 * ExceptionCard Component - Display exceptional date
 * 
 * Features:
 * - Display date in Arabic format
 * - Show time range or closed status
 * - Delete action
 * 
 * @param {Object} props - Component props
 */
const ExceptionCard = ({
  exception,
  isEditing,
  onRemove,
}) => {
  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('ar-EG', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="bg-white rounded-lg p-4 border border-slate-200 flex items-center justify-between transition-all duration-200 hover:shadow-md">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
          <FaCalendarAlt className="w-5 h-5 text-purple-600" />
        </div>
        <div>
          <div className="font-medium text-slate-800">
            {formatDate(exception.date)}
          </div>
          <div className="text-sm text-slate-600 mt-1">
            {exception.isClosed ? (
              <span className="inline-flex items-center px-2 py-1 rounded-md bg-red-100 text-red-700 font-medium text-xs">
                يوم إجازة
              </span>
            ) : (
              <span>
                من {exception.fromTime} {exception.fromPeriod === 'AM' ? 'ص' : 'م'} 
                {' '} إلى {' '}
                {exception.toTime} {exception.toPeriod === 'AM' ? 'ص' : 'م'}
              </span>
            )}
          </div>
        </div>
      </div>
      
      {isEditing && (
        <button
          onClick={onRemove}
          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 hover:shadow-sm"
          title="حذف"
        >
          <FaTrash className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

ExceptionCard.propTypes = {
  exception: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    date: PropTypes.string.isRequired,
    fromTime: PropTypes.string,
    toTime: PropTypes.string,
    fromPeriod: PropTypes.string,
    toPeriod: PropTypes.string,
    isClosed: PropTypes.bool,
  }).isRequired,
  isEditing: PropTypes.bool,
  onRemove: PropTypes.func.isRequired,
};

ExceptionCard.defaultProps = {
  isEditing: false,
};

export default ExceptionCard;
