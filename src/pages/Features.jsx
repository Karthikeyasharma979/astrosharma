import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sun, Moon, Star, Heart, Compass, Gem } from 'lucide-react';

const SERVICES = [
    {
        icon: Star,
        title: "Vedic Horoscope",
        desc: "In-depth analysis of your birth chart using ancient Vedic principles to predict your life path.",
        price: "$50"
    },
    {
        icon: Heart,
        title: "Kundli Matching",
        desc: "Detailed compatibility analysis for marriage and relationships based on 36 Gunas.",
        price: "$30"
    },
    {
        icon: Gem,
        title: "Gemsto Recommendation",
        desc: "Personalized gemstone prescriptions to balance your planetary influences and boost luck.",
        price: "$40"
    },
    {
        icon: Compass,
        title: "Vastu Shastra",
        desc: "Scientific architectural guidance to harmonize energy flow in your home or office.",
        price: "$100"
    },
    {
        icon: Sun,
        title: "Career Consultation",
        desc: "Strategic guidance for your professional life, finding the right path for success.",
        price: "$60"
    },
    {
        icon: Moon,
        title: "Prashna Kundli",
        desc: "Answers to specific questions based on the exact moment the question is asked.",
        price: "$25"
    }
];

const Features = () => {
    return (
        <div className="min-h-screen pt-24 pb-20 container mx-auto px-6">
            <div className="text-center mb-16">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-5xl font-serif font-bold mb-4 text-gray-900 dark:text-white"
                >
                    Our <span className="text-gradient">Divine Services</span>
                </motion.h1>
                <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                    Explore our wide range of astrological services designed to bring clarity, peace, and prosperity to your life.
                </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {SERVICES.map((service, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ y: -10 }}
                        className="group relative bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 p-8 rounded-2xl backdrop-blur-sm overflow-hidden hover:border-yellow-500/50 dark:hover:border-astro-gold/50 transition-all duration-300 shadow-lg dark:shadow-none"
                    >
                        {/* Hover Glow Effect */}
                        <div className="absolute inset-0 bg-yellow-500/5 dark:bg-astro-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        <div className="relative z-10">
                            <div className="w-14 h-14 bg-gray-100 dark:bg-astro-dark rounded-xl flex items-center justify-center border border-gray-200 dark:border-white/10 mb-6 group-hover:border-yellow-500 dark:group-hover:border-astro-gold group-hover:shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-all">
                                <service.icon className="w-7 h-7 text-gray-700 dark:text-white group-hover:text-yellow-600 dark:group-hover:text-astro-gold transition-colors" />
                            </div>

                            <h3 className="text-2xl font-serif font-bold text-gray-900 dark:text-white mb-3">{service.title}</h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">{service.desc}</p>

                            <div className="flex items-center justify-between mt-auto">
                                <span className="text-xl font-bold text-yellow-700 dark:text-astro-gold">{service.price}</span>
                                <Link to="/consultation" className="px-4 py-2 text-sm bg-gray-100 dark:bg-white/5 hover:bg-yellow-500 dark:hover:bg-astro-gold text-gray-900 dark:text-white hover:text-white dark:hover:text-astro-dark border border-gray-200 dark:border-white/10 rounded-full transition-all font-medium text-center">
                                    Book Now
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default Features;
