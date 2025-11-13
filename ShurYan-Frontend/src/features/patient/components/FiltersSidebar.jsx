import React, { useState } from 'react';
import { FaFilter, FaTimes, FaStar } from 'react-icons/fa';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

/**
 * FiltersSidebar Component - Advanced Filters
 * Professional filters with checkboxes, sliders, and radio buttons
 */
const FiltersSidebar = ({ 
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
  onReset
}) => {
  const specialties = [
    'قلب وأوعية دموية',
    'نساء وتوليد',
    'عظام ومفاصل',
    'أطفال',
    'باطنة',
    'جلدية',
    'أنف وأذن وحنجرة',
    'عيون',
    'أسنان',
    'نفسية',
  ];

  const cities = [
    'القاهرة',
    'الإسكندرية',
    'الجيزة',
    'الشرقية',
    'الدقهلية',
    'البحيرة',
    'المنوفية',
    'القليوبية',
  ];

  const ratingOptions = [
    { value: 0, label: 'الكل' },
    { value: 3, label: '3+ نجوم' },
    { value: 4, label: '4+ نجوم' },
    { value: 4.5, label: '4.5+ نجوم' },
    { value: 5, label: '5 نجوم' },
  ];

  const handleSpecialtyChange = (specialty) => {
    if (selectedSpecialties.includes(specialty)) {
      setSelectedSpecialties(selectedSpecialties.filter(s => s !== specialty));
    } else {
      setSelectedSpecialties([...selectedSpecialties, specialty]);
    }
  };

  const handleCityChange = (city) => {
    if (selectedCities.includes(city)) {
      setSelectedCities(selectedCities.filter(c => c !== city));
    } else {
      setSelectedCities([...selectedCities, city]);
    }
  };

  const activeFiltersCount = 
    selectedSpecialties.length + 
    selectedCities.length + 
    (minRating > 0 ? 1 : 0) + 
    (availableToday ? 1 : 0) +
    ((priceRange[0] !== 0 || priceRange[1] !== 1000) ? 1 : 0);

  return (
    <div className="w-80 bg-white rounded-2xl shadow-lg border-2 border-slate-200 sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-gradient-to-r from-[#00d5be] to-[#00bfaa] px-6 py-4 rounded-t-2xl z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FaFilter className="text-white text-lg" />
            <h3 className="text-white font-black text-lg">الفلاتر</h3>
            {activeFiltersCount > 0 && (
              <span className="bg-white text-[#00d5be] text-xs font-black px-2 py-1 rounded-full">
                {activeFiltersCount}
              </span>
            )}
          </div>
          {activeFiltersCount > 0 && (
            <button
              onClick={onReset}
              className="text-white/90 hover:text-white text-sm font-semibold underline"
            >
              إعادة تعيين
            </button>
          )}
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Available Today Toggle */}
        <div className="pb-6 border-b border-slate-200">
          <label className="flex items-center justify-between cursor-pointer group">
            <span className="text-sm font-bold text-slate-800 group-hover:text-[#00d5be] transition-colors">
              متاح اليوم فقط
            </span>
            <div className="relative">
              <input
                type="checkbox"
                checked={availableToday}
                onChange={(e) => setAvailableToday(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#00d5be]/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00d5be]"></div>
            </div>
          </label>
        </div>

        {/* Price Range Slider */}
        <div className="pb-6 border-b border-slate-200">
          <label className="block text-sm font-bold text-slate-800 mb-3">
            نطاق السعر
          </label>
          <div className="px-2">
            <Slider
              range
              min={0}
              max={1000}
              value={priceRange}
              onChange={setPriceRange}
              trackStyle={[{ backgroundColor: '#00d5be', height: 6 }]}
              handleStyle={[
                { 
                  backgroundColor: '#00d5be', 
                  borderColor: '#00d5be',
                  width: 20,
                  height: 20,
                  marginTop: -7,
                  boxShadow: '0 2px 8px rgba(0, 213, 190, 0.3)'
                },
                { 
                  backgroundColor: '#00d5be', 
                  borderColor: '#00d5be',
                  width: 20,
                  height: 20,
                  marginTop: -7,
                  boxShadow: '0 2px 8px rgba(0, 213, 190, 0.3)'
                }
              ]}
              railStyle={{ backgroundColor: '#e2e8f0', height: 6 }}
            />
            <div className="flex items-center justify-between mt-4">
              <span className="text-sm font-semibold text-slate-600">
                {priceRange[0]} جنيه
              </span>
              <span className="text-sm font-semibold text-slate-600">
                {priceRange[1]} جنيه
              </span>
            </div>
          </div>
        </div>

        {/* Rating Filter */}
        <div className="pb-6 border-b border-slate-200">
          <label className="block text-sm font-bold text-slate-800 mb-3">
            التقييم
          </label>
          <div className="space-y-2">
            {ratingOptions.map((option) => (
              <label
                key={option.value}
                className="flex items-center gap-3 cursor-pointer group"
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
        </div>

        {/* Specialties Checkboxes */}
        <div className="pb-6 border-b border-slate-200">
          <label className="block text-sm font-bold text-slate-800 mb-3">
            التخصص ({selectedSpecialties.length})
          </label>
          <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
            {specialties.map((specialty) => (
              <label
                key={specialty}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={selectedSpecialties.includes(specialty)}
                  onChange={() => handleSpecialtyChange(specialty)}
                  className="w-4 h-4 text-[#00d5be] border-slate-300 rounded focus:ring-[#00d5be]/20 focus:ring-2"
                />
                <span className="text-sm font-medium text-slate-700 group-hover:text-[#00d5be] transition-colors">
                  {specialty}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Cities Checkboxes */}
        <div>
          <label className="block text-sm font-bold text-slate-800 mb-3">
            المدينة ({selectedCities.length})
          </label>
          <div className="space-y-2">
            {cities.map((city) => (
              <label
                key={city}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={selectedCities.includes(city)}
                  onChange={() => handleCityChange(city)}
                  className="w-4 h-4 text-[#00d5be] border-slate-300 rounded focus:ring-[#00d5be]/20 focus:ring-2"
                />
                <span className="text-sm font-medium text-slate-700 group-hover:text-[#00d5be] transition-colors">
                  {city}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FiltersSidebar;
