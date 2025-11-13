import React, { useState, useRef, useEffect } from 'react';
import { usePartner } from '../hooks/usePartner';
import { 
  FaHandshake, 
  FaFlask, 
  FaPrescriptionBottle,
  FaInfoCircle,
  FaSearch,
  FaTimes,
  FaMapMarkerAlt,
  FaStar,
  FaCheckCircle,
  FaTrash
} from 'react-icons/fa';

/**
 * PartnerSection Component
 * 
 * Clean partner suggestion system with modern UI
 * 
 * Features:
 * - Suggest pharmacy AND/OR laboratory (max 1 of each)
 * - Autocomplete search with real-time filtering
 * - Side-by-side cards layout
 * - Optimistic updates with rollback
 * - Click outside to close dropdowns
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
    removePartner,
    clearErrors,
    hasPartner,
    refreshAll,
  } = usePartner({ autoFetch: true });

  // Local state
  const [selectedPharmacy, setSelectedPharmacy] = useState(null);
  const [selectedLaboratory, setSelectedLaboratory] = useState(null);
  const [searchPharmacy, setSearchPharmacy] = useState('');
  const [searchLaboratory, setSearchLaboratory] = useState('');
  const [showPharmacyDropdown, setShowPharmacyDropdown] = useState(false);
  const [showLaboratoryDropdown, setShowLaboratoryDropdown] = useState(false);
  
  // Pagination for dropdown
  const [pharmacyDisplayCount, setPharmacyDisplayCount] = useState(5);
  const [laboratoryDisplayCount, setLaboratoryDisplayCount] = useState(5);
  
  const pharmacyRef = useRef(null);
  const laboratoryRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (pharmacyRef.current && !pharmacyRef.current.contains(e.target)) {
        setShowPharmacyDropdown(false);
      }
      if (laboratoryRef.current && !laboratoryRef.current.contains(e.target)) {
        setShowLaboratoryDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Auto-save effect - saves after 3 seconds of inactivity
  useEffect(() => {
    // Skip if no selection
    if (!selectedPharmacy && !selectedLaboratory) {
      return;
    }

    // Check if selection changed from current partners
    const pharmacyChanged = selectedPharmacy?.id !== suggestedPharmacy?.id;
    const laboratoryChanged = selectedLaboratory?.id !== suggestedLaboratory?.id;

    if (!pharmacyChanged && !laboratoryChanged) {
      return;
    }

    // Auto-save after 3 seconds
    const timer = setTimeout(async () => {
      try {
        const partnerData = {};
        if (selectedPharmacy) partnerData.pharmacyId = selectedPharmacy.id;
        if (selectedLaboratory) partnerData.laboratoryId = selectedLaboratory.id;

        await suggestPartner(partnerData);
        
        // Reset search after successful save
        setSearchPharmacy('');
        setSearchLaboratory('');
      } catch (err) {
        console.error('Auto-save error:', err);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [selectedPharmacy, selectedLaboratory]);

  // Handle remove individual partner
  const handleRemovePharmacy = async () => {
    if (!confirm('هل أنت متأكد من إزالة الصيدلية المقترحة؟')) return;
    
    try {
      // If we have both, keep laboratory only
      if (suggestedLaboratory) {
        await suggestPartner({ laboratoryId: suggestedLaboratory.id });
      } else {
        // If only pharmacy, remove all
        await removePartner();
      }
      
      // Reset local state and refresh to update UI
      setSelectedPharmacy(null);
      await refreshAll();
    } catch (err) {
      console.error('Error removing pharmacy:', err);
    }
  };

  const handleRemoveLaboratory = async () => {
    if (!confirm('هل أنت متأكد من إزالة المعمل المقترح؟')) return;
    
    try {
      // If we have both, keep pharmacy only
      if (suggestedPharmacy) {
        await suggestPartner({ pharmacyId: suggestedPharmacy.id });
      } else {
        // If only laboratory, remove all
        await removePartner();
      }
      
      // Reset local state and refresh to update UI
      setSelectedLaboratory(null);
      await refreshAll();
    } catch (err) {
      console.error('Error removing laboratory:', err);
    }
  };

  const resetForm = () => {
    setSelectedPharmacy(null);
    setSelectedLaboratory(null);
    setSearchPharmacy('');
    setSearchLaboratory('');
    setPharmacyDisplayCount(5);
    setLaboratoryDisplayCount(5);
    clearErrors();
  };

  // Filter partners
  const filterPartners = (partners, query) => {
    // Ensure partners is an array
    if (!Array.isArray(partners)) return [];
    if (!query) return partners;
    
    const q = query.toLowerCase();
    return partners.filter(p => 
      p.name?.toLowerCase().includes(q) || 
      p.address?.toLowerCase().includes(q)
    );
  };

  const filteredPharmacies = filterPartners(availablePharmacies, searchPharmacy);
  const filteredLaboratories = filterPartners(availableLaboratories, searchLaboratory);

  // Debug: Log available data
  useEffect(() => {
    console.log('🏥 Available Pharmacies:', availablePharmacies);
    console.log('🔬 Available Laboratories:', availableLaboratories);
  }, [availablePharmacies, availableLaboratories]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-br from-teal-500 to-teal-600 px-6 py-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
              <FaHandshake className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">اقتراح شريك</h3>
              <p className="text-white/80 text-sm">
                اقترح صيدلية و/أو معمل للمرضى
              </p>
            </div>
          </div>
          
          {/* Actions - Removed for auto-save */}
          <div className="flex items-center gap-3">
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

        {/* Current Partners - Always visible with remove buttons */}
        {hasPartner && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {suggestedPharmacy && (
              <PartnerCard
                partner={suggestedPharmacy}
                type="pharmacy"
                icon={FaPrescriptionBottle}
                gradient="from-green-50 to-emerald-50"
                iconBg="bg-green-100"
                iconColor="text-green-600"
                borderColor="border-green-200"
                title="الصيدلية المقترحة"
                onRemove={handleRemovePharmacy}
              />
            )}
            
            {suggestedLaboratory && (
              <PartnerCard
                partner={suggestedLaboratory}
                type="laboratory"
                icon={FaFlask}
                gradient="from-blue-50 to-cyan-50"
                iconBg="bg-blue-100"
                iconColor="text-blue-600"
                borderColor="border-blue-200"
                title="المعمل المقترح"
                onRemove={handleRemoveLaboratory}
              />
            )}
          </div>
        )}

        {/* Partner Selectors - Show only if not already suggested */}
        {(!suggestedPharmacy || !suggestedLaboratory) && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pharmacy Selector - Show only if no pharmacy suggested */}
            {!suggestedPharmacy && (
              <PartnerSelector
                ref={pharmacyRef}
                title="اقتراح صيدلية"
                subtitle="اختر صيدلية من الصيدليات المتاحة"
                icon={FaPrescriptionBottle}
                gradient="from-green-50 to-emerald-50"
                iconBg="bg-green-500"
                searchBorder="border-green-200"
                focusBorder="focus:border-green-400"
                focusRing="focus:ring-green-100"
                hoverBg="hover:bg-green-50"
                dropdownBorder="border-green-200"
                selectedBorder="border-green-300"
                emptyBorder="border-green-300"
                emptyColor="text-green-300"
                searchValue={searchPharmacy}
                onSearchChange={(e) => {
                  setSearchPharmacy(e.target.value);
                  setShowPharmacyDropdown(true);
                  setPharmacyDisplayCount(5); // Reset count on search
                }}
                onSearchFocus={() => setShowPharmacyDropdown(true)}
                showDropdown={showPharmacyDropdown}
                filteredPartners={filteredPharmacies}
                displayCount={pharmacyDisplayCount}
                onLoadMore={() => setPharmacyDisplayCount(prev => prev + 5)}
                onSelectPartner={(p) => {
                  setSelectedPharmacy(p);
                  setSearchPharmacy('');
                  setShowPharmacyDropdown(false);
                  setPharmacyDisplayCount(5);
                }}
                selectedPartner={selectedPharmacy}
                onRemovePartner={() => setSelectedPharmacy(null)}
              />
            )}

            {/* Laboratory Selector - Show only if no laboratory suggested */}
            {!suggestedLaboratory && (
              <PartnerSelector
                ref={laboratoryRef}
                title="اقتراح معمل"
                subtitle="اختر معمل من المعامل المتاحة"
                icon={FaFlask}
                gradient="from-blue-50 to-cyan-50"
                iconBg="bg-blue-500"
                searchBorder="border-blue-200"
                focusBorder="focus:border-blue-400"
                focusRing="focus:ring-blue-100"
                hoverBg="hover:bg-blue-50"
                dropdownBorder="border-blue-200"
                selectedBorder="border-blue-300"
                emptyBorder="border-blue-300"
                emptyColor="text-blue-300"
                searchValue={searchLaboratory}
                onSearchChange={(e) => {
                  setSearchLaboratory(e.target.value);
                  setShowLaboratoryDropdown(true);
                  setLaboratoryDisplayCount(5); // Reset count on search
                }}
                onSearchFocus={() => setShowLaboratoryDropdown(true)}
                showDropdown={showLaboratoryDropdown}
                filteredPartners={filteredLaboratories}
                displayCount={laboratoryDisplayCount}
                onLoadMore={() => setLaboratoryDisplayCount(prev => prev + 5)}
                onSelectPartner={(p) => {
                  setSelectedLaboratory(p);
                  setSearchLaboratory('');
                  setShowLaboratoryDropdown(false);
                  setLaboratoryDisplayCount(5);
                }}
                selectedPartner={selectedLaboratory}
                onRemovePartner={() => setSelectedLaboratory(null)}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// ==================== Sub-Components ====================

/**
 * PartnerCard - Display suggested partner with remove button
 */
const PartnerCard = ({ partner, icon: Icon, gradient, iconBg, iconColor, borderColor, title, onRemove }) => (
  <div className={`bg-gradient-to-br ${gradient} rounded-2xl p-6 border-2 ${borderColor} relative`}>
    <h4 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
      <Icon className={`w-5 h-5 ${iconColor}`} />
      {title}
    </h4>
    
    {/* Remove Button */}
    <button
      onClick={onRemove}
      className="absolute top-4 left-4 p-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-all duration-200 shadow-md hover:shadow-lg"
      title="إزالة الشراكة"
    >
      <FaTrash className="w-4 h-4" />
    </button>
    
    <div className={`bg-white border-2 ${borderColor} rounded-xl p-5`}>
      <div className="flex items-start gap-4">
        <div className={`w-14 h-14 ${iconBg} rounded-xl flex items-center justify-center flex-shrink-0`}>
          <Icon className={`w-7 h-7 ${iconColor}`} />
        </div>
        <div className="flex-1 min-w-0">
          <h5 className="font-bold text-lg text-slate-800 mb-2">{partner.name}</h5>
          {partner.rating && (
            <div className="flex items-center gap-1 mb-2">
              <FaStar className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-medium text-slate-700">{partner.rating}</span>
            </div>
          )}
          {partner.address && (
            <div className="flex items-center gap-2">
              <FaMapMarkerAlt className="w-4 h-4 text-slate-400" />
              <span className="text-sm text-slate-600">{partner.address}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
);

/**
 * PartnerSelector - Search and select partner
 */
const PartnerSelector = React.forwardRef(({
  title,
  subtitle,
  icon: Icon,
  gradient,
  iconBg,
  searchBorder,
  focusBorder,
  focusRing,
  hoverBg,
  dropdownBorder,
  selectedBorder,
  emptyBorder,
  emptyColor,
  searchValue,
  onSearchChange,
  onSearchFocus,
  showDropdown,
  filteredPartners,
  displayCount,
  onLoadMore,
  onSelectPartner,
  selectedPartner,
  onRemovePartner,
}, ref) => {
  const dropdownRef = useRef(null);
  
  // Handle scroll to load more
  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    // When scrolled to bottom (with 10px threshold)
    if (scrollHeight - scrollTop <= clientHeight + 10) {
      if (displayCount < filteredPartners.length) {
        onLoadMore();
      }
    }
  };
  
  return (
  <div className={`bg-gradient-to-br ${gradient} rounded-2xl p-6 border-2 ${searchBorder}`}>
    {/* Header */}
    <div className="flex items-center gap-3 mb-4">
      <div className={`w-12 h-12 ${iconBg} rounded-xl flex items-center justify-center shadow-lg`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div>
        <h4 className="text-lg font-bold text-slate-800">{title}</h4>
        <p className="text-xs text-slate-600">{subtitle}</p>
      </div>
    </div>

    {/* Search */}
    <div className="relative mb-4" ref={ref}>
      <FaSearch className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 z-10" />
      <input
        type="text"
        value={searchValue}
        onChange={onSearchChange}
        onFocus={onSearchFocus}
        placeholder="ابحث بالاسم أو الموقع"
        className={`w-full pr-10 pl-4 py-3 bg-white border-2 ${searchBorder} rounded-xl ${focusBorder} ${focusRing} transition-all text-sm`}
      />

      {/* Dropdown */}
      {showDropdown && (
        <div 
          ref={dropdownRef}
          onScroll={handleScroll}
          className={`absolute top-full left-0 right-0 mt-2 bg-white border-2 ${dropdownBorder} rounded-xl shadow-xl max-h-64 overflow-y-auto z-20`}
        >
          {filteredPartners.length > 0 ? (
            <>
              {filteredPartners.slice(0, displayCount).map((partner) => (
              <button
                key={partner.id}
                onClick={() => onSelectPartner(partner)}
                className={`w-full px-4 py-3 ${hoverBg} transition-colors text-right border-b ${dropdownBorder} last:border-0`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 ${iconBg.replace('500', '100')} rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5`}>
                    <Icon className={`w-5 h-5 ${iconBg.replace('bg-', 'text-').replace('500', '600')}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-800 text-sm truncate">{partner.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      {partner.rating && (
                        <div className="flex items-center gap-1">
                          <FaStar className="w-3 h-3 text-yellow-500" />
                          <span className="text-xs text-slate-600">{partner.rating}</span>
                        </div>
                      )}
                      {partner.address && (
                        <div className="flex items-center gap-1">
                          <FaMapMarkerAlt className="w-3 h-3 text-slate-400" />
                          <span className="text-xs text-slate-500 truncate">{partner.address}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </button>
              ))}
              
              {/* Load More Button */}
              {displayCount < filteredPartners.length && (
                <button
                  onClick={onLoadMore}
                  className={`w-full px-4 py-3 text-center ${hoverBg} transition-colors border-t-2 ${dropdownBorder} text-sm font-medium text-slate-600`}
                >
                  عرض المزيد ({filteredPartners.length - displayCount} متبقي)
                </button>
              )}
            </>
          ) : (
            <div className="px-4 py-6 text-center text-slate-500">
              <p className="text-sm">لا توجد نتائج</p>
            </div>
          )}
        </div>
      )}
    </div>

    {/* Selected Partner */}
    {selectedPartner ? (
      <div className={`bg-white border-2 ${selectedBorder} rounded-xl p-4`}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className={`w-12 h-12 ${iconBg.replace('500', '100')} rounded-xl flex items-center justify-center flex-shrink-0`}>
              <Icon className={`w-6 h-6 ${iconBg.replace('bg-', 'text-').replace('500', '600')}`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-slate-800 truncate">{selectedPartner.name}</p>
              {selectedPartner.rating && (
                <div className="flex items-center gap-1 mt-1">
                  <FaStar className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm font-medium text-slate-700">{selectedPartner.rating}</span>
                </div>
              )}
              {selectedPartner.address && (
                <div className="flex items-center gap-1 mt-1">
                  <FaMapMarkerAlt className="w-3 h-3 text-slate-400" />
                  <span className="text-xs text-slate-600 truncate">{selectedPartner.address}</span>
                </div>
              )}
            </div>
          </div>
          <button
            onClick={onRemovePartner}
            className="w-8 h-8 bg-red-100 hover:bg-red-200 rounded-lg flex items-center justify-center transition-colors flex-shrink-0"
          >
            <FaTimes className="w-4 h-4 text-red-600" />
          </button>
        </div>
      </div>
    ) : (
      <div className={`bg-white/50 border-2 border-dashed ${emptyBorder} rounded-xl p-6 text-center`}>
        <Icon className={`w-12 h-12 ${emptyColor} mx-auto mb-2`} />
        <p className="text-sm text-slate-500">لم يتم الاختيار بعد</p>
      </div>
    )}
  </div>
  );
});

PartnerSelector.displayName = 'PartnerSelector';

export default PartnerSection;
