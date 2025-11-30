const ServicesSection = () => {
  const services = [
    {
      id: 1,
      title: 'بحث سهل وحجز فوري',
      description: 'اعثر على نخبة الأطباء في مختلف التخصصات واحجز موعدك بضغطة زر، لتجربة طبية أسرع وأكثر سلاسة.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      gradient: 'from-teal-400 via-cyan-500 to-blue-500',
      bgGradient: 'from-teal-50 to-cyan-50',
      iconBg: 'bg-gradient-to-br from-teal-400 to-cyan-500',
      badge: 'الأكثر استخداماً',
      badgeColor: 'bg-teal-500'
    },
    {
      id: 2,
      title: 'ملفك الطبي الرقمي',
      description: 'احتفظ بتاريخك الصحي، نتائج تحاليلك، ووصفاتك الطبية في مكان واحد آمن، يسهل الوصول إليه في أي وقت.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
      ),
      gradient: 'from-purple-400 via-pink-500 to-rose-500',
      bgGradient: 'from-purple-50 to-pink-50',
      iconBg: 'bg-gradient-to-br from-purple-400 to-pink-500',
      badge: 'آمن ومشفر',
      badgeColor: 'bg-purple-500'
    },
    {
      id: 3,
      title: 'صيدلية إلكترونية متكاملة',
      description: 'اطلب دوائك بسهولة من خلال التطبيق ليصلك في أسرع وقت. خدمة توصيل آمنة تضمن راحتك وخصوصيتك.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
        </svg>
      ),
      gradient: 'from-emerald-400 via-green-500 to-teal-500',
      bgGradient: 'from-emerald-50 to-green-50',
      iconBg: 'bg-gradient-to-br from-emerald-400 to-green-500',
      badge: 'توصيل سريع',
      badgeColor: 'bg-emerald-500'
    },
    {
      id: 4,
      title: 'خدمات التحاليل المتكاملة',
      description: 'اختر أفضل المعامل، أو اطلب زيارة منزلية لسحب العينات بسهولة، وتابع نتائجك أونلاين.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      ),
      gradient: 'from-orange-400 via-amber-500 to-yellow-500',
      bgGradient: 'from-orange-50 to-amber-50',
      iconBg: 'bg-gradient-to-br from-orange-400 to-amber-500',
      badge: 'زيارات منزلية',
      badgeColor: 'bg-orange-500'
    }
  ];

  return (
    <section id="services" className="py-24 bg-gradient-to-b from-white via-gray-50 to-white w-full overflow-hidden">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Enhanced Header */}
        <div className="text-center mb-20">
          <div className="inline-block mb-5">
            <span className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white text-sm font-bold px-5 py-2.5 rounded-full shadow-lg">
              خدمات صحية شاملة
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
            خدمات <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500">شُريان</span> الصحية المتكاملة
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto text-lg md:text-xl leading-relaxed">
            نقدم لك منظومة رعاية صحية متكاملة تبدأ من لحظة شعورك بالتعب وحتى وصول الدواء إليك، 
            <span className="font-semibold text-gray-800"> كل ذلك وأنت في مكانك</span>.
          </p>
        </div>
        
        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-6xl mx-auto mb-16">
          {services.map((service, index) => (
            <div 
              key={service.id} 
              className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Background Gradient Overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br ${service.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
              
              {/* Badge */}
              <div className="absolute top-4 left-4 z-10">
                <span className={`${service.badgeColor} text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md`}>
                  {service.badge}
                </span>
              </div>

              {/* Content */}
              <div className="relative z-10 p-8 md:p-10 flex flex-col h-full">
                {/* Icon Circle */}
                <div className="mb-8">
                  <div className={`${service.iconBg} w-20 h-20 rounded-2xl flex items-center justify-center shadow-xl group-hover:shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 mx-auto`}>
                    <div className="text-white group-hover:scale-110 transition-transform duration-300">
                      {service.icon}
                    </div>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-4 text-center group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-gray-900 group-hover:to-gray-700 transition-all duration-300">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 text-base md:text-lg text-right leading-relaxed flex-grow group-hover:text-gray-700 transition-colors duration-300">
                  {service.description}
                </p>

                {/* Action Link */}
                <div className="mt-6 flex justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                  <button className={`${service.iconBg} text-white font-bold px-6 py-3 rounded-full text-sm shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2`}>
                    <span>اعرف المزيد</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Decorative Element */}
              <div className={`absolute -bottom-10 -right-10 w-40 h-40 bg-gradient-to-br ${service.gradient} rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-700`}></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
