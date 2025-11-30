import GlobalStyles from './GlobalStyles';
import HeroSection from './HeroSection';
import DoctorsSlider from './DoctorsSlider';
import JourneySection from './JourneySection';
import ServicesSection from './ServicesSection';
import TestimonialsSection from './TestimonialsSection';
import DoctorJoinCard from './DoctorJoinCard';
import Footer from '../../components/Footer';


const HomePage = () => {

  return (
    <div className="w-full bg-white flex flex-col items-center" dir="rtl">
      <GlobalStyles />
      <main className="w-full">
        <HeroSection />
        <DoctorsSlider />
        <JourneySection />
        <ServicesSection />
        <TestimonialsSection />
        <DoctorJoinCard />
        <Footer />
      </main>
    </div>
  );
};

export default HomePage;
