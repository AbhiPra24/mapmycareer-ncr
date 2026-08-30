/**
 * Client-side file text extractor for resumes
 * Supports: .txt, .md, .tex, .docx (mammoth), and .pdf (pdfjs-dist)
 */

export async function parseResumeFile(file: File): Promise<string> {
  const name = file.name.toLowerCase();

  // 1. Plain Text, Markdown, LaTeX
  if (name.endsWith('.txt') || name.endsWith('.md') || name.endsWith('.tex') || name.endsWith('.json')) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve((reader.result as string) || '');
      reader.onerror = () => reject(new Error('Failed to read text file.'));
      reader.readAsText(file);
    });
  }

  // 2. Word (.docx) via mammoth
  if (name.endsWith('.docx')) {
    const arrayBuffer = await file.arrayBuffer();
    // Dynamically import mammoth to keep initial bundle lean
    const mammoth = await import('mammoth');
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value || '';
  }

  // 3. PDF (.pdf) via pdfjs-dist
  if (name.endsWith('.pdf')) {
    const arrayBuffer = await file.arrayBuffer();
    
    // Import pdfjs-dist
    const pdfjsLib = await import('pdfjs-dist/build/pdf.mjs');
    
    // Configure worker
    if (typeof window !== 'undefined' && !pdfjsLib.GlobalWorkerOptions.workerSrc) {
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
    }

    const loadingTask = pdfjsLib.getDocument({
      data: new Uint8Array(arrayBuffer),
      useWorkerFetch: true,
      isEvalSupported: false,
      useSystemFonts: true,
    });

    const pdfDoc = await loadingTask.promise;
    let fullText = '';

    for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
      const page = await pdfDoc.getPage(pageNum);
      const textContent = await page.getTextContent();
      
      let lastY: number | null = null;
      let pageText = '';

      for (const item of textContent.items) {
        if ('str' in item) {
          const textItem = item as { str: string; transform: number[] };
          const currentY = textItem.transform[5];
          
          // Newline detection based on vertical coordinate delta
          if (lastY !== null && Math.abs(currentY - lastY) > 5) {
            pageText += '\n';
          } else if (pageText && !pageText.endsWith(' ') && !pageText.endsWith('\n')) {
            pageText += ' ';
          }
          
          pageText += textItem.str;
          lastY = currentY;
        }
      }
      
      fullText += pageText + '\n\n';
    }

    return fullText.trim();
  }

  throw new Error('Unsupported file type. Please upload .pdf, .docx, .txt, or .md files.');
}
