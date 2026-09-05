/**
 * Branded Open Graph image generator (pure Node, zero dependencies).
 *
 * Produces public/og-image.png (1200x630) referenced by og:image and
 * twitter:image so social platforms and SEO crawlers never hit a 404 og-image
 * (the Ahrefs/rich-result "Image issues" caused by the missing og-image.jpg).
 *
 * Usage:  node scripts/generate-og-image.mjs
 * Output: public/og-image.png
 */
import fs from 'fs';
import path from 'path';
import zlib from 'zlib';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const OUT = path.join(__dirname, '..', 'public', 'og-image.png');

const W = 1200;
const H = 630;

/* ---------------------------------------------------------------------------
 * 5x7 pixel font (uppercase + space). Each glyph = 7 rows of 5 bits (MSB left).
 * ------------------------------------------------------------------------- */
const FONT = {
  A: [0b01110, 0b10001, 0b10001, 0b11111, 0b10001, 0b10001, 0b10001],
  B: [0b11110, 0b10001, 0b10001, 0b11110, 0b10001, 0b10001, 0b11110],
  C: [0b01110, 0b10001, 0b10000, 0b10000, 0b10000, 0b10001, 0b01110],
  D: [0b11110, 0b10001, 0b10001, 0b10001, 0b10001, 0b10001, 0b11110],
  E: [0b11111, 0b10000, 0b10000, 0b11110, 0b10000, 0b10000, 0b11111],
  F: [0b11111, 0b10000, 0b10000, 0b11110, 0b10000, 0b10000, 0b10000],
  G: [0b11110, 0b10001, 0b10000, 0b10111, 0b10001, 0b10001, 0b01111],
  H: [0b10001, 0b10001, 0b10001, 0b11111, 0b10001, 0b10001, 0b10001],
  I: [0b11111, 0b00100, 0b00100, 0b00100, 0b00100, 0b00100, 0b11111],
  L: [0b10000, 0b10000, 0b10000, 0b10000, 0b10000, 0b10000, 0b11111],
  M: [0b10001, 0b11011, 0b10101, 0b10101, 0b10001, 0b10001, 0b10001],
  N: [0b10001, 0b10001, 0b11001, 0b10101, 0b10011, 0b10001, 0b10001],
  O: [0b01110, 0b10001, 0b10001, 0b10001, 0b10001, 0b10001, 0b01110],
  P: [0b11110, 0b10001, 0b10001, 0b11110, 0b10000, 0b10000, 0b10000],
  R: [0b11110, 0b10001, 0b10001, 0b11110, 0b10100, 0b10010, 0b10001],
  S: [0b01111, 0b10000, 0b10000, 0b01110, 0b00001, 0b00001, 0b11110],
  T: [0b11111, 0b00100, 0b00100, 0b00100, 0b00100, 0b00100, 0b00100],
  U: [0b10001, 0b10001, 0b10001, 0b10001, 0b10001, 0b10001, 0b01110],
  W: [0b10001, 0b10001, 0b10001, 0b10101, 0b10101, 0b11011, 0b10001],
  Y: [0b10001, 0b10001, 0b01010, 0b00100, 0b00100, 0b00100, 0b00100],
  '.': [0b00000, 0b00000, 0b00000, 0b00000, 0b00000, 0b00000, 0b11000],
  ' ': [0b00000, 0b00000, 0b00000, 0b00000, 0b00000, 0b00000, 0b00000],
};

/* ---------------------------------------------------------------------------
 * Pixel canvas helpers
 * ------------------------------------------------------------------------- */
const px = new Uint8Array(W * H * 3);
const set = (x, y, [r, g, b]) => {
  if (x < 0 || x >= W || y < 0 || y >= H) return;
  const i = (y * W + x) * 3;
  px[i] = r; px[i + 1] = g; px[i + 2] = b;
};
const lerp = (a, b, t) => Math.round(a + (b - a) * t);
const mixRgb = (c1, c2, t) => [lerp(c1[0], c2[0], t), lerp(c1[1], c2[1], t), lerp(c1[2], c2[2], t)];

/**
 * Rasterize uppercase text centered horizontally; y = top of the glyph box.
 */
function drawText(text, y, scale, color, centerX = W / 2) {
  const glyphW = 6 * scale;                 // 5px glyph + 1px spacing, scaled
  const totalW = text.length * glyphW - scale;
  let x0 = Math.round(centerX - totalW / 2);
  for (const ch of text) {
    const glyph = FONT[ch] || FONT[' '];
    for (let row = 0; row < 7; row++) {
      const bits = glyph[row];
      for (let col = 0; col < 5; col++) {
        if (!(bits & (0b10000 >> col))) continue;
        for (let dy = 0; dy < scale; dy++) {
          for (let dx = 0; dx < scale; dx++) {
            set(x0 + col * scale + dx, y + row * scale + dy, color);
          }
        }
      }
    }
    x0 += glyphW;
  }
}

/** Brand gradient accent bar (#8b5cf6 → #ec4899). */
function drawAccentBar(y, height) {
  const c1 = [139, 92, 246];
  const c2 = [236, 72, 153];
  for (let yy = y; yy < y + height; yy++) {
    for (let x = 0; x < W; x++) set(x, yy, mixRgb(c1, c2, x / W));
  }
}

/* ---------------------------------------------------------------------------
 * Compose the 1200x630 canvas
 * ------------------------------------------------------------------------- */
// Vertical gradient background: #111827 -> #312e81 -> #4c1d95
const TOP = [17, 24, 39];
const MID = [49, 46, 129];
const BOT = [76, 29, 149];
for (let y = 0; y < H; y++) {
  const t = y / (H - 1);
  const c = t < 0.5 ? mixRgb(TOP, MID, t * 2) : mixRgb(MID, BOT, (t - 0.5) * 2);
  for (let x = 0; x < W; x++) set(x, y, c);
}

// Brand accent bar below the headline block
drawAccentBar(430, 10);

// Headline with hard drop shadow, then bright text on top
const SHADOW = [8, 8, 20];
const WHITE = [255, 255, 255];
const SOFT = [214, 216, 255];
const PINK = [255, 168, 214];

drawText('CONTENTANONYMITY', 212, 15, SHADOW);
drawText('CONTENTANONYMITY', 209, 15, WHITE);

// Tagline layers
drawText('BUILD YOUR', 356, 6, SHADOW);
drawText('BUILD YOUR', 353, 6, SOFT);
drawText('FACELESS CONTENT', 402, 6, SHADOW);
drawText('FACELESS CONTENT', 399, 6, PINK);
drawText('BUSINESS', 448, 6, SHADOW);
drawText('BUSINESS', 445, 6, SOFT);

// Footer URL strip
drawText('CONTENTANONYMITY.COM', 560, 4, [180, 175, 255]);

/* ---------------------------------------------------------------------------
 * PNG encoder (RGB, 8-bit, filter-type-0 scanlines, CRC32 chunks)
 * ------------------------------------------------------------------------- */
function crc32(buf) {
  let table = crc32.table;
  if (!table) {
    table = crc32.table = new Int32Array(256);
    for (let n = 0; n < 256; n++) {
      let c = n;
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      table[n] = c;
    }
  }
  let crc = -1;
  for (let i = 0; i < buf.length; i++) crc = table[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  return (crc ^ -1) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
}

function encodePNG() {
  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(W, 0);
  ihdr.writeUInt32BE(H, 4);
  ihdr[8] = 8;   // bit depth
  ihdr[9] = 2;   // color type: truecolor RGB
  // bytes 10-12 stay 0: compression, filter, interlace

  const stride = W * 3;
  const raw = Buffer.alloc((stride + 1) * H);
  for (let y = 0; y < H; y++) {
    raw[y * (stride + 1)] = 0; // filter: None
    px.subarray(y * stride, (y + 1) * stride).forEach((v, i) => {
      raw[y * (stride + 1) + 1 + i] = v;
    });
  }
  const idat = zlib.deflateSync(raw, { level: 9 });
  return Buffer.concat([
    sig,
    chunk('IHDR', ihdr),
    chunk('IDAT', idat),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

fs.writeFileSync(OUT, encodePNG());
const { size } = fs.statSync(OUT);
console.log(`✅ Generated ${path.relative(process.cwd(), OUT)} (${W}x${H}, ${size} bytes)`);