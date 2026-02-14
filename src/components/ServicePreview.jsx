import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Compass, Heart, Clock } from 'lucide-react';

const SERVICES = [
    {
        id: 'personal',
        title: "Personal Readings",
        subtitle: "Horoscope & Destiny Analysis",
        icon: Compass,
        description: "Deep dive into your birth chart. Understand your karma, dharma, and future possibilities through the lens of Vedic wisdom.",
        gradient: "from-blue-500/20 to-purple-500/20"
    },
    {
        id: 'match',
        title: "Matchmaking",
        subtitle: "Soul & Compatibility",
        icon: Heart,
        description: "Beyond simple gunas. Analyze spiritual, mental, and physical compatibility for a harmonious lifelong partnership.",
        gradient: "from-pink-500/20 to-rose-500/20"
    },
    {
        id: 'muhurat',
        title: "Muhurat",
        subtitle: "Auspicious Timing",
        icon: Clock,
        description: "Align your key life events with cosmic rhythms. Calculate the most powerful moments for success.",
        gradient: "from-amber-500/20 to-orange-500/20"
    }
];

export const ServicePreview = () => {
    return (
        <section className="py-24 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-luxury-purple/10 to-transparent pointer-events-none" />

            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row gap-16 items-start">

                    {/* Left Side: The "Oracle" Title */}
                    <div className="md:w-1/3 sticky top-32">
                        <span className="text-luxury-gold text-sm tracking-[0.3em] uppercase font-bold mb-4 block">
                            Our Services
                        </span>
                        <h2 className="text-5xl md:text-6xl font-serif font-bold text-white mb-6">
                            The <span className="text-transparent bg-clip-text bg-gradient-to-r from-luxury-gold to-white">Oracle</span>
                        </h2>
                        <p className="text-gray-400 leading-relaxed mb-8 text-lg font-light">
                            Navigate life's complexities with precision. Each service is a gateway to clarity, grounded in ancient scripture and modern applicability.
                        </p>
                        <a href="/consultation" className="inline-flex items-center gap-2 text-white border-b border-luxury-gold pb-1 hover:text-luxury-gold transition-colors group">
                            View All Offerings
                            <ArrowUpRight className="w-4 h-4 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
                        </a>
                    </div>

                    {/* Right Side: Interactive Grid */}
                    <div className="md:w-2/3 grid grid-cols-1 gap-6">
                        {SERVICES.map((service, index) => (
                            <motion.div
                                key={service.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="group relative glass-premium p-8 hover:bg-white/5 transition-colors duration-500 cursor-pointer overflow-hidden"
                            >
                                <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${service.gradient} blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />

                                <div className="relative z-10 flex gap-6 items-start">
                                    <div className="p-4 rounded-xl bg-white/5 border border-white/10 group-hover:border-luxury-gold/30 transition-colors">
                                        <service.icon className="w-8 h-8 text-luxury-gold" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-2xl font-serif text-white mb-2 group-hover:text-luxury-gold transition-colors">
                                            {service.title}
                                        </h3>
                                        <div className="text-sm text-luxury-gold-light/60 uppercase tracking-wider mb-4 font-medium">
                                            {service.subtitle}
                                        </div>
                                        <p className="text-gray-400 group-hover:text-gray-300 transition-colors leading-relaxed">
                                            {service.description}
                                        </p>
                                    </div>
                                    <ArrowUpRight className="w-6 h-6 text-gray-500 group-hover:text-white transition-colors opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};
