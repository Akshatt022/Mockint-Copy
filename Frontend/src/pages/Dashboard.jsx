import React from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import TestCard from '../components/Testcard';
import TestimonialsSection from '../components/TestiMonial.jsx';
import CallToActionSection from '../components/CallToAction.jsx';
import Footer from '../components/Footer';
import FeaturesSection from '../components/FeaturesSection.jsx';


const Dashboard = () => {

  return (
    <div className="bg-[#0a0a0a] min-h-screen text-[#eee] font-[Poppins]">  
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <TestimonialsSection />
      <CallToActionSection/>
      <Footer />
    </div>
  );
};

export default Dashboard;
