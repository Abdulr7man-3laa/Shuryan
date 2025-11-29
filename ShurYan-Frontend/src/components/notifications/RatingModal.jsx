import React, { useState, useEffect } from 'react';
import { FaStar, FaTimes, FaCheck, FaClock, FaComments, FaBroom, FaDollarSign, FaSmile, FaUser, FaUserSecret } from 'react-icons/fa';
import patientService from '@/api/services/patient.service';

const RatingModal = ({ isOpen, onClose, appointmentId, doctorName, onSubmitSuccess }) => {
  const [ratings, setRatings] = useState({
    overallSatisfaction: 0,
    waitingTime: 0,
    communicationQuality: 0,
    clinicCleanliness: 0,
    valueForMoney: 0,
  });
  const [hoveredRating, setHoveredRating] = useState({});
  const [comment, setComment] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setRatings({
        overallSatisfaction: 0,
        waitingTime: 0,
        communicationQuality: 0,
        clinicCleanliness: 0,
        valueForMoney: 0,
      });
      setComment('');
      setIsAnonymous(false);
      setError(null);
    }
  }, [isOpen]);

  // Rating criteria configuration
  const ratingCriteria = [
    {
      key: 'overallSatisfaction',
      label: 'الرضا العام',
      icon: FaSmile,
      color: 'text-amber-500',
      bgColor: 'bg-amber-50',
    },
    {
      key: 'waitingTime',
      label: 'وقت الانتظار',
      icon: FaClock,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
    },
    {
      key: 'communicationQuality',
      label: 'جودة التواصل',
      icon: FaComments,
      color: 'text-teal-500',
      bgColor: 'bg-teal-50',
    },
    {
      key: 'clinicCleanliness',
      label: 'نظافة العيادة',
      icon: FaBroom,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-50',
    },
    {
      key: 'valueForMoney',
      label: 'القيمة مقابل المال',
      icon: FaDollarSign,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50',
    },
  ];

  const handleStarClick = (criterion, value) => {
    setRatings(prev => ({ ...prev, [criterion]: value }));
  };

  const handleStarHover = (criterion, value) => {
    setHoveredRating(prev => ({ ...prev, [criterion]: value }));
  };

  const handleStarLeave = (criterion) => {
    setHoveredRating(prev => ({ ...prev, [criterion]: 0 }));
  };

  const isFormValid = () => {
    // All ratings must be at least 1
    return Object.values(ratings).every(rating => rating >= 1);
  };

  const handleSubmit = async () => {
    if (!isFormValid()) {
      setError('يرجى تقييم جميع المعايير');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Call API to submit rating
      const payload = {
        appointmentId,
        overallSatisfaction: ratings.overallSatisfaction,
        waitingTime: ratings.waitingTime,
        communicationQuality: ratings.communicationQuality,
        clinicCleanliness: ratings.clinicCleanliness,
        valueForMoney: ratings.valueForMoney,
        comment: comment.trim() || null,
        isAnonymous,
      };

      console.log('📝 Submitting rating:', payload);

      // Call the API service
      const response = await patientService.submitDoctorRating(payload);

      console.log('✅ Rating submitted successfully:', response);

      // Call success callback
      if (onSubmitSuccess) {
        onSubmitSuccess();
      }

      // Close modal
      onClose();
    } catch (err) {
      console.error('❌ Error submitting rating:', err);
      setError(err.response?.data?.message || 'حدث خطأ أثناء إرسال التقييم. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-500 to-emerald-500 p-6 rounded-t-2xl relative">
          <button
            onClick={onClose}
            className="absolute top-4 left-4 text-white/80 hover:text-white transition-colors"
          >
            <FaTimes className="w-5 h-5" />
          </button>
          <div className="text-center text-white">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 backdrop-blur-sm">
              <FaStar className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black mb-1">تقييم الجلسة</h2>
            <p className="text-white/90">د. {doctorName}</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Rating Criteria */}
          <div className="space-y-4">
            {ratingCriteria.map((criterion) => {
              const Icon = criterion.icon;
              const currentRating = ratings[criterion.key];
              const hovered = hoveredRating[criterion.key] || 0;

              return (
                <div
                  key={criterion.key}
                  className={`${criterion.bgColor} border-2 border-slate-200 rounded-xl p-4 transition-all hover:shadow-md`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 ${criterion.bgColor} rounded-lg flex items-center justify-center`}>
                        <Icon className={`w-5 h-5 ${criterion.color}`} />
                      </div>
                      <span className="text-slate-800 font-bold">{criterion.label}</span>
                    </div>
                    {currentRating > 0 && (
                      <span className={`text-sm font-semibold ${criterion.color}`}>
                        {currentRating} من 5
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => {
                      const isActive = star <= (hovered || currentRating);
                      return (
                        <button
                          key={star}
                          type="button"
                          onClick={() => handleStarClick(criterion.key, star)}
                          onMouseEnter={() => handleStarHover(criterion.key, star)}
                          onMouseLeave={() => handleStarLeave(criterion.key)}
                          className="transition-transform hover:scale-125 focus:outline-none"
                        >
                          <FaStar
                            className={`w-8 h-8 transition-colors ${
                              isActive ? 'text-amber-400' : 'text-slate-300'
                            }`}
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Comment */}
          <div className="space-y-2">
            <label className="block text-slate-800 font-bold">
              تعليق (اختياري)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              maxLength={500}
              rows={4}
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all resize-none"
              placeholder="شاركنا تجربتك مع الطبيب..."
            />
            <div className="text-left text-xs text-slate-500">
              {comment.length} / 500
            </div>
          </div>

          {/* Anonymous Option */}
          <div className="flex items-center gap-3 p-4 bg-slate-50 border-2 border-slate-200 rounded-xl">
            <input
              type="checkbox"
              id="anonymous"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              className="w-5 h-5 text-teal-500 border-slate-300 rounded focus:ring-2 focus:ring-teal-500/20"
            />
            <label htmlFor="anonymous" className="flex items-center gap-2 text-slate-700 cursor-pointer">
              {isAnonymous ? (
                <FaUserSecret className="w-5 h-5 text-slate-600" />
              ) : (
                <FaUser className="w-5 h-5 text-slate-600" />
              )}
              <span className="font-semibold">نشر التقييم بشكل مجهول</span>
            </label>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 bg-slate-100 text-slate-700 px-6 py-3 rounded-xl font-bold hover:bg-slate-200 transition-all duration-200"
              disabled={isSubmitting}
            >
              إلغاء
            </button>
            <button
              onClick={handleSubmit}
              disabled={!isFormValid() || isSubmitting}
              className={`flex-1 bg-gradient-to-r from-teal-500 to-emerald-500 text-white px-6 py-3 rounded-xl font-bold transition-all duration-200 flex items-center justify-center gap-2 ${
                !isFormValid() || isSubmitting
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:shadow-lg hover:scale-105'
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  جاري الإرسال...
                </>
              ) : (
                <>
                  <FaCheck className="w-4 h-4" />
                  إرسال التقييم
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RatingModal;
