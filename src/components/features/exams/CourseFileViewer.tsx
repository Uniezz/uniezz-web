import FileViewer, { type ViewerOptions } from '@file-viewer/react';
import imageRenderer from '@file-viewer/renderer-image';
import pdfRenderer from '@file-viewer/renderer-pdf';

const options: ViewerOptions = {
  // The renderer packages narrow the element type while the core input accepts HTMLElement.
  renderers: [imageRenderer, pdfRenderer] as unknown as ViewerOptions['renderers'],
  rendererMode: 'replace',
  autoRenderers: false,
  styleIsolation: 'none',
  theme: 'dark',
  ui: { surfaceBackground: '#161822' },
  pdf: { assetBaseUrl: import.meta.env.BASE_URL },
  image: { rotation: false },
  toolbar: {
    theme: false,
    download: false,
    print: false,
    exportHtml: false,
    permissions: { download: false, print: false, 'export-html': false },
  },
};

export default function CourseFileViewer({ url, file }: { url?: string; file?: File }) {
  return (
    <div className="h-[85dvh]">
      <FileViewer url={url} file={file} options={options} className="file-viewer-host h-full" />
    </div>
  );
}
