import React from 'react';
import { 
  FaStar, FaStarHalfAlt, FaRegStar, FaQuoteRight,
  FaEdit, FaEye, FaInfoCircle
} from 'react-icons/fa';

/**
 * ReviewCard Component - Premium Design
 * Elegant card for displaying patient reviews from API
 */
const ReviewCard = ({ review, onViewDetails }) => {

  // Get patient initials
  const getInitials = () => {
    if (!review.patientName) return '؟';
    const names = review.patientName.split(' ');
    if (names.length >= 2) {
      return names[0].charAt(0) + names[names.length - 1].charAt(0);
    }
    return names[0].charAt(0);
  };

  // Render star rating
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - Math.ceil(rating);

    // Full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <FaStar key={`full-${i}`} className="text-amber-400 text-xs" />
      );
    }

    // Half star
    if (hasHalfStar) {
      stars.push(
        <FaStarHalfAlt key="half" className="text-amber-400 text-xs" />
      );
    }

    // Empty stars
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <FaRegStar key={`empty-${i}`} className="text-amber-400 text-xs" />
      );
    }

    return stars;
  };



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

  // Get patient name and rating
  const patientName = review.patientName || 'مريض';
  const rating = review.rating || 0;

  return (
    <article className="group relative bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-slate-200/80 overflow-hidden">
      {/* Subtle background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50/20 to-white"></div>
      
      {/* Accent bar */}
      <div className="absolute right-0 top-0 bottom-0 w-1 bg-gradient-to-b from-teal-500 to-teal-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      <div className="relative p-6">
        {/* Header - Patient Info & Overall Rating */}
        <div className="flex items-start justify-between mb-4">
          {/* Patient Info */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              {review.patientProfileImage ? (
                <img
                  src={review.patientProfileImage}
                  alt={patientName}
                  className="w-14 h-14 rounded-xl object-cover ring-2 ring-slate-200 group-hover:ring-teal-400 transition-all duration-300"
                />
              ) : (
                <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center text-white text-lg font-bold ring-2 ring-slate-200 group-hover:ring-teal-400 transition-all duration-300">
                  {getInitials()}
                </div>
              )}
            </div>

            {/* Name & Date */}
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-bold text-slate-900 truncate group-hover:text-teal-600 transition-colors">
                {patientName}
              </h3>
              <p className="text-sm text-slate-500 font-medium">
                {formatDate(review.createdAt)}
              </p>
            </div>
          </div>

          {/* Overall Rating Badge */}
          <div className="flex flex-col items-end gap-2 flex-shrink-0">
            <div className="flex items-center gap-2 bg-gradient-to-r from-amber-50 to-amber-100 px-3 py-2 rounded-xl border border-amber-200 shadow-sm">
              <FaStar className="text-amber-500 text-sm" />
              <span className="text-lg font-black text-amber-700">{rating.toFixed(1)}</span>
            </div>
            <div className="flex gap-1">
              {renderStars(rating)}
            </div>
          </div>
        </div>

        {/* Review Comment */}
        {review.comment && (
          <div className="relative mb-6 mt-4">
            <div className="absolute top-0 right-0 text-teal-200">
              <FaQuoteRight className="text-xl opacity-50" />
            </div>
            <p className="text-sm text-slate-700 leading-relaxed pr-6 line-clamp-3">
              {review.comment}
            </p>
          </div>
        )}

        {/* Details Button - Full Width */}
        <div className="mb-1 mt-6">
          <button
            onClick={onViewDetails}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-200 rounded-xl hover:from-teal-100 hover:to-emerald-100 hover:border-teal-300 transition-all duration-200 hover:scale-[1.02]"
          >
            <FaInfoCircle className="text-teal-500 text-sm" />
            <span className="text-sm font-semibold text-teal-700">
              عرض التفاصيل
            </span>
          </button>
        </div>
      </div>
    </article>
  );
};

export default ReviewCard;
