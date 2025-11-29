import React, { useState, useRef, useEffect } from 'react';
import { 
  FaStar, FaFilter, FaChevronDown, 
  FaCheck, FaChartLine, FaAward, FaUsers, FaRegStar
} from 'react-icons/fa';
import ReviewCard from '../components/ReviewCard';
import ReviewDetailsModal from '../components/ReviewDetailsModal';
import useReviews from '../hooks/useReviews';

/**
 * ReviewsPage - Premium Design
 * Complete reviews management with beautiful UI/UX
 */
const ReviewsPage = () => {
  // Use reviews hook for API integration
  const {
    reviews,
    pagination,
    filters,
    loading,
    averageRating,
    totalReviews,
    ratingDistribution,
    selectedReview,
    setMinRatingFilter,
    goToNextPage,
    goToPreviousPage,
    fetchReviewDetails,
    setSelectedReview
  } = useReviews();

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  
  const filterRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle view review details
  const handleViewDetails = async (review) => {
    const result = await fetchReviewDetails(review.reviewId);
    if (result.success) {
      setIsDetailsModalOpen(true);
    }
  };

  // Handle close details modal
  const handleCloseDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedReview(null);
  };

  // Client-side filtering by rating
  const filteredReviews = filters.minRating
    ? reviews.filter(review => review.rating >= filters.minRating)
    : reviews;

  // Get filter label
  const getFilterLabel = () => {
    const labels = {
      'all': 'جميع التقييمات',
      '5': '5 نجوم',
      '4': '4+ نجوم', 
      '3': '3+ نجوم',
    };
    return labels[filters.minRating?.toString()] || 'جميع التقييمات';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50/20 to-emerald-50/20" dir="rtl">
      <div className="container mx-auto px-4 py-8">
        {/* Premium Header Section */}
        <div 
          className="rounded-2xl p-8 mb-8 shadow-xl relative"
          style={{
            backgroundColor: '#0d9488',
            backgroundImage: `
              linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)
            `,
            backgroundSize: '30px 30px',
            overflow: 'visible'
          }}
        >
          {/* Decorative gradient orbs */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-emerald-400/20 to-transparent rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-teal-400/20 to-transparent rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="relative z-10">
            {/* Title & Stats Row */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-6">
              {/* Title & Icon */}
              <div className="flex items-center gap-5">
                <div className="relative">
                  <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-2xl">
                    <FaStar className="text-white text-3xl" />
                  </div>
                  {/* Icon glow */}
                  <div className="absolute inset-0 bg-white/30 rounded-2xl blur-xl"></div>
                </div>
                <div>
                  <h1 className="text-4xl font-black text-white mb-2 drop-shadow-lg">التقييمات</h1>
                  <p className="text-white/90 text-base font-medium">
                    آراء المرضى وتقييماتهم
                  </p>
                </div>
              </div>

              {/* Quick Stats & Filter */}
              <div className="flex gap-3">
                <div className="bg-white/20 backdrop-blur-sm px-4 py-2.5 rounded-xl border-2 border-white/30">
                  <div className="flex items-center gap-2">
                    <FaAward className="text-white/80 text-sm" />
                    <span className="text-white/80 text-xs font-medium">المتوسط</span>
                    <span className="text-xl font-black text-white">{averageRating.toFixed(1)}</span>
                    <FaStar className="text-white text-xs" />
                  </div>
                </div>
                
                <div className="bg-white/20 backdrop-blur-sm px-4 py-2.5 rounded-xl border-2 border-white/30">
                  <div className="flex items-center gap-2">
                    <FaUsers className="text-white/80 text-sm" />
                    <span className="text-white/80 text-xs font-medium">المجموع</span>
                    <span className="text-xl font-black text-white">{totalReviews}</span>
                  </div>
                </div>

                {/* Filter Dropdown */}
                <div className="relative" ref={filterRef}>
                  <button
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-5 py-3 rounded-xl transition-all duration-200 flex items-center gap-2 border-2 border-white/30 shadow-lg font-bold text-white"
                  >
                    <FaFilter className="w-4 h-4" />
                    <span className="text-sm">{getFilterLabel()}</span>
                    <FaChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isFilterOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isFilterOpen && (
                    <div className="absolute left-0 top-full mt-2 w-56 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden z-50">
                      <div className="py-1">
                        <button
                          onClick={() => { setMinRatingFilter(null); setIsFilterOpen(false); }}
                          className={`w-full flex items-center justify-between px-4 py-3 text-sm transition-colors ${
                            !filters.minRating
                              ? 'bg-teal-50 text-teal-700 font-bold'
                              : 'text-slate-700 hover:bg-slate-50 font-medium'
                          }`}
                        >
                          <span>جميع التقييمات</span>
                          {!filters.minRating && <FaCheck className="w-4 h-4 text-teal-600" />}
                        </button>
                        <button
                          onClick={() => { setMinRatingFilter(5); setIsFilterOpen(false); }}
                          className={`w-full flex items-center justify-between px-4 py-3 text-sm transition-colors ${
                            filters.minRating === 5
                              ? 'bg-teal-50 text-teal-700 font-bold'
                              : 'text-slate-700 hover:bg-slate-50 font-medium'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <FaStar className="text-teal-500 text-xs" />
                            <span>5 نجوم</span>
                          </div>
                          {filters.minRating === 5 && <FaCheck className="w-4 h-4 text-teal-600" />}
                        </button>
                        <button
                          onClick={() => { setMinRatingFilter(4); setIsFilterOpen(false); }}
                          className={`w-full flex items-center justify-between px-4 py-3 text-sm transition-colors ${
                            filters.minRating === 4
                              ? 'bg-teal-50 text-teal-700 font-bold'
                              : 'text-slate-700 hover:bg-slate-50 font-medium'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <FaStar className="text-teal-500 text-xs" />
                            <span>4+ نجوم</span>
                          </div>
                          {filters.minRating === 4 && <FaCheck className="w-4 h-4 text-teal-600" />}
                        </button>
                        <button
                          onClick={() => { setMinRatingFilter(3); setIsFilterOpen(false); }}
                          className={`w-full flex items-center justify-between px-4 py-3 text-sm transition-colors ${
                            filters.minRating === 3
                              ? 'bg-teal-50 text-teal-700 font-bold'
                              : 'text-slate-700 hover:bg-slate-50 font-medium'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <FaStar className="text-teal-500 text-xs" />
                            <span>3+ نجوم</span>
                          </div>
                          {filters.minRating === 3 && <FaCheck className="w-4 h-4 text-teal-600" />}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Rating Distribution */}
            {ratingDistribution && (
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-6 border border-white/20">
                <div className="grid grid-cols-5 gap-3">
                  {[5, 4, 3, 2, 1].map(star => {
                    const count = ratingDistribution[star] || 0;
                    const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                    
                    return (
                      <div key={star} className="flex flex-col items-center">
                        <div className="flex items-center gap-1 mb-1">
                          <span className="text-white font-bold text-sm">{star}</span>
                          <FaStar className="text-white text-xs" />
                        </div>
                        <div className="w-full bg-white/20 rounded-full h-2 mb-1">
                          <div 
                            className="bg-white rounded-full h-2 transition-all duration-300"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-white/80 text-xs font-medium">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Loading State */}
        {loading.reviews ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 animate-pulse">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-slate-200 rounded-lg"></div>
                    <div>
                      <div className="h-3 bg-slate-200 rounded w-24 mb-2"></div>
                      <div className="h-2 bg-slate-200 rounded w-16"></div>
                    </div>
                  </div>
                  <div className="h-8 w-12 bg-slate-200 rounded-lg"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-slate-200 rounded w-full"></div>
                  <div className="h-3 bg-slate-200 rounded w-5/6"></div>
                  <div className="h-3 bg-slate-200 rounded w-4/6"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredReviews.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-2xl p-16 text-center shadow-lg border border-slate-200">
            <div className="w-32 h-32 bg-gradient-to-br from-teal-50 to-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
              <FaRegStar className="w-16 h-16 text-teal-500" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">لا توجد تقييمات</h3>
            <p className="text-slate-600 font-medium">
              لا توجد تقييمات حتى الآن
            </p>
          </div>
        ) : (
          /* Reviews Grid */
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredReviews.map((review) => (
                <ReviewCard 
                  key={review.reviewId} 
                  review={review} 
                  onViewDetails={() => handleViewDetails(review)}
                />
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-8">
                <button
                  onClick={goToPreviousPage}
                  disabled={!pagination.hasPreviousPage}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <span>السابق</span>
                </button>
                
                <span className="text-slate-600 font-medium">
                  صفحة {pagination.pageNumber} من {pagination.totalPages}
                </span>
                
                <button
                  onClick={goToNextPage}
                  disabled={!pagination.hasNextPage}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <span>التالي</span>
                </button>
              </div>
            )}

            {/* Results Count */}
            {filteredReviews.length > 0 && (
              <div className="mt-8 text-center">
                <div className="inline-flex items-center gap-2 bg-white px-6 py-3 rounded-xl shadow-sm border border-slate-200">
                  <FaChartLine className="text-teal-600" />
                  <span className="text-slate-700 font-semibold">
                    عرض {filteredReviews.length} من {totalReviews} تقييم
                  </span>
                </div>
              </div>
            )}
          </>
        )}

        {/* Review Details Modal */}
        <ReviewDetailsModal
          review={selectedReview}
          isOpen={isDetailsModalOpen}
          onClose={handleCloseDetailsModal}
        />
      </div>
    </div>
  );
};

export default ReviewsPage;
