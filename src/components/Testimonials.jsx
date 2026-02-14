import React from 'react';
import { motion } from 'framer-motion';

const REVIEWS = [
    {
        id: 1,
        quote: "The clarity I received was profound. It wasn't just predictions; it was a roadmap for my career transition.",
        author: "Priya S.",
        location: "Hyderabad"
    },
    {
        id: 2,
        quote: "Vedic matchmaking went beyond just matching stars. It helped us understand our core values. Highly recommended.",
        author: "Rahul & Anjali",
        location: "Bangalore"
    },
    {
        id: 3,
        quote: "Precise muhurat for my business launch. The timing felt aligned, and the results have been auspicious.",
        author: "Karthik R.",
        location: "USA"
    }
];

export const Testimonials = () => {
    return (
        <section className="py-32 bg-luxury-void relative">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-luxury-purple/10 to-transparent opacity-30" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-20">
                    <span className="text-luxury-gold/50 text-sm tracking-[0.4em] uppercase font-bold">
                        Echoes of Destiny
                    </span>
                    <h2 className="text-4xl md:text-5xl font-serif text-white mt-4">
                        Stories of alignment
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {REVIEWS.map((review, i) => (
                        <motion.div
                            key={review.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.2 }}
                            viewport={{ once: true }}
                            className="relative p-10 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
                        >
                            <span className="absolute top-8 left-8 text-6xl font-serif text-luxury-gold/10">"</span>
                            <p className="text-xl text-gray-300 font-serif leading-relaxed mb-8 relative z-10">
                                {review.quote}
                            </p>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-luxury-gold to-luxury-gold-dark flex items-center justify-center text-black font-bold text-lg font-serif">
                                    {review.author[0]}
                                </div>
                                <div>
                                    <div className="text-white font-medium">{review.author}</div>
                                    <div className="text-sm text-gray-500">{review.location}</div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
