import React, { useEffect, useRef, useState } from 'react';
import { createPortal, flushSync } from 'react-dom';
import { AlertCircle, CheckCircle2, ExternalLink, FileDown, Share2, X } from 'lucide-react';
import { KundliLoadingScreen } from '../kundli/KundliLoadingScreen';
import { KundliReportDocument } from './KundliReportDocument';
import { KUNDLI_TRANSLATIONS } from '../../utils/kundliTranslations';
import { createReportPdf, getReportFileName } from '../../utils/kundliReportPdf';

const downloadFile = (url, fileName) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
};

export const GetReportButton = ({ system, result, params, lang = 'te' }) => {
    const t = KUNDLI_TRANSLATIONS[lang] || KUNDLI_TRANSLATIONS.te;
    const documentRef = useRef(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [report, setReport] = useState(null); // { url, file }
    const [error, setError] = useState(null);

    // Release the previous PDF from memory when it is replaced or the page closes
    useEffect(() => () => {
        if (report) URL.revokeObjectURL(report.url);
    }, [report]);

    const handleGetReport = async () => {
        if (isGenerating) return;

        // Put the document in the page and show the loading screen before the capture blocks it
        flushSync(() => {
            setError(null);
            setReport(null);
            setIsGenerating(true);
        });
        await new Promise(resolve => requestAnimationFrame(() => setTimeout(resolve, 0)));

        try {
            const blob = await createReportPdf(documentRef.current);
            const fileName = getReportFileName(system, params.name);
            const url = URL.createObjectURL(blob);
            downloadFile(url, fileName);
            setReport({ url, file: new File([blob], fileName, { type: 'application/pdf' }) });
        } catch (err) {
            console.error("Kundli report error:", err);
            setError(t.reportFailed);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleShare = async () => {
        try {
            await navigator.share({ files: [report.file], title: report.file.name });
        } catch (err) {
            if (err.name !== 'AbortError') console.warn("Could not share report:", err);
        }
    };

    const canShare = report && navigator.canShare?.({ files: [report.file] });

    return (
        <>
            <button
                type="button"
                onClick={handleGetReport}
                disabled={isGenerating}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white text-sm font-bold font-telugu shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-60"
            >
                <FileDown className="w-4 h-4" />
                <span>{t.getReport}</span>
            </button>

            {isGenerating && createPortal(
                <KundliReportDocument ref={documentRef} system={system} result={result} params={params} lang={lang} />,
                document.body
            )}
            {isGenerating && (
                <KundliLoadingScreen lang={lang} title={t.reportLoadingTitle} steps={t.reportLoadingSteps} />
            )}

            {(report || error) && createPortal(
                <div
                    role="status"
                    className="fixed z-[90] bottom-4 left-4 right-4 sm:left-auto sm:w-96 p-4 rounded-2xl bg-white dark:bg-stone-900 border border-amber-300 dark:border-white/15 shadow-2xl font-telugu text-gray-900 dark:text-white"
                >
                    <div className="flex items-start gap-2.5">
                        {report
                            ? <CheckCircle2 className="w-5 h-5 shrink-0 text-green-600 dark:text-green-400" />
                            : <AlertCircle className="w-5 h-5 shrink-0 text-red-600 dark:text-red-400" />}
                        <div className="min-w-0 flex-1">
                            <p className="text-sm font-bold leading-snug">{report ? t.reportReady : error}</p>
                            {report && <p className="text-[11px] text-gray-500 dark:text-gray-400 break-all mt-0.5">{report.file.name}</p>}
                        </div>
                        <button
                            type="button"
                            aria-label={t.close || 'Close'}
                            onClick={() => { setReport(null); setError(null); }}
                            className="p-1 -m-1 rounded-lg text-gray-500 hover:text-gray-900 dark:hover:text-white cursor-pointer"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    {report && (
                        <div className="flex flex-wrap gap-2 mt-3">
                            <a
                                href={report.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-100 dark:bg-amber-950/70 text-amber-900 dark:text-amber-200 text-xs font-bold"
                            >
                                <ExternalLink className="w-3.5 h-3.5" />
                                {t.openPdf}
                            </a>
                            {canShare && (
                                <button
                                    type="button"
                                    onClick={handleShare}
                                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold cursor-pointer"
                                >
                                    <Share2 className="w-3.5 h-3.5" />
                                    {t.sharePdf}
                                </button>
                            )}
                        </div>
                    )}
                </div>,
                document.body
            )}
        </>
    );
};
