import React from 'react';
import { 
  FaHeart, 
  FaCode, 
  FaShieldAlt, 
  FaPhone, 
  FaEnvelope, 
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
  FaMapMarkerAlt,
  FaClock,
  FaAward,
  FaUsers,
  FaStethoscope,
  FaArrowUp,
  FaGlobe,
  FaMobile,
  FaCheckCircle
} from 'react-icons/fa';

/**
 * Dashboard Footer Component
 * Modern, elegant footer with brand colors
 * @component
 */
const DashboardFooter = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative mt-16 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-500/20 to-emerald-500/20"></div>
        <div className="absolute top-0 left-0 w-full h-full" 
             style={{
               backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` 
             }}>
        </div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* القسم الرئيسي */}
        <div className="py-12 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* معلومات المنصة - جهة اليمين */}
          <div className="lg:col-span-4 text-right">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-2xl shadow-lg">
                <FaStethoscope className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">منصة شريان</h3>
                <p className="text-sm text-teal-400">للخدمات الطبية</p>
              </div>
            </div>
            
            <p className="text-slate-300 leading-relaxed mb-8 text-sm">
              منصة طبية متكاملة تربط بين الأطباء والمرضى لتقديم أفضل الخدمات الصحية بأحدث التقنيات والمعايير العالمية.
            </p>
            
            {/* إحصائيات */}
            <div className="grid grid-cols-3 gap-3 mb-8">
              <div className="text-center p-4 bg-gradient-to-br from-teal-500/10 to-teal-600/5 rounded-xl border border-teal-500/20 hover:border-teal-500/40 transition-all">
                <div className="text-2xl font-bold text-teal-400 mb-1">500+</div>
                <div className="text-xs text-slate-400">طبيب</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 rounded-xl border border-emerald-500/20 hover:border-emerald-500/40 transition-all">
                <div className="text-2xl font-bold text-emerald-400 mb-1">10K+</div>
                <div className="text-xs text-slate-400">مريض</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-blue-500/10 to-blue-600/5 rounded-xl border border-blue-500/20 hover:border-blue-500/40 transition-all">
                <div className="text-2xl font-bold text-blue-400 mb-1">24/7</div>
                <div className="text-xs text-slate-400">دعم</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-orange-500/10 to-orange-600/5 rounded-xl border border-orange-500/20 hover:border-orange-500/40 transition-all">
                <div className="text-2xl font-bold text-orange-400 mb-1">120+</div>
                <div className="text-xs text-slate-400">صيدلية</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-red-500/10 to-red-600/5 rounded-xl border border-red-500/20 hover:border-red-500/40 transition-all">
                <div className="text-2xl font-bold text-red-400 mb-1">80+</div>
                <div className="text-xs text-slate-400">معمل</div>
              </div>
            </div>
          </div>

          {/* روابط سريعة ومعلومات التواصل - المنتصف */}
          <div className="lg:col-span-4 text-right space-y-8">
            {/* روابط سريعة */}
            <div>
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <div className="w-1 h-6 bg-gradient-to-b from-teal-500 to-emerald-500 rounded-full"></div>
                روابط مهمة
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { title: 'عن المنصة', href: '#', icon: FaGlobe },
                  { title: 'الأطباء', href: '#', icon: FaUsers },
                  { title: 'الخدمات', href: '#', icon: FaStethoscope },
                  { title: 'الأسعار', href: '#', icon: FaCheckCircle },
                  { title: 'الأسئلة الشائعة', href: '#', icon: FaGlobe },
                  { title: 'مركز المساعدة', href: '#', icon: FaPhone },
                  { title: 'سياسة الخصوصية', href: '#', icon: FaShieldAlt },
                  { title: 'شروط الاستخدام', href: '#', icon: FaCode }
                ].map((link, index) => (
                  <a 
                    key={index}
                    href={link.href} 
                    className="flex items-center gap-2 px-3 py-2 text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200 group text-sm"
                  >
                    <link.icon className="w-3 h-3 text-teal-400 group-hover:text-teal-300" />
                    <span>{link.title}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* شارة الاعتماد */}
            <div className="p-4 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-xl border border-emerald-500/30 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <FaAward className="w-6 h-6 text-emerald-400" />
                <div className="text-right">
                  <div className="text-sm font-bold text-emerald-400">معتمد رسمياً</div>
                  <div className="text-xs text-slate-400">من وزارة الصحة المصرية</div>
                </div>
              </div>
            </div>
          </div>

          {/* معلومات إضافية - جهة اليسار */}
          <div className="lg:col-span-4 text-right space-y-8">
            {/* تابعنا على */}
            <div>
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <div className="w-1 h-6 bg-gradient-to-b from-teal-500 to-emerald-500 rounded-full"></div>
                تابعنا على
              </h3>
              <div className="flex gap-3 flex-wrap">
                {[
                  { icon: FaFacebookF, color: 'hover:bg-blue-600', label: 'فيسبوك' },
                  { icon: FaTwitter, color: 'hover:bg-sky-500', label: 'تويتر' },
                  { icon: FaInstagram, color: 'hover:bg-pink-600', label: 'إنستغرام' },
                  { icon: FaLinkedinIn, color: 'hover:bg-blue-700', label: 'لينكد إن' },
                  { icon: FaYoutube, color: 'hover:bg-red-600', label: 'يوتيوب' }
                ].map((social, index) => (
                  <button
                    key={index}
                    className={`p-3 bg-white/10 rounded-xl ${social.color} transition-all duration-200 hover:scale-110 hover:shadow-lg backdrop-blur-sm`}
                    aria-label={social.label}
                  >
                    <social.icon className="w-5 h-5" />
                  </button>
                ))}
              </div>
            </div>

            {/* معلومات التواصل */}
            <div>
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <div className="w-1 h-6 bg-gradient-to-b from-teal-500 to-emerald-500 rounded-full"></div>
                تواصل معنا
              </h3>
              
              <div className="space-y-3">
                {[
                  { 
                    icon: FaPhone, 
                    title: 'خدمة العملاء',
                    text: '16123', 
                    subtext: 'متاح 24/7',
                    gradient: 'from-teal-500 to-teal-600'
                  },
                  { 
                    icon: FaEnvelope, 
                    title: 'البريد الإلكتروني',
                    text: 'support@shuryan.com', 
                    subtext: 'الدعم التقني',
                    gradient: 'from-emerald-500 to-emerald-600'
                  }
                ].map((contact, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all duration-200 group">
                    <div className={`p-2 bg-gradient-to-br ${contact.gradient} rounded-lg`}>
                      <contact.icon className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 text-right">
                      <div className="text-xs text-slate-400 mb-0.5">{contact.title}</div>
                      <div className="text-sm text-white font-medium">{contact.text}</div>
                      <div className="text-xs text-slate-500">{contact.subtext}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* نظام آمن والسهم */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 rounded-full border border-emerald-500/30 flex-1">
                <FaShieldAlt className="w-4 h-4 text-emerald-400" />
                <span className="text-sm text-emerald-300 font-medium">نظام آمن ومشفر</span>
              </div>
              
              <button
                onClick={scrollToTop}
                className="p-3 bg-gradient-to-br from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 rounded-xl transition-all duration-200 hover:scale-110 hover:shadow-lg group"
                aria-label="العودة للأعلى"
              >
                <FaArrowUp className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* حقوق النشر */}
        <div className="border-t border-white/10 py-5">
          <div className="text-center">
            <div className="flex flex-col md:flex-row items-center justify-center gap-3 text-sm text-slate-300">
              <div className="flex items-center gap-2">
                <FaCode className="w-4 h-4" />
                <span>© 2025 منصة شريان. جميع الحقوق محفوظة.</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-500">
                <span>v1.1.0</span>
                <span>•</span>
                <span>آخر تحديث: أكتوبر 2025</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default DashboardFooter;
