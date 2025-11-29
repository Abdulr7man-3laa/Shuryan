import React, { useState, useRef, useEffect } from 'react';
import { FaFilter, FaChevronDown, FaTimes, FaStar, FaClock } from 'react-icons/fa';
import { SPECIALTIES, getSpecialtyById, GOVERNORATES } from '@/utils/constants';
import PriceSlider from './PriceSlider';

/**
 * FilterChips Component - Modern filter chips with popups
 */
const FilterChips = ({
  selectedSpecialties,
  setSelectedSpecialties,
  selectedCities,
  setSelectedCities,
  priceRange,
  setPriceRange,
  minRating,
  setMinRating,
  availableToday,
  setAvailableToday,
  onReset,
  resultsCount
}) => {
  const [openFilter, setOpenFilter] = useState(null);
  const popupRef = useRef(null);

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setOpenFilter(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const ratingOptions = [
    { value: 0, label: 'الكل' },
    { value: 3, label: '3+' },
    { value: 4, label: '4+' },
    { value: 4.5, label: '4.5+' },
    { value: 5, label: '5' },
  ];

  const handleSpecialtyChange = (specialtyId) => {
    if (selectedSpecialties.includes(specialtyId)) {
      setSelectedSpecialties(selectedSpecialties.filter(s => s !== specialtyId));
    } else {
      setSelectedSpecialties([...selectedSpecialties, specialtyId]);
    }
  };

  const handleGovernorateChange = (governorateId) => {
    if (selectedCities.includes(governorateId)) {
      setSelectedCities(selectedCities.filter(g => g !== governorateId));
    } else {
      setSelectedCities([...selectedCities, governorateId]);
    }
  };

  const activeFiltersCount =
    selectedSpecialties.length +
    selectedCities.length +
    (minRating > 0 ? 1 : 0) +
    (priceRange[0] > 0 || priceRange[1] < 1000 ? 1 : 0) +
    (availableToday ? 1 : 0);

  // Get specialty name by ID for display
  const getSpecialtyName = (id) => getSpecialtyById(id)?.name || 'غير محدد';

  const FilterChip = ({ label, icon, count, onClick, isActive }) => (
    <button
      onClick={onClick}
      className={`
        relative flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm
        transition-all duration-200 shadow-sm hover:shadow-md
        ${isActive
          ? 'bg-[#00d5be] text-white border-2 border-[#00d5be]'
          : 'bg-white text-slate-700 border-2 border-slate-200 hover:border-[#00d5be]/50'
        }
      `}
    >
      {icon}
      <span>{label}</span>
      {count > 0 && (
        <span className={`
          px-2 py-0.5 rounded-full text-xs font-black
          ${isActive ? 'bg-white text-[#00d5be]' : 'bg-[#00d5be] text-white'}
        `}>
          {count}
        </span>
      )}
      <FaChevronDown className={`text-xs transition-transform ${openFilter === label ? 'rotate-180' : ''}`} />
    </button>
  );

  const FilterPopup = ({ children, isOpen }) => {
    if (!isOpen) return null;

    return (
      <div
        ref={popupRef}
        className="absolute top-full mt-2 bg-white rounded-2xl shadow-2xl border-2 border-slate-200 p-4 z-50 min-w-[280px] max-h-[400px] overflow-y-auto"
      >
        {children}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Filter Chips Row - Centered */}
      <div className="flex items-center justify-center gap-3 flex-wrap">

        {/* Specialty Filter */}
        <div className="relative">
          <FilterChip
            label="التخصص"
            icon={<FaFilter className="text-xs" />}
            count={selectedSpecialties.length}
            onClick={() => setOpenFilter(openFilter === 'specialty' ? null : 'specialty')}
            isActive={selectedSpecialties.length > 0}
          />
          <FilterPopup isOpen={openFilter === 'specialty'}>
            <h4 className="font-black text-slate-800 mb-3">اختر التخصص</h4>
            <div className="max-h-64 overflow-y-auto">
              {SPECIALTIES.map((specialty) => (
                <label
                  key={specialty.id}
                  className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedSpecialties.includes(specialty.id)}
                    onChange={() => handleSpecialtyChange(specialty.id)}
                    className="w-4 h-4 text-[#00d5be] border-slate-300 rounded focus:ring-[#00d5be]"
                  />
                  <span className="text-sm text-slate-700">{specialty.name}</span>
                </label>
              ))}
            </div>
          </FilterPopup>
        </div>

        {/* City Filter */}
        <div className="relative">
          <FilterChip
            label="المدينة"
            icon={<FaFilter className="text-xs" />}
            count={selectedCities.length}
            onClick={() => setOpenFilter(openFilter === 'city' ? null : 'city')}
            isActive={selectedCities.length > 0}
          />
          <FilterPopup isOpen={openFilter === 'city'}>
            <h4 className="font-black text-slate-800 mb-3">اختر المحافظة</h4>
            <div className="space-y-2">
              {GOVERNORATES.map((governorate) => (
                <label
                  key={governorate.id}
                  className="flex items-center gap-3 cursor-pointer group p-2 hover:bg-slate-50 rounded-lg transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedCities.includes(governorate.id)}
                    onChange={() => handleGovernorateChange(governorate.id)}
                    className="w-4 h-4 text-[#00d5be] border-slate-300 rounded focus:ring-[#00d5be]/20 focus:ring-2"
                  />
                  <span className="text-sm font-medium text-slate-700 group-hover:text-[#00d5be] transition-colors">
                    {governorate.name}
                  </span>
                </label>
              ))}
            </div>
          </FilterPopup>
        </div>

        {/* Price Filter */}
        <div className="relative">
          <FilterChip
            label="السعر"
            icon={<FaFilter className="text-xs" />}
            count={priceRange[0] !== 0 || priceRange[1] !== 1000 ? 1 : 0}
            onClick={() => setOpenFilter(openFilter === 'price' ? null : 'price')}
            isActive={priceRange[0] !== 0 || priceRange[1] !== 1000}
          />
          <FilterPopup isOpen={openFilter === 'price'}>
            <h4 className="font-black text-slate-800 mb-4">نطاق السعر</h4>
            <PriceSlider
              value={priceRange}
              onChange={setPriceRange}
              min={0}
              max={1000}
              debounceMs={800}
            />
          </FilterPopup>
        </div>

        {/* Rating Filter */}
        <div className="relative">
          <FilterChip
            label="التقييم"
            icon={<FaStar className="text-xs" />}
            count={minRating > 0 ? 1 : 0}
            onClick={() => setOpenFilter(openFilter === 'rating' ? null : 'rating')}
            isActive={minRating > 0}
          />
          <FilterPopup isOpen={openFilter === 'rating'}>
            <h4 className="font-black text-slate-800 mb-3">الحد الأدنى للتقييم</h4>
            <div className="space-y-2">
              {ratingOptions.map((option) => (
                <label
                  key={option.value}
                  className="flex items-center gap-3 cursor-pointer group p-2 hover:bg-slate-50 rounded-lg transition-colors"
                >
                  <input
                    type="radio"
                    name="rating"
                    checked={minRating === option.value}
                    onChange={() => setMinRating(option.value)}
                    className="w-4 h-4 text-[#00d5be] border-slate-300 focus:ring-[#00d5be]/20 focus:ring-2"
                  />
                  <span className="text-sm font-medium text-slate-700 group-hover:text-[#00d5be] transition-colors flex items-center gap-1">
                    {option.label}
                    {option.value > 0 && <FaStar className="text-amber-500 text-xs" />}
                  </span>
                </label>
              ))}
            </div>
          </FilterPopup>
        </div>

        {/* Available Today Toggle */}
        <button
          onClick={() => setAvailableToday(!availableToday)}
          className={`
            flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm
            transition-all duration-200 shadow-sm hover:shadow-md
            ${availableToday
              ? 'bg-[#00d5be] text-white border-2 border-[#00d5be]'
              : 'bg-white text-slate-700 border-2 border-slate-200 hover:border-[#00d5be]/50'
            }
          `}
        >
          <FaClock className="text-xs" />
          <span>متاح اليوم</span>
          {availableToday && (
            <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">✓</span>
          )}
        </button>

        {/* Reset Button */}
        {
          activeFiltersCount > 0 && (
            <button
              onClick={onReset}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm bg-slate-100 text-slate-700 hover:bg-slate-200 border-2 border-slate-200 transition-all duration-200"
            >
              <FaTimes className="text-xs" />
              <span>إعادة تعيين ({activeFiltersCount})</span>
            </button>
          )
        }
      </div >
    </div >
  );
};

export default FilterChips;
