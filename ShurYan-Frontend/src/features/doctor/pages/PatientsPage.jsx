import React, { useState, useRef, useEffect, useCallback } from 'react';
import { FaUsers, FaSearch, FaTimes, FaFilter, FaSort, FaChevronDown, FaCheck } from 'react-icons/fa';
import { usePatients } from '../hooks/usePatients';
import PatientCard from '../components/PatientCard';
import PrescriptionsListModal from '../components/PrescriptionsListModal';
import LabResultsModal from '../components/LabResultsModal';
import MedicalRecordModal from '../components/MedicalRecordModal';

/**
 * PatientsPage Component
 * Displays all patients who have completed appointments with the doctor
 */
const PatientsPage = () => {
  // Hooks
  const {
    filteredPatients,
    loading,
    error,
    searchTerm,
    filterStatus,
    sortBy,
    setSearchTerm,
    setFilterStatus,
    setSortBy,
    clearError,
    fetchPatients,
    totalPatients,
  } = usePatients();

  // Local state for modals
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false);
  const [isLabResultsModalOpen, setIsLabResultsModalOpen] = useState(false);
  const [isMedicalRecordModalOpen, setIsMedicalRecordModalOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const filterRef = useRef(null);
  const sortRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
      if (sortRef.current && !sortRef.current.contains(event.target)) {
        setIsSortOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Action handlers - memoized to prevent re-creating functions
  const handleMedicalRecordClick = useCallback((patient) => {
    setSelectedPatient(patient);
    setIsMedicalRecordModalOpen(true);
  }, []);

  const handlePrescriptionClick = useCallback((patient) => {
    setSelectedPatient(patient);
    setIsPrescriptionModalOpen(true);
  }, []);

  const handleLabResultsClick = useCallback((patient) => {
    setSelectedPatient(patient);
    setIsLabResultsModalOpen(true);
  }, []);

  // Get filter/sort labels
  const getFilterLabel = () => {
    const labels = {
      'all': 'جميع المرضى',
      'recent': 'آخر 30 يوم',
      'archived': 'أرشيف (90+ يوم)',
    };
    return labels[filterStatus] || 'جميع المرضى';
  };

  const getSortLabel = () => {
    const labels = {
      'lastVisit': 'آخر زيارة',
      'name': 'الاسم',
      'sessions': 'عدد الجلسات',
    };
    return labels[sortBy] || 'آخر زيارة';
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50/20 to-emerald-50/20" dir="rtl">
        <div className="container mx-auto px-4 py-8">
          {/* Header Skeleton */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-slate-100">
            <div className="h-10 bg-gradient-to-r from-slate-200 to-slate-100 rounded-xl w-80 mb-4 animate-pulse"></div>
            <div className="h-6 bg-slate-100 rounded-lg w-96 animate-pulse"></div>
          </div>

          {/* Cards Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-2xl shadow-lg p-8 border border-slate-100">
                <div className="h-48 bg-gradient-to-br from-slate-100 to-slate-50 rounded-xl animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50/20 to-emerald-50/20" dir="rtl">
      <div className="container mx-auto px-4 py-8">
        {/* Premium Header Section with Grid Pattern */}
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
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-emerald-400/20 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-teal-400/20 to-transparent rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              {/* Title & Icon */}
              <div className="flex items-center gap-5">
                <div className="relative">
                  <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-2xl">
                    <FaUsers className="text-white text-3xl" />
                  </div>
                  {/* Icon glow */}
                  <div className="absolute inset-0 bg-white/30 rounded-2xl blur-xl"></div>
                </div>
                <div>
                  <h1 className="text-4xl font-black text-white mb-2 drop-shadow-lg">المرضى</h1>
                  <p className="text-white/90 text-base font-medium">
                    جميع المرضى الذين أتموا جلساتهم معك
                    {totalPatients > 0 && (
                      <span className="mr-3 bg-white/20 px-3 py-1 rounded-lg text-white font-bold inline-block">
                        {totalPatients} مريض
                      </span>
                    )}
                  </p>
                </div>
              </div>
              
              {/* Search & Filters */}
              <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                {/* Search Input */}
                <div className="relative flex-1 lg:w-80">
                  <input
                    type="text"
                    placeholder="ابحث بالاسم أو رقم الهاتف..."
                    className="w-full pl-4 pr-12 py-3.5 bg-white/90 backdrop-blur-sm border-2 border-white/30 rounded-xl focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all duration-200 text-slate-800 placeholder-slate-400 font-medium shadow-lg"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <FaSearch className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      <FaTimes />
                    </button>
                  )}
                </div>
                
                {/* Filter Dropdown */}
                <div className="relative" ref={filterRef}>
                  <button
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-5 py-3.5 rounded-xl transition-all duration-200 flex items-center gap-2 border-2 border-white/30 shadow-lg font-bold text-white"
                  >
                    <FaFilter className="w-4 h-4" />
                    <span className="text-sm">{getFilterLabel()}</span>
                    <FaChevronDown className={`w-3 h-3 transition-transform duration-200 ${isFilterOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isFilterOpen && (
                    <div className="absolute left-0 top-full mt-2 w-56 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden z-50">
                      <div className="py-1">
                        <button
                          onClick={() => { setFilterStatus('all'); setIsFilterOpen(false); }}
                          className={`w-full flex items-center justify-between px-4 py-3 text-sm transition-colors ${
                            filterStatus === 'all'
                              ? 'bg-teal-50 text-teal-700 font-bold'
                              : 'text-slate-700 hover:bg-slate-50 font-medium'
                          }`}
                        >
                          <span>جميع المرضى</span>
                          {filterStatus === 'all' && <FaCheck className="w-4 h-4 text-teal-600" />}
                        </button>
                        <button
                          onClick={() => { setFilterStatus('recent'); setIsFilterOpen(false); }}
                          className={`w-full flex items-center justify-between px-4 py-3 text-sm transition-colors ${
                            filterStatus === 'recent'
                              ? 'bg-teal-50 text-teal-700 font-bold'
                              : 'text-slate-700 hover:bg-slate-50 font-medium'
                          }`}
                        >
                          <span>آخر 30 يوم</span>
                          {filterStatus === 'recent' && <FaCheck className="w-4 h-4 text-teal-600" />}
                        </button>
                        <button
                          onClick={() => { setFilterStatus('archived'); setIsFilterOpen(false); }}
                          className={`w-full flex items-center justify-between px-4 py-3 text-sm transition-colors ${
                            filterStatus === 'archived'
                              ? 'bg-teal-50 text-teal-700 font-bold'
                              : 'text-slate-700 hover:bg-slate-50 font-medium'
                          }`}
                        >
                          <span>أرشيف (90+ يوم)</span>
                          {filterStatus === 'archived' && <FaCheck className="w-4 h-4 text-teal-600" />}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Sort Dropdown */}
                <div className="relative" ref={sortRef}>
                  <button
                    onClick={() => setIsSortOpen(!isSortOpen)}
                    className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-5 py-3.5 rounded-xl transition-all duration-200 flex items-center gap-2 border-2 border-white/30 shadow-lg font-bold text-white"
                  >
                    <FaSort className="w-4 h-4" />
                    <span className="text-sm">{getSortLabel()}</span>
                    <FaChevronDown className={`w-3 h-3 transition-transform duration-200 ${isSortOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isSortOpen && (
                    <div className="absolute left-0 top-full mt-2 w-48 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden z-50">
                      <div className="py-1">
                        <button
                          onClick={() => { setSortBy('lastVisit'); setIsSortOpen(false); }}
                          className={`w-full flex items-center justify-between px-4 py-3 text-sm transition-colors ${
                            sortBy === 'lastVisit'
                              ? 'bg-teal-50 text-teal-700 font-bold'
                              : 'text-slate-700 hover:bg-slate-50 font-medium'
                          }`}
                        >
                          <span>آخر زيارة</span>
                          {sortBy === 'lastVisit' && <FaCheck className="w-4 h-4 text-teal-600" />}
                        </button>
                        <button
                          onClick={() => { setSortBy('name'); setIsSortOpen(false); }}
                          className={`w-full flex items-center justify-between px-4 py-3 text-sm transition-colors ${
                            sortBy === 'name'
                              ? 'bg-teal-50 text-teal-700 font-bold'
                              : 'text-slate-700 hover:bg-slate-50 font-medium'
                          }`}
                        >
                          <span>الاسم</span>
                          {sortBy === 'name' && <FaCheck className="w-4 h-4 text-teal-600" />}
                        </button>
                        <button
                          onClick={() => { setSortBy('sessions'); setIsSortOpen(false); }}
                          className={`w-full flex items-center justify-between px-4 py-3 text-sm transition-colors ${
                            sortBy === 'sessions'
                              ? 'bg-teal-50 text-teal-700 font-bold'
                              : 'text-slate-700 hover:bg-slate-50 font-medium'
                          }`}
                        >
                          <span>عدد الجلسات</span>
                          {sortBy === 'sessions' && <FaCheck className="w-4 h-4 text-teal-600" />}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="relative bg-gradient-to-r from-red-50 to-rose-50 border-2 border-red-200 rounded-2xl p-8 mb-8 shadow-xl overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-red-100 rounded-full blur-3xl opacity-30"></div>
            <div className="relative z-10 flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-2xl font-black text-red-800 mb-3 flex items-center gap-3">
                  <span className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center text-white">!</span>
                  حدث خطأ
                </h3>
                <p className="text-red-700 font-medium text-lg">{error}</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => fetchPatients()}
                  className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-200 font-bold shadow-lg hover:shadow-xl hover:scale-105"
                >
                  إعادة المحاولة
                </button>
                <button
                  onClick={clearError}
                  className="px-6 py-3 bg-white text-red-600 border-2 border-red-200 rounded-xl hover:bg-red-50 transition-all duration-200 font-bold shadow-lg hover:shadow-xl"
                >
                  إغلاق
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Patients Grid */}
        {filteredPatients.length === 0 ? (
          <div className="relative bg-white rounded-2xl shadow-xl p-16 text-center border border-slate-100 overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-teal-50 to-transparent rounded-full blur-3xl opacity-50"></div>
            <div className="relative z-10">
              <div className="relative inline-block mb-8">
                <div className="w-32 h-32 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto shadow-xl">
                  <FaUsers className="text-slate-400 text-5xl" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-teal-400/20 to-emerald-400/20 rounded-full blur-2xl"></div>
              </div>
              <h3 className="text-3xl font-black text-slate-800 mb-4">لا توجد نتائج</h3>
              <p className="text-slate-600 text-lg font-medium mb-8">
                {searchTerm 
                  ? 'لا توجد مرضى مطابقين لمعايير البحث'
                  : 'لم تقم بإتمام أي جلسات مع المرضى بعد'
                }
              </p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="px-8 py-4 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-xl hover:from-teal-700 hover:to-emerald-700 transition-all duration-200 font-bold shadow-lg hover:shadow-xl hover:scale-105"
                >
                  مسح البحث
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPatients.map((patient) => (
              <PatientCard
                key={patient.id}
                patient={patient}
                onMedicalRecordClick={handleMedicalRecordClick}
                onPrescriptionClick={handlePrescriptionClick}
                onLabResultsClick={handleLabResultsClick}
              />
            ))}
          </div>
        )}

        {/* Results Count */}
        {filteredPatients.length > 0 && (
          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-3 bg-white px-8 py-4 rounded-2xl shadow-lg border border-slate-100">
              <span className="text-slate-600 font-medium text-lg">عرض</span>
              <span className="text-3xl font-black text-teal-600">{filteredPatients.length}</span>
              <span className="text-slate-600 font-medium text-lg">من أصل</span>
              <span className="text-3xl font-black text-slate-800">{totalPatients}</span>
              <span className="text-slate-600 font-medium text-lg">مريض</span>
            </div>
          </div>
        )}
      </div>

      {/* Prescriptions List Modal */}
      <PrescriptionsListModal
        isOpen={isPrescriptionModalOpen}
        onClose={() => {
          setIsPrescriptionModalOpen(false);
          setSelectedPatient(null);
        }}
        patient={selectedPatient}
      />

      {/* Lab Results Modal */}
      <LabResultsModal
        isOpen={isLabResultsModalOpen}
        onClose={() => {
          setIsLabResultsModalOpen(false);
          setSelectedPatient(null);
        }}
        patient={selectedPatient}
      />

      {/* Medical Record Modal */}
      <MedicalRecordModal
        isOpen={isMedicalRecordModalOpen}
        onClose={() => {
          setIsMedicalRecordModalOpen(false);
          setSelectedPatient(null);
        }}
        patient={selectedPatient}
      />
    </div>
  );
};

export default PatientsPage;
