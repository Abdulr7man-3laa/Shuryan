import { useState, useRef, useEffect, useCallback } from 'react';
import { useDoctorCanvas } from '../../hooks/useDoctorCanvas';

const DrYoussef = new URL('../../assets/images/Dr-Youssef-Hamdi.png', import.meta.url).href;
const DrAlia = new URL('../../assets/images/Dr-Alia-Al-Masry.png', import.meta.url).href;
const DrAhmed = new URL('../../assets/images/Dr-Ahmed-Al-Sharif.png', import.meta.url).href;
const DrNourhan = new URL('../../assets/images/Dr-Nourhan-El-Sayed.png', import.meta.url).href;
const DrSarah = new URL('../../assets/images/Dr-Sarah-Ibrahim.png', import.meta.url).href;
const DrKarim = new URL('../../assets/images/Dr-Karim-Abdel-Aziz.png', import.meta.url).href;

const DoctorsSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const startTimeRef = useRef(null);
  const pausedTimeRef = useRef(0); // Track paused time
  const SLIDE_DURATION = 4000; // 4 seconds per slide

  const doctorsData = [
    { name: 'د. يوسف حمدي', specialty: 'طبيب عام', rating: 4.9, reviews: 120, bio: "طبيب عام بخبرة واسعة في تشخيص وعلاج الحالات الطارئة والمزمنة، يهتم بتقديم رعاية صحية متكاملة.", experience: '12+ سنة خبرة', location: 'الجيزة - المهندسين', imageSrc: DrYoussef },
    { name: 'د. علياء المصري', specialty: 'طبيبة أطفال', rating: 4.8, reviews: 95, bio: 'متخصصة في طب الأطفال وحديثي الولادة، تقدم متابعة شاملة لنمو الطفل وصحته.', experience: '10+ سنوات خبرة', location: 'القاهرة - مدينة نصر', imageSrc: DrAlia },
    { name: 'د. أحمد الشريف', specialty: 'جراح عظام', rating: 4.9, reviews: 210, bio: 'استشاري جراحة العظام متخصص في الإصابات الرياضية وتغيير المفاصل.', experience: '18+ سنة خبرة', location: 'الإسكندرية - سموحة', imageSrc: DrAhmed },
    { name: 'د. نورهان السيد', specialty: 'طبيبة نساء وتوليد', rating: 4.7, reviews: 88, bio: 'تقدم رعاية متكاملة لصحة المرأة، ومتابعة الحمل والولادة بأحدث التقنيات.', experience: '9+ سنوات خبرة', location: 'القاهرة - التجمع الخامس', imageSrc: DrNourhan },
    { name: 'د. سارة إبراهيم', specialty: 'طبيبة جلدية', rating: 4.8, reviews: 150, bio: 'متخصصة في علاج الأمراض الجلدية والتجميل والليزر، عضو الجمعية المصرية للأمراض الجلدية.', experience: '11+ سنة خبرة', location: 'الجيزة - الشيخ زايد', imageSrc: DrSarah },
    { name: 'د. كريم عبد العزيز', specialty: 'طبيب قلب وأوعية دموية', rating: 5.0, reviews: 300, bio: 'استشاري أمراض القلب والقسطرة العلاجية، حاصل على الزمالة البريطانية لأمراض القلب.', experience: '20+ سنة خبرة', location: 'القاهرة - المعادي', imageSrc: DrKarim }
  ];

  const { drawCard } = useDoctorCanvas(canvasRef, doctorsData);

  useEffect(() => {
    drawCard(currentIndex);
  }, [currentIndex, drawCard]);

  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current && canvasRef.current.offsetParent !== null) {
        drawCard(currentIndex);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [currentIndex, drawCard]);

  // Autoplay functionality with requestAnimationFrame
  useEffect(() => {
    const animate = (timestamp) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp - pausedTimeRef.current;
      }

      const elapsed = timestamp - startTimeRef.current;
      const progressPercent = Math.min((elapsed / SLIDE_DURATION) * 100, 100);
      
      setProgress(progressPercent);

      if (progressPercent >= 100) {
        // Move to next slide
        setCurrentIndex(prevIndex => (prevIndex + 1) % doctorsData.length);
        startTimeRef.current = timestamp; // Reset timer for next slide
        pausedTimeRef.current = 0; // Reset paused time
        setProgress(0);
      }

      if (isPlaying && !isPaused) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    if (isPlaying && !isPaused) {
      if (!startTimeRef.current) {
        startTimeRef.current = null; // Will be set in animate function
      }
      animationRef.current = requestAnimationFrame(animate);
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [isPlaying, isPaused, doctorsData.length]);
  

  const nextDoctor = () => {
    setCurrentIndex((prev) => (prev + 1) % doctorsData.length);
    setProgress(0);
    // Reset timer for manual navigation
    startTimeRef.current = null;
    pausedTimeRef.current = 0;
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  };

  const prevDoctor = () => {
    setCurrentIndex((prev) => (prev - 1 + doctorsData.length) % doctorsData.length);
    setProgress(0);
    // Reset timer for manual navigation
    startTimeRef.current = null;
    pausedTimeRef.current = 0;
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  };

  const goToDoctor = (index) => {
    setCurrentIndex(index);
    setProgress(0);
    // Reset timer for manual navigation
    startTimeRef.current = null;
    pausedTimeRef.current = 0;
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  };


  return (
    <section id="doctors" className="w-full py-20 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Enhanced Header */}
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <span className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg">
              أطباء معتمدون
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
            تعرف على <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-cyan-600">نخبة من أطبائنا</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            اختر من بين أفضل الأطباء والمتخصصين في مصر لبدء رحلتك الصحية مع <span className="font-semibold text-teal-600">شُريان</span>.
          </p>
        </div>
        
        <div className="relative mx-auto px-4" style={{ maxWidth: '1200px' }}>
          <button 
            onClick={nextDoctor} 
            className="absolute top-1/2 -translate-y-1/2 -right-4 md:-right-15 lg:-right-15 bg-white/90 backdrop-blur-sm hover:bg-teal-50 rounded-full p-2 md:p-3 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 z-20 cursor-pointer hover:scale-110 active:scale-95"
            aria-label="Next doctor"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-teal-500">
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
          
          <button 
            onClick={prevDoctor} 
            className="absolute top-1/2 -translate-y-1/2 -left-4 md:-left-15 lg:-left-15 bg-white/90 backdrop-blur-sm hover:bg-teal-50 rounded-full p-2 md:p-3 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 z-20 cursor-pointer hover:scale-110 active:scale-95"
            aria-label="Previous doctor"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-teal-500">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
          
          <div 
            className="relative w-full overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-xl transition-shadow duration-300"
            onMouseEnter={() => {
              // Save current progress when pausing
              if (startTimeRef.current) {
                pausedTimeRef.current = (progress / 100) * SLIDE_DURATION;
              }
              setIsPaused(true);
            }}
            onMouseLeave={() => {
              // Reset start time to continue from where we paused
              startTimeRef.current = null;
              setIsPaused(false);
            }}
          >
            <canvas 
              ref={canvasRef} 
              id="doctorCardCanvas" 
              className="mx-auto w-full max-w-5xl cursor-text"
              style={{ 
                height: '680px',
                userSelect: 'text',
                WebkitUserSelect: 'text',
                MozUserSelect: 'text',
                msUserSelect: 'text'
              }}
            />
          </div>
          
          <div className="flex justify-center space-x-3 space-x-reverse mt-8">
            {doctorsData.map((_, index) => (
              <button
                key={index}
                onClick={() => goToDoctor(index)}
                className={`relative w-4 h-4 rounded-full transition-all duration-300 cursor-pointer hover:scale-125 active:scale-110 ${
                  index === currentIndex ? 'bg-teal-500 scale-125' : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to doctor ${index + 1}`}
              >
                {/* Progress ring for current slide */}
                {index === currentIndex && (
                  <div className="absolute inset-0 rounded-full border-2 border-teal-200">
                    <div 
                      className="absolute inset-0 rounded-full border-2 border-teal-500 transition-all duration-100"
                      style={{
                        clipPath: `polygon(50% 50%, 50% 0%, ${50 + (progress / 100) * 50}% 0%, ${50 + (progress / 100) * 50 * Math.cos(2 * Math.PI * progress / 100)}% ${50 - (progress / 100) * 50 * Math.sin(2 * Math.PI * progress / 100)}%, 50% 50%)`
                      }}
                    />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DoctorsSlider;
