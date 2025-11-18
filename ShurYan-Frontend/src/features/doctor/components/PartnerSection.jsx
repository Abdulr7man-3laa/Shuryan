import React, { useState, useEffect, useCallback } from 'react';
import { usePartner } from '../hooks/usePartner';
import { 
  FaHandshake, 
  FaFlask, 
  FaPrescriptionBottle,
  FaInfoCircle,
  FaTrash
} from 'react-icons/fa';
import PartnerAutocomplete from './PartnerAutocomplete';

/**
 * PartnerSection Component - Updated with MUI Autocomplete
 * 
 * Features:
 * - MUI Autocomplete with RTL support
 * - Real-time API integration (NO MOCK DATA)
 * - Auto-save functionality
 * - Clean UI with partner cards
 * 
 * @component
 */
const PartnerSection = () => {
  const {
    suggestedPharmacy,
    suggestedLaboratory,
    availablePharmacies,
    availableLaboratories,
    loading,
    error,
    success,
    suggestPartner,
    removeSpecificPartner,
    clearErrors,
    hasPartner,
  } = usePartner({ autoFetch: true });

  // Local state for selected partners
  const [selectedPharmacy, setSelectedPharmacy] = useState(null);
  const [selectedLaboratory, setSelectedLaboratory] = useState(null);

  // Handle pharmacy suggestion
  const handleSuggestPharmacy = useCallback(async () => {
    if (!selectedPharmacy) return;
    
    try {
      // Include existing laboratory if present
      const partnerData = {
        pharmacyId: selectedPharmacy.id,
        ...(suggestedLaboratory && { laboratoryId: suggestedLaboratory.id })
      };
      await suggestPartner(partnerData);
      setSelectedPharmacy(null); // Clear selection after successful suggestion
    } catch (error) {
      console.error('Error suggesting pharmacy:', error);
    }
  }, [selectedPharmacy, suggestPartner, suggestedLaboratory]);

  // Handle laboratory suggestion
  const handleSuggestLaboratory = useCallback(async () => {
    if (!selectedLaboratory) return;
    
    try {
      // Include existing pharmacy if present
      const partnerData = {
        laboratoryId: selectedLaboratory.id,
        ...(suggestedPharmacy && { pharmacyId: suggestedPharmacy.id })
      };
      await suggestPartner(partnerData);
      setSelectedLaboratory(null); // Clear selection after successful suggestion
    } catch (error) {
      console.error('Error suggesting laboratory:', error);
    }
  }, [selectedLaboratory, suggestPartner, suggestedPharmacy]);

  // Auto-suggest when partner is selected
  useEffect(() => {
    if (selectedPharmacy && !suggestedPharmacy) {
      handleSuggestPharmacy();
    }
  }, [selectedPharmacy, suggestedPharmacy, handleSuggestPharmacy]);

  useEffect(() => {
    if (selectedLaboratory && !suggestedLaboratory) {
      handleSuggestLaboratory();
    }
  }, [selectedLaboratory, suggestedLaboratory, handleSuggestLaboratory]);

  // Auto-clear success messages
  useEffect(() => {
    if (success.partner) {
      const timer = setTimeout(() => {
        clearErrors();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success.partner, clearErrors]);

  // Handle remove pharmacy
  const handleRemovePharmacy = async () => {
    if (!confirm('هل أنت متأكد من إزالة الصيدلية المقترحة؟')) return;
    
    try {
      // Use specific endpoint to remove only pharmacy
      await removeSpecificPartner('pharmacy');
    } catch (error) {
      console.error('Error removing pharmacy:', error);
    }
  };

  // Handle remove laboratory
  const handleRemoveLaboratory = async () => {
    if (!confirm('هل أنت متأكد من إزالة المعمل المقترح؟')) return;
    
    try {
      // Use specific endpoint to remove only laboratory
      await removeSpecificPartner('laboratory');
    } catch (error) {
      console.error('Error removing laboratory:', error);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-500 via-teal-600 to-emerald-600 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <FaHandshake className="text-white text-xl" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white">اقتراح شريك</h2>
              <p className="text-teal-100 text-sm">اختر صيدلية و/أو معمل للتعاون معك</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <FaInfoCircle className="text-teal-200 text-sm" />
            <span className="text-teal-100 text-xs">يمكنك اختيار شريك واحد من كل نوع</span>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-8">
        {/* Success Message */}
        {success.partner && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 animate-fade-in">
            <p className="text-green-700 font-medium">✅ {success.partner}</p>
          </div>
        )}

        {/* Error Message */}
        {(error.partner || error.pharmacies || error.laboratories) && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 animate-fade-in">
            <p className="text-red-700 font-medium">
              ❌ {error.partner || error.pharmacies || error.laboratories}
            </p>
          </div>
        )}

        {/* Current Partners */}
        {hasPartner && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {suggestedPharmacy && (
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
                      <FaPrescriptionBottle className="text-white text-sm" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-slate-800">الصيدلية المقترحة</h3>
                      <p className="text-sm text-slate-600">شريك حالي</p>
                    </div>
                  </div>
                  <button
                    onClick={handleRemovePharmacy}
                    className="w-8 h-8 bg-red-100 hover:bg-red-200 rounded-lg flex items-center justify-center transition-colors"
                    title="إزالة الصيدلية"
                  >
                    <FaTrash className="text-red-600 text-xs" />
                  </button>
                </div>
                <div className="bg-white/50 rounded-xl p-4">
                  <p className="font-bold text-slate-800">{suggestedPharmacy.name}</p>
                  {suggestedPharmacy.address && (
                    <p className="text-sm text-slate-600 mt-1">{suggestedPharmacy.address}</p>
                  )}
                </div>
              </div>
            )}
            
            {suggestedLaboratory && (
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                      <FaFlask className="text-white text-sm" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-slate-800">المعمل المقترح</h3>
                      <p className="text-sm text-slate-600">شريك حالي</p>
                    </div>
                  </div>
                  <button
                    onClick={handleRemoveLaboratory}
                    className="w-8 h-8 bg-red-100 hover:bg-red-200 rounded-lg flex items-center justify-center transition-colors"
                    title="إزالة المعمل"
                  >
                    <FaTrash className="text-red-600 text-xs" />
                  </button>
                </div>
                <div className="bg-white/50 rounded-xl p-4">
                  <p className="font-bold text-slate-800">{suggestedLaboratory.name}</p>
                  {suggestedLaboratory.address && (
                    <p className="text-sm text-slate-600 mt-1">{suggestedLaboratory.address}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Partner Selectors */}
        {(!suggestedPharmacy || !suggestedLaboratory) && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pharmacy Selector */}
            {!suggestedPharmacy && (
              <PartnerAutocomplete
                title="اقتراح صيدلية"
                subtitle="اختر صيدلية من الصيدليات المتاحة"
                icon={FaPrescriptionBottle}
                gradient="from-green-50 to-emerald-50"
                iconBg="bg-green-500"
                options={availablePharmacies}
                value={selectedPharmacy}
                onChange={setSelectedPharmacy}
                loading={loading.pharmacies}
                placeholder="ابحث عن صيدلية..."
                type="pharmacy"
              />
            )}

            {/* Laboratory Selector */}
            {!suggestedLaboratory && (
              <PartnerAutocomplete
                title="اقتراح معمل"
                subtitle="اختر معمل من المعامل المتاحة"
                icon={FaFlask}
                gradient="from-blue-50 to-cyan-50"
                iconBg="bg-blue-500"
                options={availableLaboratories}
                value={selectedLaboratory}
                onChange={setSelectedLaboratory}
                loading={loading.laboratories}
                placeholder="ابحث عن معمل..."
                type="laboratory"
              />
            )}
          </div>
        )}

        {/* Empty State */}
        {!hasPartner && (!availablePharmacies.length && !availableLaboratories.length) && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaHandshake className="text-slate-400 text-xl" />
            </div>
            <h3 className="text-lg font-bold text-slate-700 mb-2">لا توجد شركاء متاحين</h3>
            <p className="text-slate-500 text-sm">
              لا توجد صيدليات أو معامل متاحة للتعاون في الوقت الحالي
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PartnerSection;
