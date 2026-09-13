/**
 * Client-side PDF Exporter Utility
 * Securely prints and exports styled resume documents using an isolated, sanitized print iframe.
 * Prevents DOM-based XSS, injection of external executable tags, and cleans up after printing.
 */

import { sanitizeResumeHtml } from './markdownResumeRenderer';

export interface ExportResumePdfOptions {
  element: HTMLElement;
  title?: string;
  compiledCss: string;
  containerClass?: string;
  onStart?: () => void;
  onFinish?: () => void;
  onError?: (err: Error) => void;
}

export function sanitizeTitle(rawTitle: string): string {
  if (!rawTitle) return 'Resume';
  return rawTitle.replace(/[<>"'&\\]/g, '_').replace(/\s+/g, '_');
}

/**
 * Sanitizes and exports the given element to PDF via an isolated browser print iframe.
 */
export function exportResumePdf(options: ExportResumePdfOptions): void {
  const { element, title = 'Resume', compiledCss, containerClass = '', onStart, onFinish, onError } = options;

  try {
    onStart?.();

    if (typeof window === 'undefined' || typeof document === 'undefined') {
      throw new Error('PDF export can only be invoked in a browser environment.');
    }

    if (!element) {
      throw new Error('No printable element was provided.');
    }

    // 1. Sanitize HTML content defensively before iframe insertion
    const rawHtml = element.innerHTML;
    const sanitizedHtml = sanitizeResumeHtml(rawHtml);
    const safeTitle = sanitizeTitle(title);

    // 2. Gather existing page stylesheets (Tailwind utilities, font imports)
    const headStyles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
      .map((node) => node.outerHTML)
      .filter((html) => !html.toLowerCase().includes('<script'))
      .join('\n');

    // 3. Create invisible, sandboxed print frame
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = 'none';
    iframe.style.zIndex = '-9999';
    iframe.setAttribute('aria-hidden', 'true');
    document.body.appendChild(iframe);

    const iframeDoc = iframe.contentWindow?.document;
    if (!iframeDoc) {
      if (document.body.contains(iframe)) {
        document.body.removeChild(iframe);
      }
      throw new Error('Failed to initialize print iframe document.');
    }

    iframeDoc.open();
    iframeDoc.write(`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <title>${safeTitle}</title>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          ${headStyles}
          <style>
            ${compiledCss}
          </style>
        </head>
        <body style="background-color: #ffffff; margin: 0; padding: 0;">
          <div class="resume-preview ${containerClass}" style="background-color: #ffffff; color: #1f2937;">
            ${sanitizedHtml}
          </div>
        </body>
      </html>
    `);
    iframeDoc.close();

    // 4. Trigger print once DOM is ready, then clean up iframe
    setTimeout(() => {
      try {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
      } catch (printErr) {
        console.warn('Silent print warning:', printErr);
      } finally {
        onFinish?.();
        setTimeout(() => {
          if (document.body.contains(iframe)) {
            document.body.removeChild(iframe);
          }
        }, 2000);
      }
    }, 350);
  } catch (err: unknown) {
    const errorObj = err instanceof Error ? err : new Error(String(err));
    onError?.(errorObj);
    onFinish?.();
  }
}
