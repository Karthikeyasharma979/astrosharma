import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
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

                {/* Promotional KP Kundli Feature Banner */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="max-w-5xl mx-auto mt-10 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 dark:from-amber-950/40 dark:via-orange-950/30 dark:to-stone-900/40 border border-amber-300/60 dark:border-white/10 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shrink-0 shadow-md">
                            <span className="font-serif font-bold text-xl">KP</span>
                        </div>
                        <div>
                            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 block font-telugu">
                                నూతన ఖగోళ విభాగం • Krishnamurti Paddhati
                            </span>
                            <h4 className="text-xl font-bold font-serif text-gray-900 dark:text-white font-telugu">
                                ఉచిత కేపీ కుండలి జనరేటర్ (KP Sub Lord Kundli)
                            </h4>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5 max-w-xl font-telugu">
                                ప్లాసిడస్ భావ సంధులు, నక్షత్ర నాథులు, సబ్ లార్డ్స్ మరియు 4-స్థాయి కారకత్వాలతో కూడిన కచ్చితమైన కేపీ జాతక గణన.
                            </p>
                        </div>
                    </div>

                    <Link
                        to="/kundli?system=kp"
                        className="px-6 py-3 rounded-full bg-gradient-to-r from-amber-500 via-orange-600 to-amber-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-orange-500/20 hover:scale-105 active:scale-95 transition-all whitespace-nowrap"
                    >
                        Get KP Kundli →
                    </Link>
                </motion.div>
            </div>
        </section>
    );
};
