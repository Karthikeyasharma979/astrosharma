import React from 'react';
import { Hero } from '../components/Hero';
import { ServicesSection } from '../components/ServicesSection';
import { DailyHoroscope } from '../components/DailyHoroscope';
import { Testimonials } from '../components/Testimonials';

const Home = () => {
    return (
        <div className="min-h-screen">
            <Hero />
            <ServicesSection />
            <DailyHoroscope />
            <Testimonials />
        </div>
    );
};

export default Home;

