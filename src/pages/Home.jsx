import React from 'react';
import { Hero } from '../components/Hero';
import { RotatingSwastik } from '../components/RotatingSwastik';

const Home = () => {
    return (
        <div className="relative">
            <Hero />
            <RotatingSwastik />
        </div>
    );
};

export default Home;
