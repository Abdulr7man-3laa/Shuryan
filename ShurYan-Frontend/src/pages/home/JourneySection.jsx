const JourneySection = () => {
  const steps = [
    {
      id: 1,
      title: 'ابحث',
      description: 'ابحث عن طبيبك بالتخصص، المنطقة أو حتى بالاسم بكل سهولة.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
      gradient: 'from-teal-400 to-cyan-500',
      hoverGradient: 'hover:from-teal-500 hover:to-cyan-600'
    },
    {
      id: 2,
      title: 'اختر',
      description: 'اختر طبيبك المفضل من بين نخبة الأطباء المتاحين لك.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012 2h2a2 2 0 002-2" />
        </svg>
      ),
      gradient: 'from-cyan-400 to-blue-500',
      hoverGradient: 'hover:from-cyan-500 hover:to-blue-600'
    },
    {
      id: 3,
      title: 'احجز',
      description: 'احجز موعدك مباشرة من خلال التطبيق أو من خلال الهاتف.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
        </svg>
      ),
      gradient: 'from-blue-400 to-indigo-500',
      hoverGradient: 'hover:from-blue-500 hover:to-indigo-600'
    },
    {
      id: 4,
      title: 'استلم الرعاية',
      description: 'استلم الرعاية الطبية من طبيبك المفضل في مكانك المفضل.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
        </svg>
      ),
      gradient: 'from-indigo-400 to-purple-500',
      hoverGradient: 'hover:from-indigo-500 hover:to-purple-600'
    }
  ];

  return (
    <section id="journey" className="py-20 md:py-28 bg-gradient-to-br from-teal-50/80 via-teal-50/60 to-teal-50/80 w-full overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Enhanced Header */}
        <div className="text-center mb-20">
          <div className="inline-block mb-4">
            <span className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg">
              رحلة بسيطة وسريعة
            </span>
          </div>
          <h2 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
            رحلتك الصحية في <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-cyan-600">٤ خطوات</span>
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            مع "شُريان"، صحتك على بعد خطوات قليلة. احجز موعدك بسهولة وأمان.
          </p>
        </div>

        {/* Steps Grid with Connecting Lines */}
        <div className="relative">
          {/* Connecting Line (Hidden on mobile) */}
          <div className="hidden lg:block absolute top-20 right-0 left-0 h-1 bg-gradient-to-l from-purple-300 via-cyan-300 to-teal-300 opacity-30" 
               style={{ width: '85%', margin: '0 7.5%' }}></div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 relative">
            {steps.map((step, index) => (
              <div 
                key={step.id} 
                className="flex flex-col items-center group"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                {/* Card Container */}
                <div className="relative">
                  {/* Number Badge */}
                  <div className="absolute -top-3 -right-3 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center border-4 border-gray-50 group-hover:scale-110 transition-transform duration-300">
                    <span className={`text-xl font-black bg-gradient-to-br ${step.gradient} text-transparent bg-clip-text`}>
                      {step.id}
                    </span>
                  </div>

                  {/* Icon Circle */}
                  <div className={`bg-gradient-to-br ${step.gradient} ${step.hoverGradient} text-white w-28 h-28 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:shadow-2xl group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500 ease-out`}>
                    <div className="group-hover:scale-110 transition-transform duration-300">
                      {step.icon}
                    </div>
                  </div>
                </div>

                {/* Content Card */}
                <div className="text-center px-4 group-hover:-translate-y-2 transition-transform duration-300">
                  <h3 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-4 group-hover:text-teal-600 transition-colors duration-300">
                    {step.title}
                  </h3>
                  <p className="text-base md:text-lg text-gray-600 leading-relaxed max-w-xs mx-auto group-hover:text-gray-700 transition-colors duration-300">
                    {step.description}
                  </p>
                </div>

                {/* Arrow Indicator (Hidden on last step and mobile) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute right-0 top-20 transform -translate-x-1/2 text-teal-400 opacity-50 group-hover:opacity-100 group-hover:-translate-x-3/4 transition-all duration-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default JourneySection;
