import React from 'react';
import { 
  FaClock, FaPlay, FaPhone, FaCalendarCheck, 
  FaStethoscope, FaMapMarkerAlt, FaCheckCircle, FaSpinner, FaDoorOpen,
  FaCalendarPlus, FaBan
} from 'react-icons/fa';
import { formatDate } from '@/utils/helpers';

/**
 * AppointmentCard Component - Ultra Modern Design
 * Creative, elegant card for displaying appointment information
 */
const AppointmentCard = ({ appointment, onStartAppointment, loading = false }) => {
  // Get patient initials
  const getInitials = () => {
    if (!appointment.patientName) return '؟';
    const names = appointment.patientName.split(' ');
    if (names.length >= 2) {
      return names[0].charAt(0) + names[names.length - 1].charAt(0);
    }
    return names[0].charAt(0);
  };

  // Get status styling
  const getStatusStyle = () => {
    // إذا كانت الجلسة منتهية - Teal/Emerald
    if (appointment.apiStatus === 4) {
      return {
        bg: appointment.status === 'كشف عام' 
          ? 'bg-gradient-to-r from-teal-500 to-teal-600'
          : 'bg-gradient-to-r from-emerald-500 to-emerald-600',
        text: 'text-white',
        icon: appointment.status === 'كشف عام' ? FaStethoscope : FaCalendarCheck,
      };
    }
    
    // إذا كانت الجلسة جارية - Amber/Orange
    if (appointment.apiStatus === 3) {
      return {
        bg: 'bg-gradient-to-r from-amber-500 to-orange-500',
        text: 'text-white',
        icon: appointment.status === 'كشف عام' ? FaStethoscope : FaCalendarCheck,
      };
    }
    
    // الحالة العادية (لم تبدأ) - Slate
    return {
      bg: 'bg-gradient-to-r from-slate-400 to-slate-500',
      text: 'text-white',
      icon: appointment.status === 'كشف عام' ? FaStethoscope : FaCalendarCheck,
    };
  };

  const statusStyle = getStatusStyle();
  const StatusIcon = statusStyle.icon;

  return (
    <article className={`group relative rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border overflow-hidden ${
      appointment.isCancelled 
        ? 'bg-red-50 border-red-300' 
        : appointment.apiStatus === 4  // Completed
        ? 'bg-gradient-to-br from-teal-50 to-emerald-50/50 border-teal-300/60'
        : appointment.apiStatus === 3  // InProgress
        ? 'bg-gradient-to-br from-teal-50 to-teal-50/50 border-amber-300/60'
        : 'bg-gradient-to-br from-slate-50 to-slate-100/50 border-slate-300/60'
    }`}>
      {/* Subtle gradient background */}
      <div className={`absolute inset-0 ${
        appointment.isCancelled
          ? 'bg-gradient-to-br from-red-50/50 to-red-100/30'
          : appointment.apiStatus === 4  // Completed
          ? 'bg-gradient-to-br from-teal-100/30 to-emerald-50/20'
          : appointment.apiStatus === 3  // InProgress
          ? 'bg-gradient-to-br from-amber-100/30 to-orange-50/20'
          : 'bg-gradient-to-br from-slate-100/30 to-slate-50/20'
      }`}></div>
      
      {/* Left accent bar */}
      <div className={`absolute right-0 top-0 bottom-0 w-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
        appointment.isCancelled
          ? 'bg-gradient-to-b from-red-500 to-red-600'
          : appointment.apiStatus === 4  // Completed
          ? 'bg-gradient-to-b from-teal-500 to-emerald-600'
          : appointment.apiStatus === 3  // InProgress
          ? 'bg-gradient-to-b from-amber-500 to-orange-500'
          : 'bg-gradient-to-b from-slate-400 to-slate-500'
      }`}></div>
      

      <div className="relative p-5">
        {/* Header - Time & Status */}
        <div className="flex items-center justify-between mb-4">
          {/* Time Badge - Premium */}
          <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${
            appointment.isCancelled
              ? 'bg-gradient-to-r from-red-50 to-red-100 border-red-200/50'
              : appointment.apiStatus === 4  // Completed
              ? 'bg-gradient-to-r from-teal-50 to-emerald-50 border-teal-200/50'
              : appointment.apiStatus === 3  // InProgress
              ? 'bg-gradient-to-r from-slate-100 to-slate-50 border-amber-300/50'
              : 'bg-gradient-to-r from-slate-100 to-slate-50 border-slate-300/50'
          }`}>
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
              <FaClock className={`text-sm ${
                appointment.isCancelled 
                  ? 'text-red-600' 
                  : appointment.apiStatus === 4 
                  ? 'text-teal-600'
                  : appointment.apiStatus === 3
                  ? 'text-amber-600'
                  : 'text-slate-500'
              }`} />
            </div>
            <div className="flex flex-col">
              <span className={`text-xs font-medium leading-none mb-0.5 'text-slate-500'`}>الموعد</span>
              <span className={`text-base font-bold leading-none 'text-slate-900'`}>{appointment.time}</span>
            </div>
          </div>

          {/* Status Badge */}
          {appointment.isCancelled ? (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-red-500 to-red-600 shadow-sm">
              <FaBan className="text-white text-xs" />
              <span className="text-xs font-bold text-white">ملغي</span>
            </div>
          ) : (
            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${statusStyle.bg} shadow-sm`}>
              <StatusIcon className="text-white text-xs" />
              <span className={`text-xs font-bold ${statusStyle.text}`}>{appointment.status}</span>
            </div>
          )}
        </div>

        {/* Patient Info */}
        <div className="flex items-start gap-3 mb-4">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-white text-lg font-bold ring-1 transition-all duration-300 ${
              appointment.isCancelled
                ? 'bg-gradient-to-br from-red-500 to-red-600 ring-red-200 group-hover:ring-red-400'
                : appointment.apiStatus === 4  // Completed
                ? appointment.status === 'كشف عام'
                  ? 'bg-gradient-to-r from-teal-500 to-teal-600 ring-teal-300 group-hover:ring-teal-400'
                  : 'bg-gradient-to-r from-emerald-500 to-emerald-600 ring-emerald-300 group-hover:ring-emerald-400'
                : appointment.apiStatus === 3  // InProgress
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 ring-amber-300 group-hover:ring-amber-400'
                : 'bg-gradient-to-br from-slate-400 to-slate-500 ring-slate-300 group-hover:ring-slate-400'
            }`}>
              {getInitials()}
            </div>
            {/* Status indicator */}
            {!appointment.isCancelled && (
              <div className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-white ${
                appointment.apiStatus === 4 
                  ? 'bg-emerald-500' 
                  : appointment.apiStatus === 3
                  ? 'bg-orange-500 animate-pulse'
                  : 'bg-slate-400'
              }`}>
                <FaCheckCircle className="text-white text-[8px] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
              </div>
            )}
          </div>

          {/* Patient Details */}
          <div className="flex-1 min-w-0">
            <h3 className={`text-base font-bold truncate mb-1 transition-colors 'text-slate-900 group-hover:text-teal-600'`}>
              {appointment.patientName}
            </h3>
            
            {/* Phone */}
            {appointment.phoneNumber && (
              <div className="flex items-center gap-1.5 mb-2">
                <FaPhone className={`text-[9px] 'text-slate-400'`} />
                <span className={`text-xs font-medium direction-ltr 'text-slate-600'`}>{appointment.phoneNumber}</span>
              </div>
            )}

            {/* Duration & Appointment Date */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Appointment Date */}
              {appointment.appointmentDate && (
                <div className="flex items-center gap-1 px-2 py-1 rounded border bg-slate-50 border-slate-200">
                  <FaCalendarPlus className="text-[9px] text-slate-500" />
                  <span className="text-[11px] font-semibold text-slate-700">{formatDate(appointment.appointmentDate, 'DD/MM/YYYY')}</span>
                </div>
              )}

              <div className={`flex items-center gap-1 px-2 py-1 rounded border ${
                appointment.isCancelled
                  ? 'bg-red-50 border-red-200'
                  : 'bg-slate-50 border-slate-200'
              }`}>
                <FaClock className={`text-[9px] ${
                  appointment.isCancelled ? 'text-red-500' : 'text-slate-500'
                }`} />
                <span className={`text-[11px] font-semibold 'text-slate-700'`}>{appointment.duration} دقيقة</span>
              </div>
              

              
              {/* Session Number if available */}
              {appointment.sessionNumber && (
                <div className="flex items-center gap-1 bg-teal-50 px-2 py-1 rounded border border-teal-200">
                  <span className="text-[11px] font-semibold text-teal-700">جلسة #{appointment.sessionNumber}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Button - Full Width */}
        <button
          onClick={() => onStartAppointment?.(appointment)}
          disabled={loading || appointment.isCancelled}
          className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-all duration-200 font-bold text-sm shadow-sm hover:shadow-md group/btn ${
            loading
              ? 'bg-slate-400 cursor-not-allowed'
              : appointment.isCancelled
              ? 'bg-red-400 cursor-not-allowed opacity-60'
              : appointment.apiStatus === 4  // Completed
              ? appointment.status === 'كشف عام'
                ? 'bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700'
                : 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700'
              : appointment.apiStatus === 3  // InProgress
              ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600'
              : 'bg-gradient-to-r from-slate-500 to-slate-600 hover:from-slate-600 hover:to-slate-700'
          } text-white`}
        >
          <div className="w-7 h-7 bg-white/20 rounded-md flex items-center justify-center">
            {loading ? (
              <FaSpinner className="text-white text-xs animate-spin" />
            ) : (
              <FaDoorOpen className="text-white text-xs" />
            )}
          </div>
          <span>
            {loading 
              ? 'جاري التحميل...' 
              : appointment.isCancelled 
              ? 'موعد ملغي'
              : appointment.apiStatus === 4  // Completed
              ? 'الدخول للجلسة'
              : appointment.apiStatus === 3  // InProgress
              ? 'متابعة الجلسة'
              : 'بدء الجلسة'  // Confirmed or other statuses
            }
          </span>
          {!loading && (
            <div className="mr-auto opacity-0 group-hover/btn:opacity-100 transition-opacity">
              <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
            </div>
          )}
        </button>
      </div>
    </article>
  );
};

export default AppointmentCard;
