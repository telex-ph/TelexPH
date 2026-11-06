// Turns whatever the admin drops in into something the newsletter AI can use:
//   image      -> read as a design (server)
//   PDF        -> every page drawn to an image, then read as a design
//   PPTX/DOCX  -> the text is pulled out, and AI designs the layout from it (no pictures carried over)
import { unzipSync, strFromU8 } from "fflate";

const SERVER_TYPES = ["image/png", "image/jpeg", "image/webp"]; // what the server accepts as-is
const UPLOAD_MAX = 4 * 1024 * 1024; // keep in step with newsletter.routes.js
const MAX_SIDE = 2400; // px, longest side after conversion
const PDF_WIDTH = 1400; // px; sharp enough to read small print, still well under the 4MB upload cap as JPEG
const IMAGE_EXT = /\.(png|apng|jpe?g|jfif|webp|gif|bmp|avif|svg|ico|tiff?|heic|heif)$/i;

function kindOf(file) {
  const name = file.name.toLowerCase();
  if (file.type === "application/pdf" || name.endsWith(".pdf")) return "pdf";
  if (name.endsWith(".pptx")) return "pptx";
  if (name.endsWith(".docx")) return "docx";
  if (file.type.startsWith("image/") || IMAGE_EXT.test(name)) return "image";
  return null;
}

const loadImg = (file) => new Promise((resolve, reject) => {
  const url = URL.createObjectURL(file);
  const img = new Image();
  img.onload = () => { URL.revokeObjectURL(url); resolve(img); };
  img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("decode failed")); };
  img.src = url;
});

// Any picture the browser can show (GIF, BMP, AVIF, SVG, ICO...) plus HEIC and TIFF, which browsers can't.
// Returns something drawImage() accepts, or raw RGBA for TIFF, plus its pixel size.
async function decodeImage(file) {
  const name = file.name.toLowerCase();
  if (/\.hei[cf]$/.test(name) || /image\/hei[cf]/.test(file.type)) {
    const { heicTo } = await import("heic-to"); // wasm decoder, only loaded for HEIC
    const bmp = await heicTo({ blob: file, type: "bitmap" });
    return { src: bmp, w: bmp.width, h: bmp.height };
  }
  if (/\.tiff?$/.test(name) || file.type === "image/tiff") {
    const UTIF = (await import("utif")).default;
    const buf = await file.arrayBuffer();
    const ifd = UTIF.decode(buf)[0];
    UTIF.decodeImage(buf, ifd);
    return { rgba: new Uint8ClampedArray(UTIF.toRGBA8(ifd)), w: ifd.width, h: ifd.height };
  }
  try {
    const bmp = await createImageBitmap(file);
    return { src: bmp, w: bmp.width, h: bmp.height };
  } catch {
    // SVG and a few others only decode through <img>. SVGs often have no fixed size, so give them a readable one.
    const img = await loadImg(file);
    const svg = /svg/.test(file.type) || name.endsWith(".svg");
    const w = svg ? Math.max(img.naturalWidth || 0, 1400) : img.naturalWidth;
    const h = svg ? Math.round(w * ((img.naturalHeight || 1) / (img.naturalWidth || 1))) : img.naturalHeight;
    return { src: img, w, h };
  }
}

// Anything that is not already a small PNG/JPG/WebP becomes a JPEG the server will take (and that fits 4MB).
// Transparency goes on white. Animated GIFs keep their first frame.
async function imageToUploadFile(file) {
  if (SERVER_TYPES.includes(file.type) && file.size <= UPLOAD_MAX) return file;
  let decoded;
  try {
    decoded = await decodeImage(file);
  } catch (e) {
    console.error("[newsletter] image decode", e);
    throw new Error("couldn't open this image. Try saving it as JPG or PNG.");
  }
  const { src, rgba, w, h } = decoded;
  let scale = Math.min(1, MAX_SIDE / Math.max(w, h));
  let quality = 0.9;
  for (let attempt = 0; attempt < 6; attempt++) {
    const canvas = Object.assign(document.createElement("canvas"), { width: Math.max(1, Math.round(w * scale)), height: Math.max(1, Math.round(h * scale)) });
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    if (rgba) {
      const tmp = Object.assign(document.createElement("canvas"), { width: w, height: h });
      tmp.getContext("2d").putImageData(new ImageData(rgba, w, h), 0, 0);
      ctx.drawImage(tmp, 0, 0, canvas.width, canvas.height);
    } else {
      ctx.drawImage(src, 0, 0, canvas.width, canvas.height);
    }
    const blob = await new Promise((res) => canvas.toBlob(res, "image/jpeg", quality));
    if (blob && blob.size <= UPLOAD_MAX) return new File([blob], file.name.replace(/\.[^.]+$/, "") + ".jpg", { type: "image/jpeg" });
    scale *= 0.8;
    quality = 0.8;
  }
  throw new Error("this image is too large to shrink under 4MB.");
}

// pdf.js is big, so it only loads when someone actually drops a PDF.
async function pdfToImages(file, maxPages) {
  const pdfjs = await import("pdfjs-dist");
  pdfjs.GlobalWorkerOptions.workerSrc = (await import("pdfjs-dist/build/pdf.worker.min.mjs?url")).default;
  const task = pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()) });
  const doc = await task.promise;
  const total = doc.numPages;
  const base = file.name.replace(/\.pdf$/i, "");
  const files = [];
  try {
    for (let i = 1; i <= Math.min(total, maxPages); i++) {
      const page = await doc.getPage(i);
      const viewport = page.getViewport({ scale: PDF_WIDTH / page.getViewport({ scale: 1 }).width });
      const canvas = Object.assign(document.createElement("canvas"), { width: Math.round(viewport.width), height: Math.round(viewport.height) });
      await page.render({ canvas, viewport }).promise;
      const blob = await new Promise((res) => canvas.toBlob(res, "image/jpeg", 0.88));
      files.push(new File([blob], `${base} p${i}.jpg`, { type: "image/jpeg" }));
    }
  } finally {
    task.destroy(); // frees the worker; the document object itself has no destroy()
  }
  return { files, total };
}

const paragraphs = (xml, tag, text) => [...xml.getElementsByTagName(tag)].map((p) => ({ p, s: [...p.getElementsByTagName(text)].map((t) => t.textContent).join("").trim() })).filter((x) => x.s);

// Slides become blocks (first line = title). Word files become one block per heading.
async function officeToContent(file, kind) {
  const isSlide = (n) => /^ppt\/slides\/slide\d+\.xml$/.test(n);
  const parts = unzipSync(new Uint8Array(await file.arrayBuffer()), {
    filter: (f) => f.originalSize < 8e6 && (kind === "pptx" ? isSlide(f.name) : f.name === "word/document.xml")
  });
  const parse = (u8) => new DOMParser().parseFromString(strFromU8(u8), "application/xml");
  if (kind === "pptx") {
    return Object.keys(parts)
      .sort((a, b) => parseInt(a.match(/\d+/)[0], 10) - parseInt(b.match(/\d+/)[0], 10))
      .map((name) => {
        const lines = paragraphs(parse(parts[name]), "a:p", "a:t").map((x) => x.s);
        return { title: lines[0] || "", text: lines.slice(1).join("\n") };
      })
      .filter((b) => b.title || b.text);
  }
  const doc = parts["word/document.xml"];
  if (!doc) return [];
  const blocks = [];
  for (const { p, s } of paragraphs(parse(doc), "w:p", "w:t")) {
    const style = p.getElementsByTagName("w:pStyle")[0]?.getAttribute("w:val") || "";
    if (/^(Heading|Title)/i.test(style) || !blocks.length) blocks.push({ title: s, text: "" });
    else blocks.at(-1).text += (blocks.at(-1).text ? "\n" : "") + s;
  }
  return blocks;
}

// What the suggestion AI needs from pages already read: the content as typed blocks (their grid position is dropped,
// the AI re-arranges them) and the palette of the upload. Pictures are not carried over.
function contentFromPages(pages) {
  const content = [];
  const bare = (b) => JSON.parse(JSON.stringify(b, (k, v) => (k === "img" || k === "logo" ? undefined : v))); // uploaded photos are not content
  for (const p of pages) {
    for (const s of p.layout?.sections || []) {
      if (s.type === "columns") s.cols.forEach((c) => content.push(...c.blocks.map(bare)));
      else content.push(bare(s));
    }
    // Older issues were stacked bands; image bands have no text.
    for (const b of p.layout?.bands || []) {
      if (b.type !== "image") content.push({ title: b.title, subtitle: b.subtitle, text: b.text, columns: b.columns });
    }
  }
  return { content, theme: pages.find((p) => p.layout?.theme)?.layout.theme };
}

export { kindOf, imageToUploadFile, pdfToImages, officeToContent, contentFromPages };
