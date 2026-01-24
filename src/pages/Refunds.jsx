import React from 'react';
import { motion } from 'framer-motion';
import { RefreshCcw } from 'lucide-react';

const Refunds = () => {
    return (
        <div className="min-h-screen pt-32 pb-20 relative bg-[#FFFAF0] dark:bg-slate-950 transition-colors duration-500">
            <div className="container mx-auto px-4 relative z-10 max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl rounded-[2.5rem] border border-orange-200 dark:border-orange-900/30 p-8 md:p-12 shadow-2xl"
                >
                    <div className="flex items-center gap-4 mb-8 border-b border-gray-200 dark:border-gray-700 pb-6">
                        <div className="bg-orange-100 dark:bg-orange-900/30 p-3 rounded-xl">
                            <RefreshCcw className="w-8 h-8 text-orange-600 dark:text-orange-400" />
                        </div>
                        <h1 className="text-3xl font-serif font-bold text-gray-900 dark:text-white">
                            Cancellation & Refund Policy
                        </h1>
                    </div>

                    <div className="space-y-8 text-gray-600 dark:text-gray-300 leading-relaxed font-sans text-justify">
                        <p className="font-semibold text-lg text-orange-800 dark:text-orange-300">
                            At AstroSharma, we strive to provide the highest quality astrological services. Due to the personalized and intangible nature of our work, our refund policy is as follows:
                        </p>

                        <section>
                            <h2 className="text-xl font-bold text-orange-700 dark:text-orange-400 mb-4">1. Cancellation Policy</h2>
                            <ul className="list-disc pl-6 mt-3 space-y-2">
                                <li><strong>Within 1 Hour:</strong> You may cancel your consultation booking within one (1) hour of making the payment for a full refund. Please contact us immediately at astrosharma74@gmail.com.</li>
                                <li><strong>After 1 Hour:</strong> After the 1-hour grace period, cancellations are generally not accepted as our astrologers may have already begun working on your chart.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-orange-700 dark:text-orange-400 mb-4">2. Refund Policy</h2>
                            <ul className="list-disc pl-6 mt-3 space-y-2">
                                <li><strong>Service Delivered:</strong> Once the astrological report or consultation has been delivered (via email, phone, or digital format), NO refunds will be issued.</li>
                                <li><strong>Dissatisfaction:</strong> Astrology is an interpretive art. While we aim for accuracy, we cannot guarantee specific outcomes. Refunds are not provided based on the nature of the predictions (whether positive or negative).</li>
                                <li><strong>Technical Errors:</strong> If you were charged twice for the same transaction due to a technical error, the duplicate amount will be refunded within 5-7 working days.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-orange-700 dark:text-orange-400 mb-4">3. Processing of Refunds</h2>
                            <p>
                                Approved refunds will be processed to the original method of payment within 5-7 business days.
                            </p>
                        </section>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Refunds;
