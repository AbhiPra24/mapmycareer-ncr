declare module 'pdfjs-dist/build/pdf.mjs' {
  export const version: string;
  export const GlobalWorkerOptions: {
    workerSrc: string;
  };
  export function getDocument(src: unknown): {
    promise: Promise<PDFDocumentProxy>;
  };
  export interface PDFDocumentProxy {
    numPages: number;
    getPage(pageNumber: number): Promise<PDFPageProxy>;
  }
  export interface PDFPageProxy {
    getTextContent(): Promise<{
      items: Array<{ str: string; transform: number[] } | Record<string, unknown>>;
    }>;
  }
}
