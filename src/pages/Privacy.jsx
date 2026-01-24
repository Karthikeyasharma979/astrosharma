import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye } from 'lucide-react';

const Privacy = () => {
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
                            <Shield className="w-8 h-8 text-orange-600 dark:text-orange-400" />
                        </div>
                        <h1 className="text-3xl font-serif font-bold text-gray-900 dark:text-white">
                            Privacy Policy
                        </h1>
                    </div>

                    <div className="space-y-8 text-gray-600 dark:text-gray-300 leading-relaxed font-sans text-justify">
                        <section>
                            <h2 className="text-xl font-bold text-orange-700 dark:text-orange-400 mb-4">1. Information Collection</h2>
                            <p>
                                At AstroSharma, we value your trust and are committed to protecting your personal information. When you use our services, we may collect the following data:
                            </p>
                            <ul className="list-disc pl-6 mt-3 space-y-2">
                                <li><strong>Personal Details:</strong> Name, Date of Birth, Time of Birth, Place of Birth.</li>
                                <li><strong>Contact Information:</strong> Email address, Phone number.</li>
                                <li><strong>Transaction Data:</strong> Payment details (handled securely by our payment partners; we do not store card information).</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-orange-700 dark:text-orange-400 mb-4">2. Use of Information</h2>
                            <p>
                                The information we collect is used strictly for:
                            </p>
                            <ul className="list-disc pl-6 mt-3 space-y-2">
                                <li>Generating accurate astrological charts and predictions.</li>
                                <li>Communicating with you regarding your consultation and services.</li>
                                <li>Processing payments and preventing fraud.</li>
                                <li>Improving our website and user experience.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-orange-700 dark:text-orange-400 mb-4">3. Data Protection</h2>
                            <p>
                                We implement industry-standard security measures to protect your data. Your birth details are considered confidential and are never shared with third parties for marketing purposes.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-orange-700 dark:text-orange-400 mb-4">4. Third-Party Sharing</h2>
                            <p>
                                We do not sell or rent your personal data. We may share data only with:
                            </p>
                            <ul className="list-disc pl-6 mt-3 space-y-2">
                                <li><strong>Service Providers:</strong> Payment gateways (like Razorpay) necessary to process transactions.</li>
                                <li><strong>Legal Requirements:</strong> If required by law or to protect our rights.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-orange-700 dark:text-orange-400 mb-4">5. Contact Us</h2>
                            <p>
                                If you have any questions regarding this Privacy Policy, please contact us at <strong>astrosharma74@gmail.com</strong>.
                            </p>
                        </section>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Privacy;
