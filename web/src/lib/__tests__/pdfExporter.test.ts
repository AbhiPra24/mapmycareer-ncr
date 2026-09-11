import { describe, it, expect, vi } from 'vitest';
import { sanitizeTitle, exportResumePdf } from '../pdfExporter';

describe('PDF Exporter Utility', () => {
  it('should sanitize title with dangerous characters and spaces', () => {
    expect(sanitizeTitle('John Doe <script>')).toBe('John_Doe__script_');
    expect(sanitizeTitle('Jane "Lead" & Engineer')).toBe('Jane__Lead____Engineer');
    expect(sanitizeTitle('')).toBe('Resume');
  });

  it('should call onError when element is missing or invalid', () => {
    const onError = vi.fn();
    exportResumePdf({
      element: null as unknown as HTMLElement,
      compiledCss: 'body {}',
      onError,
    });

    expect(onError).toHaveBeenCalledWith(expect.any(Error));
  });

  it('should sanitize element innerHTML before writing to print frame', () => {
    const container = document.createElement('div');
    container.innerHTML = '<p>Resume Content</p><script>alert("xss")</script><img src="x" onerror="alert(1)">';

    const onStart = vi.fn();
    const onFinish = vi.fn();

    exportResumePdf({
      element: container,
      title: 'Test Resume',
      compiledCss: 'body { color: black; }',
      onStart,
      onFinish,
    });

    expect(onStart).toHaveBeenCalled();

    // Verify iframe was appended and does not contain script or event handlers
    const iframe = document.querySelector('iframe');
    if (iframe && iframe.contentWindow) {
      const docHtml = iframe.contentWindow.document.documentElement.outerHTML;
      expect(docHtml).not.toContain('<script>alert');
      expect(docHtml).not.toContain('onerror=');
      expect(docHtml).toContain('Resume Content');
    }
  });
});
