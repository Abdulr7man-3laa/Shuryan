/**
 * DoctorDetailsModal Component
 * Premium popup showing complete doctor information including clinic, services, photos
 */

import { useEffect, useState } from 'react';
import { FaTimes, FaStar, FaMapMarkerAlt, FaPhone, FaClock, FaBriefcaseMedical, FaImages, FaWhatsapp, FaComments } from 'react-icons/fa';
import { useDoctors } from '../hooks/useDoctors';
import { getSpecialtyById } from '@/utils/constants';
import DoctorReviewsModal from './DoctorReviewsModal';

const DoctorDetailsModal = ({ doctorId, isOpen, onClose, onBook }) => {
  const { fetchDoctorDetails, loading } = useDoctors({ autoFetch: false });
  const [doctor, setDoctor] = useState(null);
  const [showReviews, setShowReviews] = useState(false);

  useEffect(() => {
    if (isOpen && doctorId) {
      fetchDoctorDetails(doctorId).then((data) => {
        setDoctor(data);
      });
    }
  }, [isOpen, doctorId]);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Format phone type
  const formatPhoneType = (type) => {
    const types = {
      'موبايل': 'موبايل',
      'واتساب': 'واتساب',
      'خط ارضي': 'خط أرضي',
    };
    return types[type] || type;
  };

  // Get phone icon
  const getPhoneIcon = (type) => {
    if (type === 'واتساب') return <FaWhatsapp className="text-green-500" />;
    return <FaPhone className="text-teal-500" />;
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#00d5be] to-[#00a896] p-8 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 left-4 w-10 h-10 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-full transition-all hover:scale-110"
          >
            <FaTimes className="text-lg" />
          </button>
          
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block w-10 h-10 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
              <p className="mt-3 text-lg font-semibold">جاري التحميل...</p>
            </div>
          ) : doctor ? (
            <div className="flex items-start gap-6">
              {/* Profile Image */}
              {doctor.profileImageUrl ? (
                <img
                  src={doctor.profileImageUrl}
                  alt={doctor.fullName}
                  className="w-28 h-28 rounded-2xl object-cover border-4 border-white shadow-xl"
                />
              ) : (
                <div className="w-28 h-28 rounded-2xl bg-white/20 flex items-center justify-center text-5xl font-black border-4 border-white shadow-xl">
                  {doctor.fullName?.charAt(doctor.fullName.indexOf(' ') + 1) || 'د'}
                </div>
              )}

              {/* Doctor Info */}
              <div className="flex-1">
                <h2 className="text-3xl font-black mb-2">{doctor.fullName}</h2>
                
                {/* Specialty & Experience in one line */}
                <div className="flex items-center gap-3 mb-3 flex-wrap">
                  <p className="text-lg font-bold text-white/95">
                    {doctor.medicalSpecialty 
                      ? getSpecialtyById(doctor.medicalSpecialty)?.name 
                      : doctor.medicalSpecialtyName || 'تخصص غير محدد'}
                  </p>
                  {doctor.yearsOfExperience && (
                    <>
                      <span className="text-white/60">•</span>
                      <div className="flex items-center gap-1.5 bg-white/20 px-3 py-1 rounded-lg">
                        <FaBriefcaseMedical className="text-sm" />
                        <span className="font-semibold text-sm">{doctor.yearsOfExperience} سنة خبرة</span>
                      </div>
                    </>
                  )}
                </div>
                
                {/* Rating & Reviews Button */}
                <div className="flex items-center gap-3 mb-3 flex-wrap">
                  {doctor.averageRating && (
                    <div className="flex items-center gap-2 bg-white/20 px-3 py-1.5 rounded-lg">
                      <FaStar className="text-amber-300" />
                      <span className="font-bold">{doctor.averageRating.toFixed(1)}</span>
                      <span className="text-sm text-white/90">({doctor.totalReviews} تقييم)</span>
                    </div>
                  )}
                  
                  {/* Reviews Button */}
                  {doctor.totalReviews > 0 && (
                    <button
                      onClick={() => setShowReviews(true)}
                      className="flex items-center gap-2 bg-white text-teal-600 px-4 py-1.5 rounded-lg font-bold hover:bg-white/90 transition-all hover:scale-105 shadow-lg"
                    >
                      <FaComments className="text-lg" />
                      <span>آراء المرضى</span>
                    </button>
                  )}
                </div>

                {/* Biography */}
                {doctor.biography && (
                  <p className="text-white/90 leading-relaxed text-xl mt-2">{doctor.biography}</p>
                )}
              </div>
            </div>
          ) : null}
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-block w-12 h-12 border-4 border-slate-200 border-t-teal-500 rounded-full animate-spin"></div>
            </div>
          ) : doctor ? (
            <div className="p-6 space-y-6">
              {/* Clinic Info */}
              {doctor.clinic && (
                <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-6 border border-slate-200">
                  <h3 className="text-2xl font-black text-slate-800 mb-5 flex items-center gap-2">
                    <div className="w-10 h-10 bg-[#00d5be] rounded-xl flex items-center justify-center">
                      <FaBriefcaseMedical className="text-white text-lg" />
                    </div>
                    معلومات العيادة
                  </h3>
                  
                  <div className="space-y-5">
                    {/* Clinic Name & Address - Side by Side */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Clinic Name */}
                      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                        <p className="text-xs font-bold text-[#00d5be] mb-2 uppercase tracking-wide">اسم العيادة</p>
                        <p className="text-lg font-black text-slate-800">{doctor.clinic.name}</p>
                      </div>

                      {/* Address */}
                      {doctor.clinic.address && (
                        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <div className="flex-1">
                              <p className="text-xs font-bold text-[#00d5be] mb-2 uppercase tracking-wide flex items-center gap-1.5">
                                <FaMapMarkerAlt className="text-sm" />
                                العنوان
                              </p>
                              <p className="text-sm font-semibold text-slate-700 leading-relaxed">
                                {doctor.clinic.address.street}
                                {doctor.clinic.address.buildingNumber && `, مبنى ${doctor.clinic.address.buildingNumber}`}
                                <br />
                                <span className="text-slate-600">{doctor.clinic.address.city}، {doctor.clinic.address.governorate}</span>
                              </p>
                            </div>
                            {/* Location Button */}
                            {doctor.clinic.address.latitude && doctor.clinic.address.longitude && (
                              <a
                                href={`https://www.google.com/maps?q=${doctor.clinic.address.latitude},${doctor.clinic.address.longitude}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-shrink-0 inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#00d5be] to-[#00a896] text-white rounded-lg font-bold text-sm hover:from-[#00a896] hover:to-[#008577] transition-all shadow-sm hover:shadow-md"
                              >
                                <FaMapMarkerAlt className="text-sm" />
                                Location
                              </a>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Phone Numbers - Single Row */}
                    {doctor.clinic.phoneNumbers && doctor.clinic.phoneNumbers.length > 0 && (
                      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                        <p className="text-xs font-bold text-[#00d5be] mb-3 uppercase tracking-wide flex items-center gap-1.5">
                          <FaPhone className="text-sm" />
                          أرقام التواصل
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          {doctor.clinic.phoneNumbers.map((phone) => (
                            <div
                              key={phone.id}
                              className="flex items-center gap-2 bg-gradient-to-r from-slate-50 to-slate-100 p-3 rounded-lg border border-slate-200"
                            >
                              <div className="flex-shrink-0">
                                {getPhoneIcon(phone.type)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs text-slate-500 font-semibold mb-0.5">{formatPhoneType(phone.type)}</p>
                                <p className="font-bold text-slate-800 text-sm direction-ltr truncate">
                                  {phone.number}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Offered Services */}
                    {doctor.clinic.offeredServices && doctor.clinic.offeredServices.length > 0 && (
                      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                        <p className="text-xs font-bold text-[#00d5be] mb-3 uppercase tracking-wide">الخدمات المتوفرة</p>
                        <div className="flex flex-wrap gap-2">
                          {doctor.clinic.offeredServices.map((service) => (
                            <span
                              key={service.id}
                              className="bg-gradient-to-r from-[#00d5be]/10 to-[#00a896]/10 text-[#00a896] border border-[#00d5be]/30 px-4 py-2 rounded-lg font-bold text-sm"
                            >
                              {service.serviceName}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Clinic Photos */}
              {doctor.clinic?.photos && doctor.clinic.photos.length > 0 && (
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
                  
                  {/* Photos Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                    {doctor.clinic.photos.map((photo, index) => (
                      <div
                        key={photo.id}
                        className="relative rounded-xl overflow-hidden aspect-square bg-white border-2 border-purple-200 shadow-sm hover:shadow-md transition-all"
                      >
                        <img
                          src={photo.photoUrl}
                          alt={`صورة العيادة ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Partner Suggestions */}
              {doctor.partnerSuggestions && (
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200">
                  <h3 className="text-2xl font-black text-slate-800 mb-5 flex items-center gap-2">
                    <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
                      <FaBriefcaseMedical className="text-white text-lg" />
                    </div>
                    الشركاء المقترحون
                  </h3>
                  <div className="bg-white rounded-xl p-5 border border-amber-200 shadow-sm">
                    <p className="text-slate-700 font-semibold">
                      {doctor.partnerSuggestions.name || 'لا توجد اقتراحات حالياً'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-12 text-center">
              <div className="inline-block w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <FaTimes className="text-red-500 text-2xl" />
              </div>
              <p className="text-slate-600 font-semibold">حدث خطأ في تحميل البيانات</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-6 py-2 bg-[#00d5be] text-white rounded-lg font-bold hover:bg-[#00a896] transition-colors"
              >
                إعادة المحاولة
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t-2 border-slate-200 p-6 bg-gradient-to-r from-slate-50 to-slate-100 flex justify-between items-center">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-white border-2 border-slate-300 text-slate-700 rounded-xl font-bold hover:bg-slate-100 hover:border-slate-400 transition-all"
          >
            إغلاق
          </button>
          
          {doctor && (
            <button 
              onClick={() => {
                onBook(doctor);
                onClose();
              }}
              className="px-8 py-3 bg-gradient-to-r from-[#00d5be] to-[#00a896] text-white rounded-xl font-black hover:from-[#00a896] hover:to-[#008577] transition-all shadow-lg hover:shadow-xl hover:scale-105"
            >
              احجز موعد الآن
            </button>
          )}
        </div>
      </div>

      {/* Reviews Modal */}
      {doctor && (
        <DoctorReviewsModal
          doctorId={doctorId}
          doctorName={doctor.fullName}
          isOpen={showReviews}
          onClose={() => setShowReviews(false)}
        />
      )}
    </div>
  );
};

export default DoctorDetailsModal;
