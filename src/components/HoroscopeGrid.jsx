import React from 'react';
import { motion } from 'framer-motion';

const zodiacSigns = [
    { name: 'Aries', symbol: '♈', date: 'Mar 21 - Apr 19' },
    { name: 'Taurus', symbol: '♉', date: 'Apr 20 - May 20' },
    { name: 'Gemini', symbol: '♊', date: 'May 21 - Jun 20' },
    { name: 'Cancer', symbol: '♋', date: 'Jun 21 - Jul 22' },
    { name: 'Leo', symbol: '♌', date: 'Jul 23 - Aug 22' },
    { name: 'Virgo', symbol: '♍', date: 'Aug 23 - Sep 22' },
    { name: 'Libra', symbol: '♎', date: 'Sep 23 - Oct 22' },
    { name: 'Scorpio', symbol: '♏', date: 'Oct 23 - Nov 21' },
    { name: 'Sagittarius', symbol: '♐', date: 'Nov 22 - Dec 21' },
    { name: 'Capricorn', symbol: '♑', date: 'Dec 22 - Jan 19' },
    { name: 'Aquarius', symbol: '♒', date: 'Jan 20 - Feb 18' },
    { name: 'Pisces', symbol: '♓', date: 'Feb 19 - Mar 20' },
];

export const HoroscopeGrid = () => {
    return (
        <section className="py-20 px-6 relative z-10">
            <div className="container mx-auto">
                <div className="text-center mb-16">
                    <h2 className="font-serif text-3xl md:text-4xl font-bold text-temple-saffron dark:text-temple-gold mb-4">
                        Select Your Rashi
                    </h2>
                    <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-temple-gold to-transparent mx-auto" />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {zodiacSigns.map((sign, index) => (
                        <motion.div
                            key={sign.name}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.05 }}
                            whileHover={{ y: -5, scale: 1.02 }}
                            className="glass-temple p-6 flex flex-col items-center justify-center gap-4 cursor-pointer group hover:border-temple-gold/50 transition-all duration-300"
                        >
                            <div className="w-16 h-16 rounded-full bg-temple-saffron/10 dark:bg-temple-gold/10 flex items-center justify-center text-3xl group-hover:bg-temple-saffron/20 dark:group-hover:bg-temple-gold/20 transition-colors">
                                <span className="text-temple-saffron dark:text-temple-gold drop-shadow-sm">
                                    {sign.symbol}
                                </span>
                            </div>
                            <div className="text-center">
                                <h3 className="font-serif text-xl font-bold text-gray-800 dark:text-gray-100 group-hover:text-temple-saffron dark:group-hover:text-temple-gold transition-colors">
                                    {sign.name}
                                </h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                                    {sign.date}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
