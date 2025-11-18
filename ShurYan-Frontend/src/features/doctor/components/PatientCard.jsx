import React, { memo } from 'react';
import { 
  FaUser, FaPhone, FaCalendarAlt, FaStethoscope,
  FaFileMedical, FaPrescriptionBottleAlt, FaFlask,
  FaCheckCircle, FaChevronLeft, FaStar, FaMapMarkerAlt
} from 'react-icons/fa';
import { formatDate } from '@/utils/helpers';

/**
 * PatientCard Component - Elegant Refined Design
 * Clean, sophisticated patient information card with minimal color palette
 */
const PatientCard = ({ patient, onMedicalRecordClick, onPrescriptionClick, onLabResultsClick }) => {
  // Get patient initials for avatar
  const getInitials = () => {
    if (!patient.fullName) return '؟';
    const names = patient.fullName.split(' ');
    if (names.length >= 2) {
      return names[0].charAt(0) + names[names.length - 1].charAt(0);
    }
    return names[0].charAt(0);
  };

  // Format last visit date
  const formatLastVisit = (date) => {
    if (!date) return 'غير محدد';
    try {
      return formatDate(date);
    } catch {
      return date;
    }
  };

  return (
    <article className="group relative bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-slate-200/80 overflow-hidden">
      {/* Subtle background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50/20 to-white"></div>
      
      {/* Accent bar */}
      <div className="absolute right-0 top-0 bottom-0 w-1 bg-teal-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      <div className="relative p-5">
        {/* Header Section - Optimized */}
        <div className="mb-4">
          <div className="flex items-start gap-3 mb-3">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              {patient.profileImageUrl ? (
                <img
                  src={patient.profileImageUrl}
                  alt={patient.fullName}
                  className="w-14 h-14 rounded-lg object-cover ring-1 ring-slate-200 group-hover:ring-teal-400 transition-all duration-300"
                />
              ) : (
                <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg flex items-center justify-center text-white text-lg font-bold ring-1 ring-slate-200 group-hover:ring-teal-400 transition-all duration-300">
                  {getInitials()}
                </div>
              )}
              {/* Status indicator */}
              <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white"></div>
            </div>
            
            {/* Patient Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <h3 className="text-base font-bold text-slate-900 truncate group-hover:text-teal-600 transition-colors">
                  {patient.fullName || 'غير محدد'}
                </h3>
                
                {/* Rating */}
                {patient.rating && (
                  <div className="flex items-center gap-0.5 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 flex-shrink-0">
                    <FaStar className="text-amber-500 text-[9px]" />
                    <span className="text-[11px] font-bold text-amber-700">{patient.rating.toFixed(1)}</span>
                  </div>
                )}
              </div>
              
              {/* Address */}
              {patient.address && (
                <div className="flex items-center gap-1 mb-2">
                  <FaMapMarkerAlt className="text-slate-400 text-[9px] flex-shrink-0" />
                  <span className="text-[11px] text-slate-500 truncate">{patient.address}</span>
                </div>
              )}
              
              {/* Stats */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <div className="w-6 h-6 bg-teal-50 rounded-md flex items-center justify-center">
                    <FaStethoscope className="text-teal-600 text-[10px]" />
                  </div>
                  <div className="flex items-baseline gap-0.5">
                    <span className="text-sm font-bold text-slate-900">{patient.totalSessions || 0}</span>
                    <span className="text-[9px] font-medium text-slate-500">جلسة</span>
                  </div>
                </div>
                
                <div className="w-px h-3 bg-slate-200"></div>
                
                <div className="flex items-center gap-1.5">
                  <div className="w-6 h-6 bg-slate-50 rounded-md flex items-center justify-center">
                    <FaCalendarAlt className="text-slate-500 text-[10px]" />
                  </div>
                  <span className="text-[11px] font-medium text-slate-600">{formatLastVisit(patient.lastVisitDate)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Contact Info */}
        <div className="mb-4 pb-4 border-b border-slate-100">
          {patient.phoneNumber && (
            <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-lg border border-slate-200 hover:border-teal-300 hover:bg-teal-50/30 transition-all duration-200">
              <div className="w-7 h-7 bg-teal-500 rounded-md flex items-center justify-center flex-shrink-0">
                <FaPhone className="text-white text-[10px]" />
              </div>
              <span className="text-slate-800 font-semibold direction-ltr text-xs">{patient.phoneNumber}</span>
            </div>
          )}
        </div>
        
        {/* Action Buttons - 3 Buttons Grid */}
        <div className="grid grid-cols-3 gap-1.5">
          {/* Medical Record */}
          <button
            onClick={() => onMedicalRecordClick?.(patient)}
            className="flex flex-col items-center justify-center gap-1 px-2 py-2 bg-slate-50 hover:bg-teal-50 border border-slate-200 hover:border-teal-300 rounded-lg transition-all duration-200 group/btn"
          >
            <div className="w-7 h-7 bg-white group-hover/btn:bg-teal-500 rounded-md flex items-center justify-center transition-all duration-200">
              <FaFileMedical className="text-slate-600 group-hover/btn:text-white text-xs transition-colors" />
            </div>
            <span className="text-[9px] font-semibold text-slate-700 group-hover/btn:text-teal-700 transition-colors leading-tight">السجل الطبي</span>
          </button>
          
          {/* Prescriptions List */}
          <button
            onClick={() => onPrescriptionClick?.(patient)}
            className="flex flex-col items-center justify-center gap-1 px-2 py-2 bg-slate-50 hover:bg-teal-50 border border-slate-200 hover:border-teal-300 rounded-lg transition-all duration-200 group/btn"
          >
            <div className="w-7 h-7 bg-white group-hover/btn:bg-teal-500 rounded-md flex items-center justify-center transition-all duration-200">
              <FaPrescriptionBottleAlt className="text-slate-600 group-hover/btn:text-white text-xs transition-colors" />
            </div>
            <span className="text-[9px] font-semibold text-slate-700 group-hover/btn:text-teal-700 transition-colors leading-tight">الروشتات</span>
          </button>
          
          {/* Lab Tests List */}
          <button
            onClick={() => onLabResultsClick?.(patient)}
            className="flex flex-col items-center justify-center gap-1 px-2 py-2 bg-slate-50 hover:bg-teal-50 border border-slate-200 hover:border-teal-300 rounded-lg transition-all duration-200 group/btn"
          >
            <div className="w-7 h-7 bg-white group-hover/btn:bg-teal-500 rounded-md flex items-center justify-center transition-all duration-200">
              <FaFlask className="text-slate-600 group-hover/btn:text-white text-xs transition-colors" />
            </div>
            <span className="text-[9px] font-semibold text-slate-700 group-hover/btn:text-teal-700 transition-colors leading-tight">التحاليل</span>
          </button>
        </div>
      </div>
    </article>
  );
};

export default memo(PatientCard);
