import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Clock, Compass } from 'lucide-react';

const services = [
    {
        icon: BarChart3,
        title: "వ్యక్తిగత జాతక విశ్లేషణ", // Personal Horoscope Analysis
        desc: "Personal Horoscope Analysis",
        color: "text-orange-500"
    },
    {
        icon: Clock,
        title: "ముహూర్త నిర్ధారణ సేవలు", // Muhurtha Services
        desc: "Muhurtha Fixing Services",
        color: "text-orange-500"
    },
    {
        icon: Compass,
        title: "వాస్తు శాస్త్ర సలహాలు", // Vastu Shastra Advice
        desc: "Vastu Shastra Consultation",
        color: "text-orange-500"
    }
];

export const ServicesSection = () => {
    return (
        <section className="py-12 px-6 relative z-10 -mt-10 mb-20">
            <div className="container mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {services.map((service, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -5 }}
                            className="card-clean p-10 flex flex-col items-center text-center group"
                        >
                            <div className="w-16 h-16 rounded-full bg-orange-50 dark:bg-temple-saffron/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                                <service.icon className={`w-8 h-8 ${service.color} stroke-[1.5]`} />
                            </div>

                            <h3 className="font-telugu text-xl font-bold text-temple-text dark:text-gray-100 mb-2">
                                {service.title}
                            </h3>

                            {/* Optional English subtitle if needed, or keeping it clean as per screenshot */}
                            {/* <p className="text-xs text-gray-400 font-medium tracking-wide uppercase opacity-0 group-hover:opacity-100 transition-opacity">
                                {service.desc}
                            </p> */}
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
