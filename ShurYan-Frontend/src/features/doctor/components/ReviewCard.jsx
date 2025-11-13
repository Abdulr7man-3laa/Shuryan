import React from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar, FaQuoteRight, FaCheckCircle } from 'react-icons/fa';

/**
 * ReviewCard Component - Premium Design
 * Elegant card for displaying patient reviews and ratings
 */
const ReviewCard = ({ review }) => {
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
        <FaStar key={`full-${i}`} className="text-amber-400 text-sm" />
      );
    }

    // Half star
    if (hasHalfStar) {
      stars.push(
        <FaStarHalfAlt key="half" className="text-amber-400 text-sm" />
      );
    }

    // Empty stars
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <FaRegStar key={`empty-${i}`} className="text-amber-400 text-sm" />
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

  return (
    <article className="group relative bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-slate-200/80 overflow-hidden">
      {/* Subtle background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50/20 to-white"></div>
      
      {/* Accent bar */}
      <div className="absolute right-0 top-0 bottom-0 w-1 bg-gradient-to-b from-teal-500 to-teal-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      <div className="relative p-5">
        {/* Header - Patient Info & Rating */}
        <div className="flex items-start justify-between mb-4">
          {/* Patient Info */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              {review.patientImage ? (
                <img
                  src={review.patientImage}
                  alt={review.patientName}
                  className="w-12 h-12 rounded-lg object-cover ring-1 ring-slate-200 group-hover:ring-teal-400 transition-all duration-300"
                />
              ) : (
                <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg flex items-center justify-center text-white text-base font-bold ring-1 ring-slate-200 group-hover:ring-teal-400 transition-all duration-300">
                  {getInitials()}
                </div>
              )}
              {/* Verified badge */}
              {review.isVerified && (
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center">
                  <FaCheckCircle className="text-white text-[8px]" />
                </div>
              )}
            </div>

            {/* Name & Date */}
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-bold text-slate-900 truncate group-hover:text-teal-600 transition-colors">
                {review.patientName}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {formatDate(review.date)}
              </p>
            </div>
          </div>

          {/* Rating Badge */}
          <div className="flex flex-col items-end gap-1 flex-shrink-0">
            <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
              <FaStar className="text-amber-500 text-xs" />
              <span className="text-sm font-bold text-amber-700">{review.rating.toFixed(1)}</span>
            </div>
            <div className="flex items-center gap-0.5">
              {renderStars(review.rating)}
            </div>
          </div>
        </div>

        {/* Review Text */}
        {review.comment && (
          <div className="relative mb-3">
            <div className="absolute top-0 right-0 text-amber-200">
              <FaQuoteRight className="text-2xl opacity-50" />
            </div>
            <p className="text-sm text-slate-700 leading-relaxed pr-8 line-clamp-3">
              {review.comment}
            </p>
          </div>
        )}

        {/* Review Categories (if available) */}
        {review.categories && review.categories.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {review.categories.map((category, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-slate-50 text-slate-600 text-[10px] font-semibold rounded border border-slate-200"
              >
                {category}
              </span>
            ))}
          </div>
        )}

        {/* Footer - Session Type */}
        {review.sessionType && (
          <div className="mt-3 pt-3 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-teal-500 rounded-full"></div>
              <span className="text-xs text-slate-600 font-medium">
                {review.sessionType}
              </span>
            </div>
          </div>
        )}
      </div>
    </article>
  );
};

export default ReviewCard;
