/**
 * Turns a rendered report document into a downloadable A4 PDF.
 * Every [data-report-block] is captured as an image and placed whole on a page.
 * Images are used because jsPDF's own text cannot shape Telugu letters correctly.
 */
const PAGE_WIDTH_MM = 210;
const PAGE_HEIGHT_MM = 297;
const MARGIN_MM = 10;
const FOOTER_MM = 8;
const BLOCK_GAP_MM = 4;

const CONTENT_WIDTH_MM = PAGE_WIDTH_MM - MARGIN_MM * 2;
const CONTENT_BOTTOM_MM = PAGE_HEIGHT_MM - MARGIN_MM - FOOTER_MM;

// The width of the A4 content area at 96 DPI, so a report is laid out the same on every device
export const REPORT_WIDTH_PX = Math.round((CONTENT_WIDTH_MM / 25.4) * 96);

const loadReportFonts = async () => {
    try {
        await Promise.all([
            document.fonts.load('400 12px "Noto Sans Telugu"', 'కుండలి'),
            document.fonts.load('700 12px "Noto Sans Telugu"', 'కుండలి')
        ]);
        await document.fonts.ready;
    } catch (err) {
        console.warn("Could not load report fonts, using fallback fonts:", err);
    }
};

export const createReportPdf = async (root) => {
    const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
        import('html2canvas'),
        import('jspdf')
    ]);
    await loadReportFonts();

    const pdf = new jsPDF({ unit: 'mm', format: 'a4', compress: true });
    let y = MARGIN_MM;

    for (const block of root.querySelectorAll('[data-report-block]')) {
        const canvas = await html2canvas(block, {
            scale: 2,
            backgroundColor: '#ffffff',
            logging: false,
            useCORS: true,
            // Copying the whole site for every block is what makes the capture slow on phones
            ignoreElements: (element) => element.id === 'root',
            // The report always uses the light theme, whichever theme the site is showing
            onclone: (clonedDoc) => clonedDoc.documentElement.classList.remove('dark')
        });

        // A block taller than a whole page is shrunk to fit rather than cut in half
        const usableHeight = CONTENT_BOTTOM_MM - MARGIN_MM;
        const fullHeight = (canvas.height * CONTENT_WIDTH_MM) / canvas.width;
        const scale = Math.min(1, usableHeight / fullHeight);
        const width = CONTENT_WIDTH_MM * scale;
        const height = fullHeight * scale;

        if (y + height > CONTENT_BOTTOM_MM && y > MARGIN_MM) {
            pdf.addPage();
            y = MARGIN_MM;
        }

        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', MARGIN_MM + (CONTENT_WIDTH_MM - width) / 2, y, width, height, undefined, 'FAST');
        y += height + BLOCK_GAP_MM;
    }

    const pageCount = pdf.getNumberOfPages();
    for (let page = 1; page <= pageCount; page++) {
        pdf.setPage(page);
        pdf.setFontSize(8);
        pdf.setTextColor(90);
        pdf.text('AstroSharma - www.astrosharma.in', MARGIN_MM, PAGE_HEIGHT_MM - MARGIN_MM);
        pdf.text(`Page ${page} of ${pageCount}`, PAGE_WIDTH_MM - MARGIN_MM, PAGE_HEIGHT_MM - MARGIN_MM, { align: 'right' });
    }

    return pdf.output('blob');
};

export const getReportFileName = (system, name) => {
    const safeName = (name || '').trim().replace(/[^\p{L}\p{M}\p{N}]+/gu, '_');
    const label = system === 'kp' ? 'KP_Kundli' : 'Vedic_Kundli';
    return `AstroSharma_${label}${safeName ? `_${safeName}` : ''}.pdf`;
};
