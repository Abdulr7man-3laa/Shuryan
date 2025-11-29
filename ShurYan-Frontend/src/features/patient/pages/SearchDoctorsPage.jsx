import React, { useState, useEffect } from 'react';
import {
  FaSearch, FaTimes, FaChevronLeft, FaChevronRight
} from 'react-icons/fa';
import FilterChips from '../components/FilterChips';
import DashboardFooter from '@/features/doctor/components/DashboardFooter';
import DoctorCard from '../components/DoctorCard';
import DoctorDetailsModal from '../components/DoctorDetailsModal';
import BookingModal from '../components/booking/BookingModal';
import { useDoctors } from '../hooks/useDoctors';

/**
 * SearchDoctorsPage Component - Main Patient Dashboard
 * Search and filter doctors with chatbot assistance
 */
const SearchDoctorsPage = () => {
  // UI-only state (not filters)
  const [selectedDoctorId, setSelectedDoctorId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDoctorForBooking, setSelectedDoctorForBooking] = useState(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  // Use doctors hook - all filters from store
  const {
    filteredDoctors,
    loading,
    error,
    pageNumber,
    totalCount,
    totalPages,
    hasPreviousPage,
    hasNextPage,
    // Filters from store
    searchTerm,
    selectedSpecialties,
    selectedCities,
    priceRange,
    minRating,
    availableToday,
    // Actions
    goToNextPage,
    goToPreviousPage,
    setSearchTerm,
    setSelectedSpecialties,
    setSelectedCities,
    setPriceRange,
    setMinRating,
    setAvailableToday,
    resetFilters,
  } = useDoctors();

  // Handle view profile
  const handleViewProfile = (doctorId) => {
    setSelectedDoctorId(doctorId);
    setIsModalOpen(true);
  };

  // Handle close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDoctorId(null);
  };

  // Handle book appointment
  const handleBookAppointment = (doctor) => {
    setSelectedDoctorForBooking(doctor);
    setIsBookingModalOpen(true);
  };

  // Handle close booking modal
  const handleCloseBookingModal = () => {
    setIsBookingModalOpen(false);
    setSelectedDoctorForBooking(null);
  };

  // Reset all filters (handled by store)
  const handleResetFilters = () => {
    resetFilters();
  };

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Handle pagination with scroll
  const handleNextPage = () => {
    goToNextPage();
    scrollToTop();
  };

  const handlePreviousPage = () => {
    goToPreviousPage();
    scrollToTop();
  };

  // Scroll to top on component mount
  useEffect(() => {
    scrollToTop();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
      <div className="flex-1">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12">
          {/* Header Section - Centered */}
          <div className="space-y-8 mb-12">
            {/* Welcome Message */}
            <div className="text-center space-y-2 pt-4">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-800 leading-tight">
                مرحباً بك في <span className="text-[#00d5be]">شُريان</span>
              </h1>
              <p className="text-slate-600 font-medium text-sm sm:text-base max-w-2xl mx-auto">
                ابحث عن أفضل الأطباء واحجز موعدك بسهولة
              </p>
            </div>

            {/* Search Bar Container */}
            <div className="relative max-w-3xl mx-auto">
              {/* Search Input */}
              <div className="relative">
                <div className="absolute inset-0 bg-white rounded-2xl shadow-md border border-slate-200"></div>
                <div className="relative flex items-center px-5 py-3.5">
                  <FaSearch className="absolute right-6 text-slate-400 text-xl" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="ابحث عن طبيب بالاسم ..."
                    className="w-full pr-14 pl-14 py-1 bg-transparent text-slate-800 placeholder-slate-400 font-medium text-lg focus:outline-none"
                  />
                  {searchTerm ? (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute left-6 w-9 h-9 bg-slate-100 hover:bg-slate-200 rounded-xl flex items-center justify-center transition-all hover:scale-105"
                    >
                      <FaTimes className="text-slate-600 text-sm" />
                    </button>
                  ) : (
                    <div className="absolute left-6 px-3 py-1.5 bg-slate-100 rounded-lg border border-slate-200">
                      <span className="text-slate-500 text-xs font-bold">⌘ K</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Filter Chips */}
            <FilterChips
              selectedSpecialties={selectedSpecialties}
              setSelectedSpecialties={setSelectedSpecialties}
              selectedCities={selectedCities}
              setSelectedCities={setSelectedCities}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              minRating={minRating}
              setMinRating={setMinRating}
              availableToday={availableToday}
              setAvailableToday={setAvailableToday}
              onReset={handleResetFilters}
              resultsCount={filteredDoctors.length}
            />
          </div>

          {/* Doctors Content */}
          <div className="space-y-6">

            {/* Loading State */}
            {loading && (
              <div className="space-y-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-xl border-2 border-slate-200 p-6 animate-pulse">
                    <div className="flex gap-4">
                      <div className="w-20 h-20 bg-slate-200 rounded-full"></div>
                      <div className="flex-1 space-y-3">
                        <div className="h-6 bg-slate-200 rounded w-1/3"></div>
                        <div className="h-4 bg-slate-200 rounded w-1/4"></div>
                        <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 text-center">
                <p className="text-red-600 font-semibold mb-3">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition-colors"
                >
                  إعادة المحاولة
                </button>
              </div>
            )}

            {/* Doctors Grid */}
            {!loading && !error && filteredDoctors.length > 0 && (
              <div className="space-y-4">
                {filteredDoctors.map(doctor => (
                  <DoctorCard
                    key={doctor.id}
                    doctor={doctor}
                    onViewProfile={handleViewProfile}
                    onBook={handleBookAppointment}
                  />
                ))}
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && filteredDoctors.length === 0 && (
              <div className="bg-white rounded-2xl shadow-lg border-2 border-slate-200 p-12 text-center">
                <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaSearch className="text-slate-400 text-4xl" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">لا توجد نتائج</h3>
                <p className="text-slate-600 font-medium">جرب تغيير معايير البحث أو الفلاتر</p>
              </div>
            )}

            {/* Pagination Arrows */}
            {!loading && !error && totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 pt-6">
                {/* Previous Button */}
                <button
                  onClick={handlePreviousPage}
                  disabled={!hasPreviousPage}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${hasPreviousPage
                    ? 'bg-teal-500 text-white hover:bg-teal-600 shadow-lg hover:shadow-xl'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                >
                  <FaChevronRight />
                  <span>السابق</span>
                </button>

                {/* Page Info */}
                <div className="flex items-center gap-3 px-6 py-3 bg-white rounded-xl border-2 border-slate-200 shadow-md">
                  <span className="text-slate-600 font-semibold">صفحة</span>
                  <span className="text-xl font-black text-teal-600">{pageNumber}</span>
                  <span className="text-slate-400 font-semibold">من</span>
                  <span className="text-xl font-black text-slate-800">{totalPages}</span>
                </div>

                {/* Next Button */}
                <button
                  onClick={handleNextPage}
                  disabled={!hasNextPage}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${hasNextPage
                    ? 'bg-teal-500 text-white hover:bg-teal-600 shadow-lg hover:shadow-xl'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                >
                  <span>التالي</span>
                  <FaChevronLeft />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer - Full Width */}
      <DashboardFooter />

      {/* Doctor Details Modal */}
      <DoctorDetailsModal
        doctorId={selectedDoctorId}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onBook={handleBookAppointment}
      />

      {/* Booking Modal - Single instance for all doctors */}
      {selectedDoctorForBooking && (
        <BookingModal
          isOpen={isBookingModalOpen}
          onClose={handleCloseBookingModal}
          doctor={selectedDoctorForBooking}
        />
      )}
    </div>
  );
};


export default SearchDoctorsPage;
