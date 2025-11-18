import React, { useState } from 'react';
import { 
  FaTimes, FaStar, FaHeart, FaClock, FaComments, 
  FaBroom, FaDollarSign, FaUser, FaEye, FaReply 
} from 'react-icons/fa';

/**
 * RatingDetailsModal - عرض تفاصيل التقييمات المتعددة
 * يعرض الـ 5 فئات تقييم بشكل مفصل وجميل + رد الدكتور
 */
const RatingDetailsModal = ({ review, isOpen, onClose, onReply, isLoadingReply }) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState('');

  if (!isOpen || !review) return null;

  // Rating categories with icons and colors
  const ratingCategories = [
    {
      key: 'overallSatisfaction',
      label: 'الرضا العام',
      icon: FaHeart,
      color: 'text-red-500',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200'
    },
    {
      key: 'waitingTime',
      label: 'وقت الانتظار',
      icon: FaClock,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      key: 'communicationQuality',
      label: 'جودة التواصل',
      icon: FaComments,
      color: 'text-green-500',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      key: 'clinicCleanliness',
      label: 'نظافة العيادة',
      icon: FaBroom,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    },
    {
      key: 'valueForMoney',
      label: 'القيمة مقابل المال',
      icon: FaDollarSign,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200'
    }
  ];

  // Render stars for rating
  const renderStars = (rating, color = 'text-amber-400') => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<FaStar key={i} className={`${color} text-lg`} />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<FaStar key={i} className={`${color} text-lg opacity-50`} />);
      } else {
        stars.push(<FaStar key={i} className="text-slate-300 text-lg" />);
      }
    }
    return stars;
  };

  // Get patient name
  const patientName = review.isAnonymous 
    ? 'مريض مجهول' 
    : review.patient?.fullName || 'غير محدد';

  // Calculate average rating
  const averageRating = review.averageRating || (
    (review.overallSatisfaction + review.waitingTime + review.communicationQuality + 
     review.clinicCleanliness + review.valueForMoney) / 5
  );

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Handle reply submission
  const handleReplySubmit = async () => {
    if (!replyText.trim() || !onReply) return;
    
    const success = await onReply(review.id, replyText.trim());
    if (success) {
      setShowReplyForm(false);
      setReplyText('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-500 to-emerald-500 p-6 rounded-t-2xl text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 left-4 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
          >
            <FaTimes className="text-white text-sm" />
          </button>
          
          <div className="flex items-center gap-4 ml-12">
            {/* Patient Avatar */}
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              {review.isAnonymous ? (
                <FaEye className="text-white text-xl" />
              ) : (
                <FaUser className="text-white text-xl" />
              )}
            </div>
            
            <div>
              <h2 className="text-xl font-black">{patientName}</h2>
              <p className="text-white/80 text-sm">
                {formatDate(review.createdAt)}
              </p>
              
              {/* Overall Rating */}
              <div className="flex items-center gap-2 mt-2">
                <div className="flex gap-1">
                  {renderStars(averageRating, 'text-white')}
                </div>
                <span className="text-white font-bold text-lg">
                  {averageRating.toFixed(1)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          
          {/* Rating Categories Grid */}
          <div className="mb-6">
            <h3 className="text-lg font-black text-slate-800 mb-4">تفاصيل التقييم</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ratingCategories.map((category) => {
                const rating = review[category.key] || 0;
                const IconComponent = category.icon;
                
                return (
                  <div
                    key={category.key}
                    className={`${category.bgColor} ${category.borderColor} border-2 rounded-xl p-4 transition-all duration-200 hover:shadow-md`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-10 h-10 ${category.bgColor} rounded-lg flex items-center justify-center border ${category.borderColor}`}>
                        <IconComponent className={`${category.color} text-lg`} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-slate-800 text-sm">
                          {category.label}
                        </h4>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-black text-slate-800">
                          {rating.toFixed(1)}
                        </div>
                      </div>
                    </div>
                    
                    {/* Stars */}
                    <div className="flex items-center justify-center gap-1">
                      {renderStars(rating)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Comment Section */}
          {review.comment && (
            <div className="mb-6">
              <h3 className="text-lg font-black text-slate-800 mb-3">التعليق</h3>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <p className="text-slate-700 leading-relaxed">
                  {review.comment}
                </p>
                {review.isEdited && (
                  <p className="text-xs text-slate-500 mt-2 italic">
                    تم التعديل
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Doctor Reply */}
          {review.doctorReply && (
            <div className="mb-6">
              <h3 className="text-lg font-black text-slate-800 mb-3">رد الطبيب</h3>
              <div className="bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FaUser className="text-white text-xs" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-bold text-teal-700">رد الطبيب</span>
                      {review.doctorRepliedAt && (
                        <span className="text-xs text-teal-600">
                          {formatDate(review.doctorRepliedAt)}
                        </span>
                      )}
                    </div>
                    <p className="text-slate-700 leading-relaxed">
                      {review.doctorReply}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Reply Form */}
          {showReplyForm && (
            <div className="mb-6">
              <h3 className="text-lg font-black text-slate-800 mb-3">رد على التقييم</h3>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="اكتب ردك على التقييم... (حد أقصى 300 حرف)"
                  className="w-full h-20 p-3 border border-slate-300 rounded-lg resize-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm"
                  maxLength={300}
                  disabled={isLoadingReply}
                />
                <div className="flex items-center justify-between mt-3">
                  <span className="text-xs text-slate-500">
                    {replyText.length}/300 حرف
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setShowReplyForm(false);
                        setReplyText('');
                      }}
                      className="px-4 py-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors text-sm font-medium"
                      disabled={isLoadingReply}
                    >
                      إلغاء
                    </button>
                    <button
                      onClick={handleReplySubmit}
                      disabled={!replyText.trim() || isLoadingReply}
                      className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors text-sm font-medium flex items-center gap-2"
                    >
                      {isLoadingReply ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          جاري الإرسال...
                        </>
                      ) : (
                        <>
                          <FaReply className="text-xs" />
                          إرسال الرد
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Reply Button */}
          {!review.doctorReply && !showReplyForm && onReply && (
            <div className="mb-6">
              <button
                onClick={() => setShowReplyForm(true)}
                className="flex items-center gap-2 px-4 py-2 text-teal-600 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition-all text-sm font-medium"
              >
                <FaReply className="text-xs" />
                رد على التقييم
              </button>
            </div>
          )}

          {/* Close Button */}
          <div className="flex justify-center pt-4">
            <button
              onClick={onClose}
              className="px-8 py-3 bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-bold rounded-xl hover:from-teal-600 hover:to-emerald-600 transition-all duration-200 hover:scale-105 shadow-lg"
            >
              إغلاق
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RatingDetailsModal;
