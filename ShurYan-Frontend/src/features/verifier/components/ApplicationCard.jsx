import { FaEye, FaEnvelope, FaPhone, FaMapMarkerAlt, FaBriefcase, FaCalendarAlt } from 'react-icons/fa';
import {
  APPLICATION_TYPE,
  STATUS_LABELS,
  STATUS_COLORS,
  DOCUMENT_STATUS,
  DOCUMENT_STATUS_COLORS,
} from '../constants/verifierConstants';

/**
 * Application Card Component
 * 
 * Displays application summary in a card format
 */
const ApplicationCard = ({ application, onViewDetails }) => {
  console.log('🎴 [ApplicationCard] Rendering:', application);
  
  const statusColors = STATUS_COLORS[application.verificationStatus || application.status];

  // Count documents by status
  const documentCounts = {
    approved: application.documents?.filter((doc) => doc.status === DOCUMENT_STATUS.APPROVED).length || 0,
    rejected: application.documents?.filter((doc) => doc.status === DOCUMENT_STATUS.REJECTED).length || 0,
    pending: application.documents?.filter((doc) => doc.status === DOCUMENT_STATUS.PENDING).length || 0,
    clarification: application.documents?.filter((doc) => doc.status === DOCUMENT_STATUS.CLARIFICATION_NEEDED).length || 0,
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-lg hover:border-teal-300 hover:scale-[1.02] transition-all duration-200">
      {/* Header */}
      <div className="flex items-start gap-4 mb-4">
        {/* Avatar */}
        <div>
          <img
            src={application.profileImageUrl || 'https://i.pravatar.cc/150?img=1'}
            alt={application.fullName || application.applicantName}
            className="w-16 h-16 rounded-full object-cover border-2 border-teal-200 shadow-sm"
          />
        </div>

        {/* Info */}
        <div className="flex-1">
          <h3 className="text-lg font-black text-slate-800 mb-1">
            {application.fullName || application.applicantName}
          </h3>
          
          {/* Type-specific info */}
          {(application.type === APPLICATION_TYPE.DOCTOR || application.medicalSpecialtyName) && (
            <div className="flex items-center gap-2 text-sm text-slate-600 mb-2">
              <FaBriefcase className="text-teal-500" />
              <span className="font-semibold">{application.medicalSpecialtyName || application.specialty}</span>
              <span className="text-slate-400">•</span>
              <span>{application.yearsOfExperience} سنوات خبرة</span>
            </div>
          )}
          
          {(application.type === APPLICATION_TYPE.PHARMACY || application.type === APPLICATION_TYPE.LABORATORY) && (
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <FaBriefcase className="text-teal-500" />
                <span className="font-semibold">المالك: {application.ownerName}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <FaMapMarkerAlt className="text-teal-500" />
                <span>{application.address}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Location */}
      {(application.governorate || application.city) && (
        <div className="flex items-center gap-2 text-sm text-slate-600 mb-4">
          <FaMapMarkerAlt className="text-teal-500" />
          <span className="font-medium">
            {[application.governorate, application.city].filter(Boolean).join(' - ')}
          </span>
        </div>
      )}

      {/* Documents Count */}
      {application.documents && application.documents.length > 0 && (
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-4 bg-gradient-to-r from-slate-50 to-slate-100/50 rounded-lg p-3">
          <span className="font-semibold">المستندات:</span>
          <span className="text-teal-600 font-bold">{application.documents.length}</span>
          <span className="text-slate-400">مستند</span>
        </div>
      )}

      {/* Action Button */}
      <button
        onClick={() => onViewDetails(application)}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-bold rounded-xl hover:from-teal-600 hover:to-emerald-600 transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105"
      >
        <FaEye className="w-4 h-4" />
        <span>عرض التفاصيل</span>
      </button>
    </div>
  );
};

export default ApplicationCard;
