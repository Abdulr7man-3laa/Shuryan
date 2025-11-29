import { useState, useEffect } from 'react';
import { FaFlask, FaMapMarkerAlt, FaClock, FaVial } from 'react-icons/fa';
import useLaboratoryProfile from '../hooks/useLaboratoryProfile';
import BasicInfoSection from '../components/profile/BasicInfoSection';
import AddressSection from '../components/profile/AddressSection';
import WorkingHoursSection from '../components/profile/WorkingHoursSection';
import SampleCollectionSection from '../components/profile/SampleCollectionSection';

/**
 * LaboratoryProfilePage Component
 * Main page for laboratory profile management with tabbed interface
 */
const LaboratoryProfilePage = () => {
  const [activeTab, setActiveTab] = useState('basic');

  // Fetch all data on mount
  const {
    fetchBasicInfo,
    fetchAddress,
    fetchWorkingHours,
    fetchSampleCollectionSettings,
  } = useLaboratoryProfile({ autoFetch: false });

  useEffect(() => {
    // Fetch all data in parallel
    const fetchAllData = async () => {
      await Promise.allSettled([
        fetchBasicInfo(),
        fetchAddress(),
        fetchWorkingHours(),
        fetchSampleCollectionSettings(),
      ]);
    };

    fetchAllData();
  }, [fetchBasicInfo, fetchAddress, fetchWorkingHours, fetchSampleCollectionSettings]);

  // Tabs configuration
  const tabs = [
    { id: 'basic', label: 'المعلومات الأساسية', icon: FaFlask },
    { id: 'address', label: 'العنوان', icon: FaMapMarkerAlt },
    { id: 'hours', label: 'ساعات العمل', icon: FaClock },
    { id: 'samples', label: 'أخذ العينات', icon: FaVial },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50/30 to-emerald-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black bg-gradient-to-r from-teal-600 via-teal-500 to-emerald-500 bg-clip-text text-transparent mb-2">
            الملف الشخصي
          </h1>
          <p className="text-slate-600 text-lg">إدارة معلومات المختبر</p>
        </div>

        {/* Tabs Navigation */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-2 mb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-md scale-105'
                      : 'text-slate-600 hover:bg-teal-50 hover:text-teal-600'
                  }`}
                >
                  <Icon className="text-lg" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'basic' && <BasicInfoSection />}
          {activeTab === 'address' && <AddressSection />}
          {activeTab === 'hours' && <WorkingHoursSection />}
          {activeTab === 'samples' && <SampleCollectionSection />}
        </div>
      </div>
    </div>
  );
};

export default LaboratoryProfilePage;
