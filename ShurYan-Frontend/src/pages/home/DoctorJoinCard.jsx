import React from 'react';
import { Link } from 'react-router-dom';

const DoctorJoinCard = () => {
  return (
    <section id="join-doctors" className="w-full bg-white py-16 md:py-20">
      <div className="container mx-auto px-6">
        <div className="w-full max-w-6xl mx-auto">
          <div 
            className="relative rounded-3xl p-8 md:p-12 lg:p-14 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
            style={{
              backgroundColor: '#0d9488',
              backgroundImage: `
                linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)
              `,
              backgroundSize: '30px 30px'
            }}
          >
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
              <div className="flex-1 text-right">
                <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 leading-tight">
                  هل أنت طبيب؟
                </h3>
                <p className="text-white/95 text-lg md:text-xl lg:text-2xl leading-relaxed mb-6">
                  انضم إلى شبكة شُريان الطبية وابدأ في تقديم الرعاية الصحية للمرضى عبر الإنترنت
                </p>
                
                {/* Benefits */}
                <div className="flex flex-wrap items-center justify-start gap-3 mt-6">
                  <div className="flex items-center gap-2 bg-white/20 px-4 py-2.5 rounded-full border border-white/30">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-white text-sm md:text-base font-semibold">دخل إضافي</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/20 px-4 py-2.5 rounded-full border border-white/30">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-white text-sm md:text-base font-semibold">مرونة بالوقت</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/20 px-4 py-2.5 rounded-full border border-white/30">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span className="text-white text-sm md:text-base font-semibold">آلاف المرضى</span>
                  </div>
                </div>
              </div>
              
              <div className="flex-shrink-0">
                <Link 
                  to="/register?type=doctor"
                  className="inline-flex items-center justify-center bg-white text-teal-700 font-bold px-8 md:px-10 py-4 text-lg md:text-xl rounded-2xl hover:bg-teal-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <span>انضم كطبيب</span>
                  <svg 
                    className="w-6 h-6 mr-3" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DoctorJoinCard;