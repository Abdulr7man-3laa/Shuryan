import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

const HeroImage = new URL('../../assets/images/main.png', import.meta.url).href;

const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section id="hero" className="w-full hero-bg flex flex-col min-h-screen pt-20 md:pt-24 lg:pt-0">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-20 flex-grow flex flex-col">
        <div className="flex-grow grid lg:grid-cols-2 gap-24 lg:gap-44 items-center py-8 md:py-12 lg:py-16">
          {/* Content Section */}
          <div 
            className={`text-right space-y-6 md:space-y-8 transition-all duration-700 ease-out ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            {/* Brand Logo */}
            <div className="flex items-center justify-start space-x-3 space-x-reverse group">
              <div className="relative">
                <svg 
                  className="h-10 w-10 md:h-12 md:w-12 text-teal-500 transition-all duration-300 group-hover:text-teal-600 group-hover:scale-110" 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  strokeWidth="1.5" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
                <div className="absolute inset-0 bg-teal-400 blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 tracking-wide">
                شُريان
              </h1>
            </div>

            {/* Main Heading */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-gray-900 leading-tight">
              صحتك أمانة.. <br className="hidden sm:block" /> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-teal-600">ورعايتك مهمتنا</span>.
            </h2>

            {/* Description */}
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl leading-relaxed">
              في <span className="font-semibold text-teal-600">شُريان</span>، نؤمن أن الوصول للرعاية الصحية يجب أن يكون سهلاً ومريحاً. لذلك، جمعنا لك نخبة من أفضل الأطباء، لنكون <span className="font-semibold text-gray-800">شريكك الدائم</span> في رحلتك نحو صحة أفضل.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-start gap-4 pt-4">
              <Link 
                to="/register" 
                className="group relative bg-gradient-to-r from-teal-500 to-teal-600 text-white font-bold px-10 py-4 rounded-2xl hover:from-teal-600 hover:to-teal-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 text-base md:text-lg text-center overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center gap-3">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  إنشاء حساب جديد
                  <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-teal-600 to-teal-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
              
              <Link 
                to="/login" 
                className="group relative font-semibold text-gray-700 px-10 py-4 rounded-2xl transition-all duration-300 hover:text-teal-600 text-base md:text-lg text-center border-2 border-gray-200 hover:border-teal-500 hover:bg-teal-50 bg-white/80 backdrop-blur-sm"
              >
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  تسجيل الدخول
                </span>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center justify-start gap-6 pt-8">
              <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm px-5 py-4 rounded-2xl shadow-lg border border-slate-200/50 hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full flex items-center justify-center shadow-md">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <span className="font-bold text-slate-800 block text-base">أطباء معتمدون</span>
                  <span className="text-sm text-slate-600 font-medium">+500 طبيب متخصص</span>
                </div>
              </div>
              
              <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm px-5 py-4 rounded-2xl shadow-lg border border-slate-200/50 hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full flex items-center justify-center shadow-md">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <span className="font-bold text-slate-800 block text-base">حجز فوري</span>
                  <span className="text-sm text-slate-600 font-medium">متاح 24/7</span>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm px-5 py-4 rounded-2xl shadow-lg border border-slate-200/50 hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-md">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <span className="font-bold text-slate-800 block text-base">رعاية شاملة</span>
                  <span className="text-sm text-slate-600 font-medium">خدمات متكاملة</span>
                </div>
              </div>
            </div>
          </div>

          {/* Image Section */}
          <div 
            className={`flex justify-center items-center transition-all duration-700 ease-out delay-200 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
            }`}
          >
            <div className="relative group">
              {/* Background Decoration */}
              <div className="absolute inset-0 bg-gradient-to-br from-teal-400/20 to-teal-600/20 rounded-3xl blur-3xl transform group-hover:scale-110 transition-transform duration-500"></div>
              
              {/* Main Image */}
              <img 
                src={HeroImage} 
                alt="رسم توضيحي لطبيبة و مريض" 
                className="relative z-10 w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-2xl h-auto object-contain transform group-hover:scale-105 transition-transform duration-500"
                loading="eager"
              />
              
              {/* Floating Badge */}
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-teal-100 hidden md:block">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-semibold text-gray-700">متاح الآن</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Wave Decoration */}
      <div className="relative w-full h-auto">
        <svg className="waves" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 24 150 28" preserveAspectRatio="none" shapeRendering="auto">
          <defs>
            <path id="gentle-wave" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
          </defs>
          <g className="parallax">
            <use xlinkHref="#gentle-wave" x="48" y="0" fill="rgba(79,209,197,0.7)" />
            <use xlinkHref="#gentle-wave" x="48" y="3" fill="rgba(79,209,197,0.5)" />
            <use xlinkHref="#gentle-wave" x="48" y="5" fill="rgba(79,209,197,0.3)" />
            <use xlinkHref="#gentle-wave" x="48" y="7" fill="#4FD1C5" />
          </g>
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
