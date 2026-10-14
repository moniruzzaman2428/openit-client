// ============================================================
// FILE: src/components/notices/noticeExport.js
// PDF download + print helpers for the official notice letter.
// html2canvas and jsPDF are loaded on demand (not in the main bundle).
// ============================================================

const FONT_LINK_ID = 'notice-bengali-fonts';
const FONT_HREF =
  'https://fonts.googleapis.com/css2?family=Noto+Serif+Bengali:wght@400;600;700&family=Noto+Sans+Bengali:wght@400;600;700;800&display=swap';

// ------------------------------------------------------------
// Bengali digits + letter date  (21-06-2026 -> ২১-০৬-২০২৬ ইং)
// ------------------------------------------------------------

const BN_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];

export const toBengaliDigits = (value = '') =>
  String(value).replace(/\d/g, (d) => BN_DIGITS[Number(d)]);

export const formatLetterDate = (date) => {
  if (!date) return '';
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return '';

  const dd = String(parsed.getDate()).padStart(2, '0');
  const mm = String(parsed.getMonth() + 1).padStart(2, '0');
  const yyyy = parsed.getFullYear();

  return `${toBengaliDigits(`${dd}-${mm}-${yyyy}`)} ইং`;
};

export const buildFileName = (slug = '', date) => {
  const parsed = date ? new Date(date) : null;
  const iso =
    parsed && !Number.isNaN(parsed.getTime())
      ? parsed.toISOString().slice(0, 10)
      : '';
  const safeSlug = String(slug)
    .replace(/[^a-z0-9-]/gi, '')
    .slice(0, 40);

  return ['OpenIT-Notice', iso, safeSlug].filter(Boolean).join('-');
};

// ------------------------------------------------------------
// Fonts + images
// ------------------------------------------------------------

export const ensureBengaliFonts = () => {
  if (typeof document === 'undefined') return;
  if (document.getElementById(FONT_LINK_ID)) return;

  const link = document.createElement('link');
  link.id = FONT_LINK_ID;
  link.rel = 'stylesheet';
  link.href = FONT_HREF;
  document.head.appendChild(link);
};

export const waitForFonts = async () => {
  try {
    if (!document.fonts) return;
    await Promise.all([
      document.fonts.load('16px "Noto Serif Bengali"', 'আ'),
      document.fonts.load('700 16px "Noto Serif Bengali"', 'আ'),
      document.fonts.load('800 16px "Noto Sans Bengali"', 'আ'),
    ]);
    await document.fonts.ready;
  } catch {
    /* fonts are best-effort: fall back to system Bengali fonts */
  }
};

export const waitForImages = (root) =>
  Promise.all(
    Array.from(root.querySelectorAll('img')).map((img) =>
      img.complete
        ? Promise.resolve()
        : new Promise((resolve) => {
            img.onload = resolve;
            img.onerror = resolve;
          })
    )
  );

const escapeHtml = (value = '') =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

// ------------------------------------------------------------
// PDF (A4, automatically continues on extra pages for long notices)
// ------------------------------------------------------------

export const downloadNoticePDF = async (node, fileName) => {
  if (!node) return;

  await waitForImages(node);
  await waitForFonts();

  const [{ default: html2canvas }, jspdfModule] = await Promise.all([
    import('html2canvas'),
    import('jspdf'),
  ]);
  const JsPDF = jspdfModule.jsPDF || jspdfModule.default;

  const canvas = await html2canvas(node, {
    scale: 2,
    useCORS: true,
    backgroundColor: '#ffffff',
    logging: false,
    // Render only the letter, at its real A4 size
    onclone: (clonedDoc, clonedEl) => {
      const body = clonedDoc.body;
      body.innerHTML = '';
      body.style.margin = '0';
      body.style.padding = '0';
      body.style.background = '#ffffff';
      body.appendChild(clonedEl);
    },
  });

  const pdf = new JsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4', compress: true });
  const pageWidth = pdf.internal.pageSize.getWidth(); // 210
  const pageHeight = pdf.internal.pageSize.getHeight(); // 297

  // Height of one A4 page in canvas pixels
  const pagePx = Math.round((canvas.width * pageHeight) / pageWidth);

  if (canvas.height <= pagePx + 6) {
    // Fits one page
    const height = Math.min((canvas.height * pageWidth) / canvas.width, pageHeight);
    pdf.addImage(canvas.toDataURL('image/png', 1.0), 'PNG', 0, 0, pageWidth, height, undefined, 'FAST');
  } else {
    // Long notice: slice the canvas into A4 pages
    let offset = 0;
    let pageIndex = 0;

    while (offset < canvas.height - 6) {
      const sliceHeight = Math.min(pagePx, canvas.height - offset);

      const slice = document.createElement('canvas');
      slice.width = canvas.width;
      slice.height = sliceHeight;

      const ctx = slice.getContext('2d');
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, slice.width, slice.height);
      ctx.drawImage(canvas, 0, offset, canvas.width, sliceHeight, 0, 0, canvas.width, sliceHeight);

      if (pageIndex > 0) pdf.addPage();
      pdf.addImage(
        slice.toDataURL('image/png', 1.0),
        'PNG',
        0,
        0,
        pageWidth,
        (sliceHeight * pageWidth) / canvas.width,
        undefined,
        'FAST'
      );

      offset += sliceHeight;
      pageIndex += 1;
    }
  }

  pdf.setProperties({ title: fileName, author: 'Open IT Institute' });
  pdf.save(`${fileName}.pdf`);
};

// ------------------------------------------------------------
// Print (hidden iframe: no popup blockers, exact A4 layout)
// ------------------------------------------------------------

export const printNoticeNode = async (node, title = 'Notice') => {
  if (!node) return;

  await waitForImages(node);

  const iframe = document.createElement('iframe');
  iframe.setAttribute('aria-hidden', 'true');
  Object.assign(iframe.style, {
    position: 'fixed',
    right: '0',
    bottom: '0',
    width: '0',
    height: '0',
    border: '0',
  });
  document.body.appendChild(iframe);

  const doc = iframe.contentDocument || iframe.contentWindow.document;
  doc.open();
  doc.write(`<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>${escapeHtml(title)}</title>
    <base href="${window.location.origin}/" />
    <link rel="stylesheet" href="${FONT_HREF}" />
    <style>
      @page { size: A4; margin: 0; }
      * { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      html, body { margin: 0; padding: 0; background: #fff; }
      .sheet { width: 210mm; margin: 0 auto; }
      .sheet > div { width: 210mm !important; min-height: 297mm !important; }
    </style>
  </head>
  <body><div class="sheet">${node.outerHTML}</div></body>
</html>`);
  doc.close();

  await waitForImages(doc.body);

  // Give the web fonts a moment to load inside the iframe
  try {
    await Promise.race([
      doc.fonts?.ready,
      new Promise((resolve) => setTimeout(resolve, 2500)),
    ]);
  } catch {
    /* ignore */
  }

  iframe.contentWindow.onafterprint = () => {
    setTimeout(() => iframe.remove(), 300);
  };
  setTimeout(() => iframe.remove(), 120000); // safety net

  iframe.contentWindow.focus();
  iframe.contentWindow.print();
};
