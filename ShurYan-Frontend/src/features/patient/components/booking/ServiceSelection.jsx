import React from 'react';
import {
  FaStethoscope,
  FaRedoAlt,
  FaClock,
  FaMoneyBillWave,
  FaCheckCircle,
} from 'react-icons/fa';

/**
 * ServiceSelection - Step 1: Choose consultation type
 */
const ServiceSelection = ({ services, selectedService, onSelectService }) => {
  if (!services) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-teal-600 border-t-transparent"></div>
        <p className="mt-4 text-slate-600">جاري تحميل الخدمات...</p>
      </div>
    );
  }

  const serviceCards = [
    {
      id: 'regular',
      name: 'كشف جديد',
      icon: FaStethoscope,
      gradient: 'from-teal-500 to-emerald-500',
      price: services.regularCheckup?.price || 0,
      duration: services.regularCheckup?.duration || 0,
      description: 'كشف طبي كامل مع الفحص والتشخيص',
      features: ['فحص طبي شامل', 'تشخيص دقيق', 'خطة علاجية'],
    },
    {
      id: 'reExam',
      name: 'كشف متابعة',
      icon: FaRedoAlt,
      gradient: 'from-blue-500 to-indigo-500',
      price: services.reExamination?.price || 0,
      duration: services.reExamination?.duration || 0,
      description: 'متابعة حالة سابقة أو تقييم العلاج',
      features: ['متابعة الحالة', 'تقييم التحسن', 'تعديل العلاج'],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">
          اختر نوع الكشف
        </h2>
        <p className="text-slate-600">حدد نوع الاستشارة المناسب لحالتك</p>
      </div>

      {/* Service Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {serviceCards.map((service) => (
          <div
            key={service.id}
            onClick={() => onSelectService(service.id)}
            className={`
              relative overflow-hidden rounded-2xl border-2 transition-all duration-300 cursor-pointer
              ${
                selectedService === service.id
                  ? 'border-teal-500 shadow-xl shadow-teal-500/20 scale-105'
                  : 'border-slate-200 hover:border-teal-300 hover:shadow-lg'
              }
            `}
          >
            {/* Selected Badge */}
            {selectedService === service.id && (
              <div className="absolute top-4 left-4 z-10">
                <div className="flex items-center gap-1.5 bg-white rounded-full px-3 py-1.5 shadow-lg">
                  <FaCheckCircle className="text-teal-500 text-sm" />
                  <span className="text-xs font-bold text-teal-600">محدد</span>
                </div>
              </div>
            )}

            {/* Gradient Header */}
            <div className={`bg-gradient-to-br ${service.gradient} p-6 text-white`}>
              <div className="flex items-center gap-4">
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                  <service.icon className="text-3xl" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">{service.name}</h3>
                  <p className="text-sm text-white/90 mt-1">
                    {service.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 bg-white">
              {/* Price & Duration */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-3 bg-slate-50 rounded-xl p-4">
                  <div className="bg-teal-100 rounded-lg p-2.5">
                    <FaMoneyBillWave className="text-teal-600 text-lg" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">السعر</p>
                    <p className="text-lg font-bold text-slate-800">
                      {service.price} جنيه
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-slate-50 rounded-xl p-4">
                  <div className="bg-blue-100 rounded-lg p-2.5">
                    <FaClock className="text-blue-600 text-lg" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">المدة</p>
                    <p className="text-lg font-bold text-slate-800">
                      {service.duration} دقيقة
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Hover Effect Border */}
            <div
              className={`
                absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-300
                ${selectedService === service.id ? 'opacity-100' : 'opacity-0'}
              `}
              style={{
                background: `linear-gradient(135deg, transparent 0%, rgba(20, 184, 166, 0.1) 100%)`,
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceSelection;
