import React, { useEffect, useState } from 'react';
import { usePatientProfile } from '../hooks/usePatientProfile';
import { PersonalInfoSection, MedicalRecordSection } from '../components/profile';
import { FaSpinner, FaUser, FaFileMedical } from 'react-icons/fa';

/**
 * Patient Profile Page
 * 
 * Main page containing:
 * 1. Personal Information Section
 * 2. Medical Record Section
 */
const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('personal'); // 'personal' or 'medical'

  const {
    personalInfo,
    address,
    medicalRecord,
    loading,
    fetchPersonalInfo,
    fetchAddress,
    fetchMedicalRecord,
  } = usePatientProfile({ autoFetch: false });

  // Fetch all data on mount
  useEffect(() => {
    const fetchAll = async () => {
      await Promise.allSettled([
        fetchPersonalInfo(),
        fetchAddress(),
        fetchMedicalRecord(),
      ]);
    };

    fetchAll();
  }, [fetchPersonalInfo, fetchAddress, fetchMedicalRecord]);

  // Initial loading state
  const isInitialLoading =
    (loading.personalInfo && !personalInfo) ||
    (loading.address && !address) ||
    (loading.medicalRecord && !medicalRecord);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50 to-emerald-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            الملف الشخصي
          </h1>
          <p className="text-slate-600">
            إدارة معلوماتك الشخصية والملف الطبي
          </p>
        </div>

        {/* Initial Loading State */}
        {isInitialLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <FaSpinner className="w-12 h-12 text-teal-600 animate-spin mb-4" />
            <p className="text-slate-600 font-medium">جاري تحميل البيانات...</p>
          </div>
        ) : (
          <>
            {/* Tabs Navigation */}
            <div className="flex gap-2 mb-6 bg-white rounded-xl p-2 shadow-sm border border-slate-200">
              <button
                onClick={() => setActiveTab('personal')}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                  activeTab === 'personal'
                    ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-md'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <FaUser className="w-4 h-4" />
                <span>المعلومات الشخصية</span>
              </button>
              
              <button
                onClick={() => setActiveTab('medical')}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                  activeTab === 'medical'
                    ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-md'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <FaFileMedical className="w-4 h-4" />
                <span>الملف الطبي</span>
              </button>
            </div>

            {/* Tab Content */}
            <div className="space-y-6">
              {activeTab === 'personal' ? (
                <PersonalInfoSection />
              ) : (
                <MedicalRecordSection />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
