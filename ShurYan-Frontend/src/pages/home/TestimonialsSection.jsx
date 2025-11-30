import { useState, useEffect } from 'react';

const TestimonialsSection = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const testimonials = [
    {
      id: 1,
      name: 'محمد خليل',
      initial: 'M',
      rating: 5,
      text: 'كنت قلقًا من فكرة سحب العينات في البيت، لكن الممرض كان محترف جدًا والنتائج ظهرت على حسابي في وقت قياسي.',
      date: 'منذ أسبوعين'
    },
    {
      id: 2,
      name: 'فاطمة الزهراء',
      initial: 'F',
      rating: 5,
      text: 'خدمة توصيل الدواء كانت سريعة جدًا ومريحة، خصوصًا وإني كنت تعبانة ومش قادرة أنزل. التطبيق سهل وبسيط.',
      date: 'منذ 3 أيام'
    },
    {
      id: 3,
      name: 'أحمد المصري',
      initial: 'A',
      rating: 5,
      text: 'تجربة رائعة! قدرت أحجز مع دكتور ممتاز في دقايق والمتابعة كانت أسهل من ما توقعت. شكرًا شريان.',
      date: 'منذ شهر'
    }
  ];

  const StarIcon = ({ filled = true }) => (
    <svg 
      className={`w-5 h-5 transition-colors duration-200 ${filled ? 'text-amber-400' : 'text-gray-300'}`} 
      fill="currentColor" 
      viewBox="0 0 20 20"
      aria-hidden="true"
    >
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
    </svg>
  );



  return (
    <section 
      id="testimonials" 
      className="py-20 bg-gradient-to-br from-teal-50/80 via-teal-50/460 to-teal-50/80 w-full overflow-hidden"
      aria-labelledby="testimonials-heading"
    >
      <div className="container mx-auto px-6 text-center">
        <div className="max-w-4xl mx-auto mb-16">
          <div className="inline-block mb-4">
            <span className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg">
              آراء العملاء
            </span>
          </div>
          <h2 
            id="testimonials-heading" 
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6 leading-tight"
          >
            ماذا يقول <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-cyan-600">مرضانا</span> عنا؟
          </h2>
          <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
            آراء من وثقوا في <span className="text-teal-600 font-semibold">"شُريان"</span> لتلبية احتياجاتهم الصحية.
          </p>
        </div>

        <div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          role="list"
          aria-label="آراء العملاء"
        >
          {testimonials.map((testimonial, index) => (
            <div 
              key={testimonial.id}
              role="listitem"
              className={`
                bg-white p-6 rounded-3xl 
                shadow-sm hover:shadow-lg 
                transition-all duration-300 
                border border-gray-100/50
                hover:border-teal-100
                hover:scale-[1.02]
                ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
              `}
              style={{ 
                transitionDelay: `${index * 100}ms`
              }}
            >
              {/* User Info - Top */}
              <div className="flex flex-col items-center mb-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-teal-400 to-teal-500 flex items-center justify-center shadow-md mb-3">
                  <span className="text-white font-semibold text-xl">{testimonial.initial}</span>
                </div>
                <h3 className="font-semibold text-gray-800 text-base">{testimonial.name}</h3>
              </div>

              {/* Rating */}
              <div className="flex items-center justify-center gap-1 mb-4" role="img" aria-label={`تقييم ${testimonial.rating} من 5 نجوم`}>
                {[...Array(5)].map((_, idx) => (
                  <StarIcon key={idx} filled={idx < testimonial.rating} />
                ))}
              </div>

              {/* Testimonial Text */}
              <p className="text-gray-600 text-center leading-relaxed mb-4 text-sm">
                "{testimonial.text}"
              </p>

              {/* Date - Bottom */}
              <div className="text-center pt-3 border-t border-gray-100">
                <p className="text-xs text-gray-400">{testimonial.date}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-8 text-gray-600">
          <div className="flex items-center gap-2">
            <svg className="w-6 h-6 text-teal-600" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
            </svg>
            <span className="font-semibold text-gray-800">+5000</span>
            <span className="text-sm">عميل راضٍ</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-6 h-6 text-amber-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
            </svg>
            <span className="font-semibold text-gray-800">4.9/5</span>
            <span className="text-sm">التقييم العام</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-6 h-6 text-teal-600" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
            </svg>
            <span className="font-semibold text-gray-800">100%</span>
            <span className="text-sm">آراء موثقة</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
