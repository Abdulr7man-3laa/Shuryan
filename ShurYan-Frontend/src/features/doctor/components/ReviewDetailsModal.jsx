import React from 'react';
import { 
  FaTimes, FaStar, FaUser, FaClock, FaHeart, FaComments, 
  FaBroom, FaDollarSign, FaCheckCircle, FaCalendar
} from 'react-icons/fa';

/**
 * ReviewDetailsModal - Premium Modal for Review Details
 * Shows complete review information with all rating categories
 */
const ReviewDetailsModal = ({ review, isOpen, onClose }) => {
  if (!isOpen || !review) return null;

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-EG', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Render star rating
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FaStar 
          key={i} 
          className={`${i <= rating ? 'text-amber-400' : 'text-slate-300'} text-lg`} 
        />
      );
    }
    return stars;
  };

  // Rating categories
  const ratingCategories = [
    { 
      key: 'overallSatisfaction', 
      label: 'الرضا العام', 
      icon: FaHeart, 
      color: 'text-rose-500',
      bgColor: 'bg-rose-50'
    },
    { 
      key: 'waitingTime', 
      label: 'وقت الانتظار', 
      icon: FaClock, 
      color: 'text-blue-500',
      bgColor: 'bg-blue-50'
    },
    { 
      key: 'communicationQuality', 
      label: 'جودة التواصل', 
      icon: FaComments, 
      color: 'text-teal-500',
      bgColor: 'bg-teal-50'
    },
    { 
      key: 'clinicCleanliness', 
      label: 'نظافة العيادة', 
      icon: FaBroom, 
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-50'
    },
    { 
      key: 'valueForMoney', 
      label: 'القيمة مقابل المال', 
      icon: FaDollarSign, 
      color: 'text-amber-500',
      bgColor: 'bg-amber-50'
    }
  ];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
      dir="rtl"
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-500 to-emerald-500 p-6 relative">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              {/* Patient Avatar */}
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border-2 border-white/30">
                {review.patientProfileImage ? (
                  <img 
                    src={review.patientProfileImage} 
                    alt={review.patientName}
                    className="w-full h-full rounded-xl object-cover"
                  />
                ) : (
                  <FaUser className="text-white text-2xl" />
                )}
              </div>

              {/* Patient Info */}
              <div>
                <h2 className="text-2xl font-black text-white mb-1">
                  {review.patientName || 'مريض'}
                </h2>
                <div className="flex items-center gap-2 text-white/90 text-sm">
                  <FaCalendar className="text-xs" />
                  <span>{formatDate(review.createdAt)}</span>
                </div>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl flex items-center justify-center transition-colors border border-white/30"
            >
              <FaTimes className="text-white text-lg" />
            </button>
          </div>

          {/* Average Rating */}
          <div className="mt-4 bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30">
            <div className="flex items-center justify-between">
              <span className="text-white/90 font-semibold">التقييم الإجمالي</span>
              <div className="flex items-center gap-3">
                <div className="flex gap-1">
                  {renderStars(review.averageRating || 0)}
                </div>
                <span className="text-2xl font-black text-white">
                  {(review.averageRating || 0).toFixed(1)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-280px)]">
          {/* Rating Categories */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <FaStar className="text-teal-500" />
              تفاصيل التقييم
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ratingCategories.map(({ key, label, icon: Icon, color, bgColor }) => (
                <div 
                  key={key}
                  className={`${bgColor} rounded-xl p-4 border border-slate-200`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Icon className={`${color} text-lg`} />
                      <span className="font-semibold text-slate-700">{label}</span>
                    </div>
                    <span className="text-lg font-bold text-slate-800">
                      {review[key] || 0}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    {renderStars(review[key] || 0)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Comment */}
          {review.comment && (
            <div className="mb-6">
              <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
                <FaComments className="text-teal-500" />
                التعليق
              </h3>
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {review.comment}
                </p>
              </div>
            </div>
          )}

          {/* Doctor Reply */}
          {review.hasDoctorReply && review.doctorReply && (
            <div className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-xl p-5 border-2 border-teal-200">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center">
                  <FaCheckCircle className="text-white text-sm" />
                </div>
                <div>
                  <h4 className="font-bold text-teal-800">رد الطبيب</h4>
                  {review.doctorRepliedAt && (
                    <p className="text-xs text-teal-600">
                      {formatDate(review.doctorRepliedAt)}
                    </p>
                  )}
                </div>
              </div>
              <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                {review.doctorReply}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 p-4 bg-slate-50">
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white font-bold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewDetailsModal;
