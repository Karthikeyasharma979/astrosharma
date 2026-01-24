import React, { useState } from 'react';
import { motion } from 'framer-motion';
// import ReCAPTCHA from "react-google-recaptcha";
import { Mail, Send, Loader2, CheckCircle, AlertCircle, Upload, Phone, Instagram, Facebook } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Help = () => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        message: ''
    });
    const [file, setFile] = useState(null);
    // const [captchaToken, setCaptchaToken] = useState(null);
    const [status, setStatus] = useState('idle'); // idle, loading, success, error

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // if (!captchaToken) {
        //     alert("Please complete the CAPTCHA check.");
        //     return;
        // }

        setStatus('loading');

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('firstName', formData.firstName);
            formDataToSend.append('lastName', formData.lastName);
            formDataToSend.append('email', formData.email);
            formDataToSend.append('message', formData.message);
            // formDataToSend.append('captchaToken', captchaToken);
            if (file) {
                formDataToSend.append('image', file);
            }

            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const response = await fetch(`${apiUrl}/api/contact`, {
                method: 'POST',
                body: formDataToSend
            });

            const data = await response.json();

            if (data.success) {
                setStatus('success');
                setFormData({ firstName: '', lastName: '', email: '', message: '' });
                setFile(null);
                // setCaptchaToken(null); // Reset
                setTimeout(() => setStatus('idle'), 5000);
            } else {
                const errorMessage = data.errors ? data.errors.join('\n') : (data.message || 'Something went wrong.');
                alert(errorMessage);
                setStatus('error');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Network error. Please try again.');
            setStatus('error');
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-10 container mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-16 w-full">
                {/* Contact Info */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="flex flex-col justify-start"
                >
                    <h1 className="text-5xl font-serif font-bold mb-6 text-gray-900 dark:text-white">
                        How can we <br /> <span className="text-gradient">Help You?</span>
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300 text-lg mb-12 leading-relaxed">
                        Have questions about your destiny or facing technical issues? Reach out to us.
                        The stars are waiting to speak to you.
                    </p>

                    <div className="space-y-8">


                        <div className="flex items-center gap-6 group">
                            <div className="w-14 h-14 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center border border-gray-200 dark:border-white/10 group-hover:border-orange-500 dark:group-hover:border-orange-500 transition-colors">
                                <Phone className="w-6 h-6 text-orange-600 dark:text-orange-500" />
                            </div>
                            <div>
                                <h3 className="text-gray-500 dark:text-gray-400 text-sm uppercase tracking-wider mb-1">Call Us</h3>
                                <p className="text-xl font-semibold text-gray-900 dark:text-white">9490474872</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">8:30pm to 10:00pm</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Sunday 9:00am to 8:00pm</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-6 group">
                            <div className="w-14 h-14 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center border border-gray-200 dark:border-white/10 group-hover:border-orange-500 dark:group-hover:border-orange-500 transition-colors">
                                <Mail className="w-6 h-6 text-orange-600 dark:text-orange-500" />
                            </div>
                            <div>
                                <h3 className="text-gray-500 dark:text-gray-400 text-sm uppercase tracking-wider mb-1">Email Us</h3>
                                <p className="text-xl font-semibold text-gray-900 dark:text-white">astrosharma74@gmail.com</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-6 group">
                            <div className="w-14 h-14 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center border border-gray-200 dark:border-white/10 group-hover:border-orange-500 dark:group-hover:border-orange-500 transition-colors">
                                <Instagram className="w-6 h-6 text-orange-600 dark:text-orange-500" />
                            </div>
                            <div>
                                <h3 className="text-gray-500 dark:text-gray-400 text-sm uppercase tracking-wider mb-1">Instagram</h3>
                                <p className="text-xl font-semibold text-gray-900 dark:text-white">@astrosharma74</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-6 group">
                            <div className="w-14 h-14 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center border border-gray-200 dark:border-white/10 group-hover:border-orange-500 dark:group-hover:border-orange-500 transition-colors">
                                <Facebook className="w-6 h-6 text-orange-600 dark:text-orange-500" />
                            </div>
                            <div>
                                <h3 className="text-gray-500 dark:text-gray-400 text-sm uppercase tracking-wider mb-1">Facebook</h3>
                                <p className="text-xl font-semibold text-gray-900 dark:text-white">@astrosharma74</p>
                            </div>
                        </div>


                    </div>
                </motion.div>

                {/* Contact Form */}
                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 p-8 md:p-12 rounded-3xl backdrop-blur-md relative overflow-hidden shadow-xl dark:shadow-none"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 dark:bg-orange-500/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-orange-500/10 dark:bg-astro-purple/20 rounded-full blur-3xl" />

                    <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm text-gray-700 dark:text-gray-400 ml-1">First Name</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    required
                                    disabled={status === 'loading'}
                                    className="w-full bg-gray-50 dark:bg-astro-dark/50 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500 dark:focus:border-orange-500 transition-colors text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                                    placeholder="Suniel"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-gray-700 dark:text-gray-400 ml-1">Last Name</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    required
                                    disabled={status === 'loading'}
                                    className="w-full bg-gray-50 dark:bg-astro-dark/50 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500 dark:focus:border-orange-500 transition-colors text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                                    placeholder="Sharma"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm text-gray-700 dark:text-gray-400 ml-1">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                disabled={status === 'loading'}
                                className="w-full bg-gray-50 dark:bg-astro-dark/50 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500 dark:focus:border-orange-500 transition-colors text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                                placeholder="suniel@gmail.com"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm text-gray-700 dark:text-gray-400 ml-1">Message</label>
                            <textarea
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                required
                                disabled={status === 'loading'}
                                rows="4"
                                className="w-full bg-gray-50 dark:bg-astro-dark/50 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500 dark:focus:border-orange-500 transition-colors text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                                placeholder="Tell us about your query..."
                            ></textarea>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm text-gray-700 dark:text-gray-400 ml-1">Attachment (Optional)</label>
                            <div className="relative">
                                <input
                                    type="file"
                                    id="file-upload"
                                    onChange={handleFileChange}
                                    disabled={status === 'loading'}
                                    className="hidden"
                                    accept="image/*"
                                />
                                <label
                                    htmlFor="file-upload"
                                    className={`flex items-center justify-center gap-3 w-full bg-gray-50 dark:bg-astro-dark/50 border border-dashed border-gray-300 dark:border-white/20 rounded-xl px-4 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-white/5 transition-colors group ${status === 'loading' ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}
                                >
                                    <Upload className="w-5 h-5 text-gray-400 group-hover:text-orange-500 transition-colors" />
                                    <span className="text-gray-500 dark:text-gray-400 text-sm group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors">
                                        {file ? file.name : "Upload an image"}
                                    </span>
                                </label>
                            </div>
                        </div>

                        {/* reCAPTCHA - REMOVED */}
                        {/*
                        <div className="flex justify-center -mb-2">
                            <ReCAPTCHA
                                sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                                onChange={(token) => setCaptchaToken(token)}
                                onExpired={() => setCaptchaToken(null)}
                                theme={isDark ? 'dark' : 'light'}
                            />
                        </div>
                        */}

                        <button
                            type="submit"
                            disabled={status === 'loading' || status === 'success'}
                            className="w-full py-4 bg-gradient-to-r from-orange-500 to-red-600 dark:from-orange-500 dark:to-orange-600 rounded-xl text-white dark:text-black font-bold text-lg hover:shadow-[0_0_20px_rgba(249,115,22,0.3)] transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {status === 'loading' ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : status === 'success' ? (
                                <>Message Sent <CheckCircle className="w-5 h-5" /></>
                            ) : (
                                <>Send Message <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></>
                            )}
                        </button>

                        {status === 'success' && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl text-green-800 dark:text-green-300 flex items-center gap-3"
                            >
                                <CheckCircle className="w-5 h-5 flex-shrink-0" />
                                <p className="text-sm">Thank you! Your message has been sent successfully. We will get back to you shortly.</p>
                            </motion.div>
                        )}

                        {status === 'error' && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-800 dark:text-red-300 flex items-center gap-3"
                            >
                                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                <p className="text-sm">Something went wrong. Please try again later.</p>
                            </motion.div>
                        )}
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default Help;

