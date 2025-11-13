import React, { useState } from 'react';
import { 
  FaUserMd, 
  FaCalendarAlt, 
  FaClock, 
  FaMapMarkerAlt, 
  FaPhone,
  FaCheckCircle,
  FaTimesCircle,
  FaHourglassHalf,
  FaSpinner,
  FaBan,
  FaEye
} from 'react-icons/fa';
import AppointmentDetailsModal from './AppointmentDetailsModal';
import { formatDate } from '@/utils/helpers';
import { getSpecialtyById } from '@/utils/constants';

/**
 * Patient Appointment Card Component
 * Displays appointment details with status indicators
 * 
 * Status Enum:
 * 0 = Scheduled (مجدول)
 * 1 = Confirmed (مؤكد)
 * 2 = Cancelled (ملغي)
 * 3 = InProgress (جاري)
 * 4 = Completed (مكتمل)
 * 5 = NoShow (لم يحضر)
 * 6 = CancelledByPatient (ملغي من المريض)
 */
const PatientAppointmentCard = ({ appointment, onCancel, onReschedule }) => {
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  // Get status info
  const getStatusInfo = (status) => {
    const statusMap = {
      0: { label: 'مجدول', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: FaCalendarAlt },
      1: { label: 'مؤكد', color: 'bg-green-100 text-green-700 border-green-200', icon: FaCheckCircle },
      2: { label: 'ملغي', color: 'bg-red-100 text-red-700 border-red-200', icon: FaTimesCircle },
      3: { label: 'جاري', color: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: FaSpinner },
      4: { label: 'مكتمل', color: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: FaCheckCircle },
      5: { label: 'لم يحضر', color: 'bg-gray-100 text-gray-700 border-gray-200', icon: FaBan },
      6: { label: 'ملغي', color: 'bg-red-100 text-red-700 border-red-200', icon: FaTimesCircle },
    };
    return statusMap[status] || statusMap[0];
  };

  const statusInfo = getStatusInfo(appointment.status);
  const StatusIcon = statusInfo.icon;

  // Format ISO datetime to time (12-hour format)
  const formatTime = (isoDateTime) => {
    if (!isoDateTime) return '--:--';
    try {
      const date = new Date(isoDateTime);
      const hours = date.getHours();
      const minutes = date.getMinutes();
      
      const period = hours >= 12 ? 'م' : 'ص';
      const hours12 = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
      return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
    } catch (error) {
      return '--:--';
    }
  };

  // Check if appointment can be cancelled (only Scheduled or Confirmed)
  const canCancel = appointment.status === 0 || appointment.status === 1;

  // Check if appointment is in the past (Completed, Cancelled, NoShow, CancelledByPatient)
  const isPast = appointment.status === 4 || appointment.status === 2 || appointment.status === 5 || appointment.status === 6;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-all duration-300 overflow-hidden group">
      {/* Status Bar */}
      <div className={`h-1.5 ${statusInfo.color.split(' ')[0]}`} />

      <div className="p-6">
        {/* Header: Doctor Info + Status Badge */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3 flex-1">
            {/* Doctor Avatar */}
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#00d5be] to-emerald-500 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
              {(appointment.doctor?.profileImageUrl || appointment.doctorProfileImageUrl) ? (
                <img 
                  src={appointment.doctor?.profileImageUrl || appointment.doctorProfileImageUrl} 
                  alt={appointment.doctor?.fullName || appointment.doctorName}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <FaUserMd className="text-xl" />
              )}
            </div>

            {/* Doctor Details */}
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-slate-800 truncate">
                {appointment.doctor?.fullName || appointment.doctorName || 'طبيب غير محدد'}
              </h3>
              <p className="text-sm text-slate-500 truncate">
                {appointment.doctor?.medicalSpecialtyName || 
                 appointment.medicalSpecialtyName || 
                 (appointment.doctor?.medicalSpecialty && getSpecialtyById(appointment.doctor.medicalSpecialty)?.name) ||
                 'تخصص غير محدد'}
              </p>
            </div>
          </div>

          {/* Status Badge */}
          <div className={`px-3 py-1.5 rounded-full border ${statusInfo.color} flex items-center gap-1.5 text-xs font-semibold flex-shrink-0`}>
            <StatusIcon className="text-sm" />
            <span>{statusInfo.label}</span>
          </div>
        </div>

        {/* Appointment Details Grid */}
        <div className="space-y-3 mb-4">
          {/* Date & Time */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-slate-600">
              <FaCalendarAlt className="text-[#00d5be] flex-shrink-0" />
              <span className="text-sm font-medium">
                {appointment.scheduledStartTime ? formatDate(appointment.scheduledStartTime) : 'تاريخ غير محدد'}
              </span>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <FaClock className="text-[#00d5be] flex-shrink-0" />
              <span className="text-sm font-medium">
                {formatTime(appointment.scheduledStartTime)}
              </span>
            </div>
          </div>

          {/* Duration */}
          {appointment.sessionDurationMinutes && (
            <div className="flex items-center gap-2 text-slate-600">
              <FaClock className="text-[#00d5be] flex-shrink-0" />
              <span className="text-xs text-slate-500">
                مدة الجلسة: {appointment.sessionDurationMinutes} دقيقة
              </span>
            </div>
          )}

          {/* Consultation Type & Fee */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">نوع الكشف:</span>
              <span className="text-sm font-semibold text-slate-700">
                {appointment.consultationType === 1 ? 'كشف جديد' : 'كشف متابعة'}
              </span>
            </div>
            {appointment.consultationFee && (
              <div className="text-sm font-bold text-[#00d5be]">
                {appointment.consultationFee} جنيه
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        {canCancel && !isPast && (
          <div className="flex items-center gap-2 pt-4 border-t border-slate-100">
            {/* Reschedule Button */}
            <button
              onClick={() => onReschedule?.(appointment)}
              className="flex-1 px-4 py-2.5 bg-teal-50 text-teal-600 rounded-xl font-semibold text-sm hover:bg-teal-100 transition-all duration-300 border border-teal-200"
            >
              إعادة جدولة
            </button>

            {/* Cancel Button */}
            <button
              onClick={() => onCancel?.(appointment)}
              className="flex-1 px-4 py-2.5 bg-red-50 text-red-600 rounded-xl font-semibold text-sm hover:bg-red-100 transition-all duration-300 border border-red-200"
            >
              إلغاء
            </button>
          </div>
        )}

        {/* Cancellation Info (if cancelled) */}
        {(appointment.status === 2 || appointment.status === 6) && appointment.cancellationReason && (
          <div className="mt-3 px-3 py-2 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-xs text-red-700 font-medium">
              <span className="font-bold">سبب الإلغاء:</span> {appointment.cancellationReason}
            </p>
          </div>
        )}

        {/* Show Details Button for Completed Appointments */}
        {appointment.status === 4 && (
          <div className="mt-4 pt-4 border-t border-slate-100">
            <button
              onClick={() => setShowDetailsModal(true)}
              className="w-full px-4 py-3 bg-gradient-to-r from-[#00d5be] to-emerald-500 text-white rounded-xl font-semibold text-sm hover:shadow-md transition-all duration-300 flex items-center justify-center gap-2"
            >
              <FaEye />
              <span>عرض تفاصيل الجلسة</span>
            </button>
          </div>
        )}

        {/* Details Modal */}
        <AppointmentDetailsModal
          isOpen={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
          appointment={appointment}
        />
      </div>
    </div>
  );
};

export default PatientAppointmentCard;
