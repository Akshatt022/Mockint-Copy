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
    <div className="bg-dark-950 min-h-screen text-gray-100 font-poppins overflow-x-hidden">  
      <Navbar />
      <main className="relative">
        <HeroSection />
        <FeaturesSection />
        <TestimonialsSection />
        <CallToActionSection/>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
