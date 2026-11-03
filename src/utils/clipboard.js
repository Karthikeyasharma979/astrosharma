/**
 * Reliably copy text to clipboard across all browser environments and protocols
 * (HTTPS, HTTP/LAN, webviews, desktop & mobile).
 * 
 * @param {string} text - The text to copy
 * @returns {Promise<boolean>} - Whether copy succeeded
 */
export const copyToClipboard = async (text) => {
    if (text === undefined || text === null) return false;
    const str = String(text);

    // 1. Try Modern Clipboard API (works in secure contexts: HTTPS, localhost)
    if (typeof navigator !== 'undefined' && navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
        try {
            await navigator.clipboard.writeText(str);
            return true;
        } catch (err) {
            console.warn('navigator.clipboard.writeText failed, attempting execCommand fallback:', err);
        }
    }

    // 2. Fallback using document.execCommand('copy') with temporary textarea
    // This works on HTTP, local network IPs (e.g. 192.168.x.x), older mobile browsers, etc.
    try {
        if (typeof document !== 'undefined') {
            const textArea = document.createElement('textarea');
            textArea.value = str;

            // Ensure element is not visible and does not cause scrolling
            textArea.style.position = 'fixed';
            textArea.style.top = '-9999px';
            textArea.style.left = '-9999px';
            textArea.style.width = '2em';
            textArea.style.height = '2em';
            textArea.style.padding = '0';
            textArea.style.border = 'none';
            textArea.style.outline = 'none';
            textArea.style.boxShadow = 'none';
            textArea.style.background = 'transparent';
            textArea.setAttribute('readonly', '');

            document.body.appendChild(textArea);

            // iOS / Mobile selection support
            textArea.focus();
            textArea.select();
            textArea.setSelectionRange(0, str.length);

            const successful = document.execCommand('copy');
            document.body.removeChild(textArea);

            if (successful) {
                return true;
            }
        }
    } catch (fallbackErr) {
        console.error('Fallback execCommand copy failed:', fallbackErr);
    }

    return false;
};
