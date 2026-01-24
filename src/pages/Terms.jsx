import React from 'react';
import { motion } from 'framer-motion';
import { Info } from 'lucide-react';

const Terms = () => {
    return (
        <div className="min-h-screen pt-32 pb-20 relative bg-[#FFFAF0] dark:bg-slate-950 transition-colors duration-500">
            {/* Ambient Background similar to Consultation */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-orange-100/50 dark:from-orange-900/10 to-transparent" />
            </div>

            <div className="container mx-auto px-4 relative z-10 max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl rounded-[2.5rem] border border-orange-200 dark:border-orange-900/30 p-8 md:p-12 shadow-2xl"
                >
                    <div className="flex items-center gap-4 mb-8 border-b border-gray-200 dark:border-gray-700 pb-6">
                        <div className="bg-orange-100 dark:bg-orange-900/30 p-3 rounded-xl">
                            <Info className="w-8 h-8 text-orange-600 dark:text-orange-400" />
                        </div>
                        <h1 className="text-3xl font-serif font-bold text-gray-900 dark:text-white">
                            Terms & Disclaimer
                        </h1>
                    </div>

                    <div className="space-y-10 text-gray-600 dark:text-gray-300 leading-relaxed font-sans">
                        <section>
                            <h2 className="text-xl font-bold text-orange-700 dark:text-orange-400 mb-4 flex items-center gap-2">
                                <span className="w-1.5 h-6 bg-orange-500 rounded-full inline-block" />
                                1. Service Usage Guidelines
                            </h2>
                            <div className="pl-4 border-l-2 border-orange-100 dark:border-orange-900/30">
                                <ul className="space-y-4">
                                    <li className="flex gap-3">
                                        <span className="text-orange-500 font-bold mt-1">•</span>
                                        <span><strong>Complimentary Follow-up:</strong> Clients are entitled to one (1) complimentary follow-up or clarification session per paid appointment. This session is strictly limited to the scope of the original consultation. Queries extraneous to the initial discussion will not be entertained to maintain service efficiency.</span>
                                    </li>
                                    <li className="flex gap-3">
                                        <span className="text-orange-500 font-bold mt-1">•</span>
                                        <span><strong>Query Limitations:</strong> For "Short Query" services, clients must strictly adhere to the pre-defined question limit (e.g., 1 question for single orders). Any questions submitted in excess of this limit will be disregarded, and services will be rendered solely based on the initial valid queries.</span>
                                    </li>
                                    <li className="flex gap-3">
                                        <span className="text-orange-500 font-bold mt-1">•</span>
                                        <span><strong>Delivery Timelines:</strong> All stated delivery times are estimates provided in good faith. Actual delivery may vary contingent upon the complexity of the astrological analysis required.</span>
                                    </li>
                                </ul>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-orange-700 dark:text-orange-400 mb-4 flex items-center gap-2">
                                <span className="w-1.5 h-6 bg-orange-500 rounded-full inline-block" />
                                2. Legal Disclaimer & Terms of Service
                            </h2>
                            <div className="bg-orange-50 dark:bg-orange-900/10 p-6 rounded-xl border border-orange-100 dark:border-orange-800/20 text-justify">
                                <p className="mb-4">
                                    <strong>AstroSharma</strong> (hereinafter referred to as "the Platform") operates as a provider of astrological and spiritual guidance. By accessing, browsing, or using this Platform, you acknowledge that you have read, understood, and agree to be bound by these terms.
                                </p>
                                <p>
                                    The Platform reserves the unequivocal right to modify, suspend, or terminate any aspect of the service or these terms at any time without prior notice. Continued use of the service following any changes constitutes acceptance of those changes.
                                </p>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-orange-700 dark:text-orange-400 mb-4 flex items-center gap-2">
                                <span className="w-1.5 h-6 bg-orange-500 rounded-full inline-block" />
                                3. Core Provisions & Limitations
                            </h2>
                            <div className="grid gap-6">
                                <div className="p-5 bg-white dark:bg-black/20 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
                                    <strong className="text-gray-900 dark:text-white block mb-2 text-lg">No Professional Advice / For Entertainment Purposes</strong>
                                    The services provided by AstroSharma are for <strong>spiritual and entertainment purposes only</strong>. The astrological readings, predictions, and advice should not be construed as professional medical, legal, financial, or psychological advice. Users should exercise their own judgment and seek advice from relevant certified professionals for serious matters.
                                </div>

                                <div className="p-5 bg-white dark:bg-black/20 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
                                    <strong className="text-gray-900 dark:text-white block mb-2 text-lg">Limitation of Liability</strong>
                                    Under no circumstances shall AstroSharma, its astrologers, or affiliates be liable for any direct, indirect, incidental, consequential, or punitive damages arising from the use of, or inability to use, our services. We assume no liability for the accuracy, reliability, or correctness of any data or information provided.
                                </div>

                                <div className="p-5 bg-white dark:bg-black/20 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
                                    <strong className="text-gray-900 dark:text-white block mb-2 text-lg">No Guarantees & Remedies</strong>
                                    Astrology is an interpretive art based on ancient systems. We explicitly disclaim any warranty or guarantee regarding the realization of predictions or the efficacy of recommended remedies (gemstones, yantras, rituals, etc.). Results depend heavily on individual faith and external factors beyond our control.
                                </div>

                                <div className="p-5 bg-white dark:bg-black/20 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
                                    <strong className="text-gray-900 dark:text-white block mb-2 text-lg">Data Privacy & Security</strong>
                                    We constitute a strict duty of confidentiality. Your personal birth data and consultation details are used solely for the purpose of generating astrological reports. However, users acknowledge that internet transmissions are never completely private or secure, and agree to hold the Platform harmless against unauthorized interception by third parties.
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-red-600 dark:text-red-400 mb-4 flex items-center gap-2">
                                <span className="w-1.5 h-6 bg-red-500 rounded-full inline-block" />
                                4. Cancellation & Refund Policy
                            </h2>
                            <div className="bg-red-50 dark:bg-red-900/10 p-6 rounded-xl border border-red-100 dark:border-red-800/20">
                                <p className="mb-4 font-semibold text-red-800 dark:text-red-200">
                                    Due to the personalized nature of our services, refunds are strictly governed by the following conditions:
                                </p>
                                <ul className="space-y-3">
                                    <li className="flex gap-2 items-start">
                                        <span className="text-red-500 mt-1">1.</span>
                                        <span><strong>Pre-Execution Cancellation:</strong> Refunds are ONLY processed if a cancellation request is communicated with valid proof of payment within <strong>one (1) hour</strong> of the transaction.</span>
                                    </li>
                                    <li className="flex gap-2 items-start">
                                        <span className="text-red-500 mt-1">2.</span>
                                        <span><strong>Service Execution:</strong> Once the astrological analysis has commenced or the report has been generated/delivered, <strong>NO REFUNDS</strong> will be granted under any circumstances.</span>
                                    </li>
                                    <li className="flex gap-2 items-start">
                                        <span className="text-red-500 mt-1">3.</span>
                                        <span><strong>Technical Delays:</strong> Delivery timelines are approximate. Delays due to technical glitches or high volume do not constitute grounds for a refund.</span>
                                    </li>
                                    <li className="flex gap-2 items-start">
                                        <span className="text-red-500 mt-1">4.</span>
                                        <span><strong>Incorrect Data:</strong> The Platform is not responsible for reports generated based on incorrect birth details provided by the user. Correction requests must be made within the 1-hour grace period mentioned above.</span>
                                    </li>
                                </ul>
                            </div>
                        </section>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Terms;
