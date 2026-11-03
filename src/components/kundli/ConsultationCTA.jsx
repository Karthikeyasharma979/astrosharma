import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, MessageCircle, CheckCircle, ShieldCheck, Award } from 'lucide-react';
import { KUNDLI_TRANSLATIONS } from '../../utils/kundliTranslations';

export const ConsultationCTA = ({ name, birthDate, birthTime, birthPlace, lagnaSign, moonSign, lang = 'te' }) => {
    const navigate = useNavigate();
    const t = KUNDLI_TRANSLATIONS[lang] || KUNDLI_TRANSLATIONS.en;
    const isTe = lang === 'te';

    const handleBookConsultation = () => {
        navigate('/consultation', {
            state: {
                fromKundli: true,
                fullName: name || (isTe ? 'జాతకుడు' : 'Seeker'),
                dob: birthDate,
                birthTime: birthTime,
                birthPlace: birthPlace,
                selectedType: 'deep', // Full Horoscope Birth Chart Analysis
                language: lang // Pass Telugu language selection directly to Consultation page!
            }
        });
    };

    const handleWhatsAppConsult = () => {
        const text = encodeURIComponent(
            isTe
                ? `నమస్తే ఆచార్య శర్మ గారు. నేను AstroSharma లో నా జన్మ కుండలిని పరిశీలించాను:\n` +
                  `• పేరు: ${name || 'జాతకుడు'}\n` +
                  `• పుట్టిన తేదీ: ${birthDate}, సమయం: ${birthTime}\n` +
                  `• ప్రదేశం: ${birthPlace}\n` +
                  `• లగ్నం: ${lagnaSign || 'N/A'}, రాశి: ${moonSign || 'N/A'}\n` +
                  `నా వింశోత్తరి మహర్దశ మరియు పరిహారాల కొరకు ప్రత్యక్ష సంప్రదింపులను కోరుకుంటున్నాను.`
                : `Namaste Acharya Sharma Ji. I generated my Kundli on AstroSharma:\n` +
                  `• Name: ${name || 'Seeker'}\n` +
                  `• DOB: ${birthDate} at ${birthTime}\n` +
                  `• Birthplace: ${birthPlace}\n` +
                  `• Lagna: ${lagnaSign || 'N/A'}, Moon: ${moonSign || 'N/A'}\n` +
                  `I would like to explore my Mahadasha, Sade Sati, and personal Vedic remedies.`
        );
        window.open(`https://wa.me/919490474872?text=${text}`, '_blank');
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-amber-600 via-orange-600 to-amber-700 text-white shadow-2xl overflow-hidden border-2 border-amber-300/40"
        >
            {/* Ambient Background Glow & Mandala Accents */}
            <div className="absolute -right-12 -bottom-12 w-56 h-56 bg-amber-300/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -left-12 -top-12 w-48 h-48 bg-orange-400/20 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 font-telugu">
                {/* Header Badge & Acharya Credentials */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-amber-100 text-[11px] font-bold uppercase tracking-wider">
                        <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                        {t.ctaBadge}
                    </div>

                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/25 backdrop-blur-md text-amber-200 text-[11px] font-semibold border border-amber-300/20">
                        <Award className="w-3.5 h-3.5 text-amber-300" />
                        <span>{isTe ? "ఆచార్య శర్మ • 25+ ఏళ్ల అనుభవం" : "Acharya Sharma • 25+ Yrs Exp."}</span>
                    </div>
                </div>

                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-2 leading-normal sm:leading-snug">
                    {t.ctaTitle}
                </h3>

                <p className="text-amber-100 text-xs sm:text-sm leading-relaxed mb-5 max-w-xl">
                    {t.ctaDesc}
                </p>

                {/* 3 Pillar Checklist */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-6 text-xs text-amber-100/90">
                    <div className="flex items-center gap-2 bg-black/20 p-2.5 rounded-xl border border-white/10">
                        <CheckCircle className="w-4 h-4 text-amber-300 shrink-0" />
                        <span>{isTe ? "వింశోత్తరి మహర్దశ కాలావధి" : "Vimshottari Dasha Timeline"}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-black/20 p-2.5 rounded-xl border border-white/10">
                        <CheckCircle className="w-4 h-4 text-amber-300 shrink-0" />
                        <span>{isTe ? "శని & కుజ దోష శాంతి పరిహారాలు" : "Kuja & Shani Remedies"}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-black/20 p-2.5 rounded-xl border border-white/10">
                        <CheckCircle className="w-4 h-4 text-amber-300 shrink-0" />
                        <span>{isTe ? "వివాహ & కెరీర్ మార్గదర్శనం" : "Career & Marriage Path"}</span>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <button
                        type="button"
                        onClick={handleBookConsultation}
                        className="py-3 px-6 rounded-xl bg-white hover:bg-amber-50 text-orange-950 font-bold text-sm shadow-xl transition-all flex items-center justify-center gap-2 hover:translate-x-0.5 active:scale-95 group"
                    >
                        <span>{t.ctaButton}</span>
                        <ArrowRight className="w-4 h-4 text-orange-600 group-hover:translate-x-1 transition-transform" />
                    </button>

                    <button
                        type="button"
                        onClick={handleWhatsAppConsult}
                        className="py-3 px-5 rounded-xl bg-black/30 hover:bg-black/40 text-white border border-white/20 font-semibold text-sm transition-all flex items-center justify-center gap-2 hover:border-green-400/50"
                    >
                        <MessageCircle className="w-4 h-4 text-green-400" />
                        <span>{t.ctaWhatsApp}</span>
                    </button>
                </div>

                {/* Trust Guarantee */}
                <div className="mt-4 pt-3 border-t border-white/15 flex items-center gap-2 text-[11px] text-amber-200/80">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                    <span>{isTe ? "100% వ్యక్తిగత గోప్యత • ప్రత్యక్ష ఫోన్ / వీడియో సంప్రదింపులు • ప్రామాణిక పరాశర విధానం" : "100% Confidential • Live Phone/Video Reading • Classical Parashari System"}</span>
                </div>
            </div>
        </motion.div>
    );
};
