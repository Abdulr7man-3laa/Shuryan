/**
 * DoctorCard Component - Premium Luxury Design
 * Displays doctor in premium card with glow effects and smooth animations
 */

import { FaStar, FaMapMarkerAlt, FaMoneyBillWave, FaCalendarAlt } from 'react-icons/fa';
import { getSpecialtyById } from '@/utils/constants';

const DoctorCard = ({ doctor, onViewProfile, onBook }) => {
  const {
    id,
    fullName,
    medicalSpecialtyName,
    medicalSpecialty,
    profileImageUrl,
    averageRating,
    regularConsultationFee,
    governorate,
    city,
    nextAvailableSlot,
  } = doctor;

  // Get specialty name - prefer number over string (Backend bug workaround)
  const specialtyName = medicalSpecialty 
    ? getSpecialtyById(medicalSpecialty)?.name 
    : medicalSpecialtyName || 'تخصص غير محدد';

  // Format next available slot with time
  const formatAvailableSlot = (slot) => {
    if (!slot) return 'أقرب موعد: غير متاح';
    
    // Parse the date string properly
    const date = new Date(slot);
    
    // Get today and tomorrow in local timezone
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const slotDate = new Date(date);
    slotDate.setHours(0, 0, 0, 0);

    // Format time in 12-hour format
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const period = hours >= 12 ? 'م' : 'ص';
    const hours12 = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
    const timeStr = `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;

    if (slotDate.getTime() === today.getTime()) {
      return `أقرب موعد: اليوم ${timeStr}`;
    } else if (slotDate.getTime() === tomorrow.getTime()) {
      return `أقرب موعد: غداً ${timeStr}`;
    } else {
      const dateStr = date.toLocaleDateString('ar-EG', {
        day: 'numeric',
        month: 'short',
      });
      return `أقرب موعد: ${dateStr} ${timeStr}`;
    }
  };

  return (
    <div className="group relative bg-gradient-to-br from-white via-white to-slate-50/30 rounded-3xl border-2 border-slate-200/60 hover:border-[#00d5be] p-7 transition-all duration-500 hover:shadow-[0_20px_60px_-15px_rgba(0,213,190,0.3)] shadow-lg overflow-hidden hover:-translate-y-2 cursor-pointer">
      {/* Background glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#00d5be]/0 to-[#00d5be]/0 group-hover:from-[#00d5be]/5 group-hover:to-[#00bda8]/5 transition-all duration-500 rounded-3xl"></div>
      
      <div className="relative flex items-start gap-7">
        {/* Avatar - Right Side */}
        <div className="relative flex-shrink-0">
          {/* Glow effect behind image */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#00d5be]/30 to-[#00bda8]/30 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 group-hover:blur-2xl transition-all duration-500"></div>
          
          {profileImageUrl ? (
            <img
              src={profileImageUrl}
              alt={fullName}
              className="relative w-32 h-32 rounded-3xl object-cover ring-4 ring-white shadow-xl group-hover:scale-110 group-hover:ring-[#00d5be]/30 transition-all duration-500"
            />
          ) : (
            <div className="relative w-32 h-32 rounded-3xl bg-gradient-to-br from-[#00d5be] to-[#00bda8] flex items-center justify-center text-white text-4xl font-black ring-4 ring-white shadow-xl group-hover:scale-110 group-hover:ring-[#00d5be]/30 transition-all duration-500">
              {fullName?.charAt(fullName.indexOf(' ') + 1) || 'د'}
            </div>
          )}
        </div>

        {/* Main Content - Center */}
        <div className="flex-1 min-w-0">
          {/* Header: Name & Rating */}
          <div className="flex items-center gap-3 mb-3">
            <h3 className="text-2xl font-black text-slate-900 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-[#00d5be] group-hover:to-[#00bda8] group-hover:bg-clip-text transition-all duration-300">
              {fullName}
            </h3>
            {/* Rating Badge */}
            {averageRating ? (
              <div className="flex items-center gap-2 bg-gradient-to-r from-amber-50 to-orange-50 px-3 py-1.5 rounded-xl border border-amber-200/50 shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all duration-300">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <FaStar 
                      key={i} 
                      className={`text-sm drop-shadow-sm transition-colors duration-300 ${
                        i < Math.floor(averageRating) 
                          ? 'text-amber-400 group-hover:text-amber-500' 
                          : 'text-amber-200'
                      }`} 
                    />
                  ))}
                </div>
                <span className="text-sm font-black text-slate-800">
                  {averageRating.toFixed(1)}
                </span>
              </div>
            ) : (
              <span className="text-xs text-slate-400 bg-slate-100 px-3 py-1.5 rounded-lg">لا توجد تقييمات</span>
            )}
          </div>

          {/* Specialty, Location - Single Row */}
          <div className="flex items-center gap-3 mb-3">
            {/* Specialty */}
            <span className="text-sm font-bold text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg group-hover:bg-slate-100 transition-colors duration-300">
              {specialtyName}
            </span>
            
            {/* Divider */}
            <div className="w-px h-5 bg-slate-300"></div>
            
            {/* Location */}
            <div className="flex items-center gap-1.5 group-hover:scale-105 transition-transform duration-300">
              <div className="w-7 h-7 bg-rose-100 rounded-lg flex items-center justify-center group-hover:bg-rose-200 transition-colors duration-300">
                <FaMapMarkerAlt className="text-rose-600 text-xs" />
              </div>
              <span className="text-sm font-semibold text-slate-700">
                {city && governorate ? `${city} - ${governorate}` : city || governorate || 'الموقع غير محدد'}
              </span>
            </div>
          </div>

          {/* Appointment & Price - Single Row */}
          <div className="flex items-center gap-3">
            {/* Appointment */}
            <div className="flex items-center gap-2 bg-gradient-to-r from-blue-50 to-blue-100/50 px-3 py-2 rounded-xl border border-blue-200/50 shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all duration-300">
              <div className="w-7 h-7 bg-blue-500 rounded-lg flex items-center justify-center shadow-md group-hover:bg-blue-600 transition-colors duration-300">
                <FaCalendarAlt className="text-white text-xs" />
              </div>
              <span className="text-sm font-semibold text-blue-900">
                {formatAvailableSlot(nextAvailableSlot)}
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-2 bg-gradient-to-r from-emerald-50 to-teal-50 px-4 py-2 rounded-xl border border-emerald-200/50 shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all duration-300">
              <div className="w-7 h-7 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center shadow-md group-hover:from-emerald-600 group-hover:to-teal-700 transition-all duration-300">
                <FaMoneyBillWave className="text-white text-xs" />
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-black text-emerald-900">{regularConsultationFee || 0}</span>
                <span className="text-xs font-bold text-emerald-700">جنيه</span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions - Left Side */}
        <div className="flex flex-col gap-3 flex-shrink-0">
          {/* Book Button */}
          <button 
            onClick={() => onBook(doctor)}
            className="relative px-9 py-3.5 bg-gradient-to-r from-[#00d5be] via-[#00c9b5] to-[#00bda8] hover:from-[#00c9b5] hover:via-[#00bda8] hover:to-[#00b199] text-white rounded-2xl transition-all duration-300 font-black text-base shadow-xl hover:shadow-2xl hover:scale-105 overflow-hidden group/btn"
          >
            <span className="relative z-10">احجز الان</span>
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-full group-hover/btn:translate-x-[-100%] transition-transform duration-700"></div>
          </button>
          
          {/* View Profile Button */}
          <button 
            onClick={() => onViewProfile(id)}
            className="px-9 py-3.5 bg-white hover:bg-gradient-to-r hover:from-slate-50 hover:to-white text-slate-700 hover:text-[#00d5be] border-2 border-slate-200 hover:border-[#00d5be] rounded-2xl transition-all duration-300 font-black text-base shadow-lg hover:shadow-xl hover:scale-105"
          >
            عرض الملف الشخصي
          </button>
        </div>
      </div>
    </div>
  );
};

export default DoctorCard;
