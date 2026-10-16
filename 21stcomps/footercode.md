// --- Component ---

"use client"



import \* as React from "react"



/\*\*

&#x20;\* Shutter Glyph Footer — a signal-orange closing section in monospace caps,

&#x20;\* with the brand set across the full width in a hand-drawn, geometric display

&#x20;\* alphabet. One letter is swapped for a "shutter": three black blades that

&#x20;\* meet at a pivot, and the pivot turns to follow the pointer.

&#x20;\*

&#x20;\* Top row: a newsletter signup (underlined field, arrow submit, invalid,

&#x20;\* sending and done states), social links, the copyright, legal links. Every

&#x20;\* link scrambles through mono glyphs on hover before it settles.

&#x20;\*

&#x20;\* The wordmark is SVG drawn here: every letter is built from rectangles,

&#x20;\* slanted strokes and elliptical bands, so it looks the same on any page and

&#x20;\* no font is loaded. Hover a letter and it slices along its waist; click one

&#x20;\* and it flips; click the shutter and its blades rotate a quarter turn.

&#x20;\*

&#x20;\* No dependencies and nothing fetched: React is the only import.

&#x20;\*/



// #region glyphs

// Pure: the alphabet, the shutter, layout and small helpers. Lifted out and run

// by the test.



export const clamp = (v: number, lo: number, hi: number): number => (v < lo ? lo : v > hi ? hi : v)



/\*\* Cap height of every glyph, in SVG units. The wordmark's viewBox is this tall. \*/

export const CAP = 100

const S = 19 // stem

const B = 17 // bar



const f = (n: number): string => String(Math.round(n \* 100) / 100)



/\*\* Axis-aligned box. \*/

export const rect = (x: number, y: number, w: number, h: number): string =>

&#x20; "M" + f(x) + " " + f(y) + "H" + f(x + w) + "V" + f(y + h) + "H" + f(x) + "Z"



/\*\* A slanted stroke `t` wide measured horizontally, from (x1, y1) at the top to (x2, y2) at the bottom. \*/

export const slant = (x1: number, y1: number, x2: number, y2: number, t: number): string =>

&#x20; "M" + f(x1) + " " + f(y1) + "H" + f(x1 + t) + "L" + f(x2 + t) + " " + f(y2) + "H" + f(x2) + "Z"



/\*\* Closed polygon from \[x, y, x, y, …]. \*/

export const poly = (pts: number\[]): string => {

&#x20; let d = ""

&#x20; for (let i = 0; i + 1 < pts.length; i += 2) d += (i ? "L" : "M") + f(pts\[i]) + " " + f(pts\[i + 1])

&#x20; return d + "Z"

}



const at = (cx: number, cy: number, rx: number, ry: number, deg: number): string => {

&#x20; const a = (deg \* Math.PI) / 180

&#x20; return f(cx + rx \* Math.cos(a)) + " " + f(cy + ry \* Math.sin(a))

}



/\*\*

&#x20;\* A band between an outer ellipse (rx, ry) and an inner one (rx - tx, ry - ty),

&#x20;\* from angle a0 to a1 in degrees. Angles grow clockwise on screen (0 = right,

&#x20;\* 90 = bottom); a1 < a0 runs the other way.

&#x20;\*/

export const band = (cx: number, cy: number, rx: number, ry: number, tx: number, ty: number, a0: number, a1: number): string => {

&#x20; const large = Math.abs(a1 - a0) > 180 ? 1 : 0

&#x20; const cw = a1 > a0 ? 1 : 0

&#x20; const irx = rx - tx

&#x20; const iry = ry - ty

&#x20; return (

&#x20;   "M" + at(cx, cy, rx, ry, a0) +

&#x20;   "A" + f(rx) + " " + f(ry) + " 0 " + large + " " + cw + " " + at(cx, cy, rx, ry, a1) +

&#x20;   "L" + at(cx, cy, irx, iry, a1) +

&#x20;   "A" + f(irx) + " " + f(iry) + " 0 " + large + " " + (1 - cw) + " " + at(cx, cy, irx, iry, a0) +

&#x20;   "Z"

&#x20; )

}



/\*\* A full elliptical ring (needs fill-rule evenodd). \*/

export const ring = (cx: number, cy: number, rx: number, ry: number, tx: number, ty: number): string => {

&#x20; const e = (r1: number, r2: number) =>

&#x20;   "M" + f(cx - r1) + " " + f(cy) +

&#x20;   "A" + f(r1) + " " + f(r2) + " 0 1 1 " + f(cx + r1) + " " + f(cy) +

&#x20;   "A" + f(r1) + " " + f(r2) + " 0 1 1 " + f(cx - r1) + " " + f(cy) + "Z"

&#x20; return e(rx, ry) + e(rx - tx, ry - ty)

}



/\*\* A D-shaped bowl: flat on the left, half an ellipse on the right (needs evenodd). \*/

export const bowl = (x: number, y: number, w: number, h: number, t: number, tb: number): string => {

&#x20; const ry = h / 2

&#x20; const rx = Math.min(w - t, ry \* 0.95)

&#x20; const sx = x + w - rx

&#x20; return (

&#x20;   "M" + f(x) + " " + f(y) + "H" + f(sx) +

&#x20;   "A" + f(rx) + " " + f(ry) + " 0 0 1 " + f(sx) + " " + f(y + h) + "H" + f(x) + "Z" +

&#x20;   "M" + f(x + t) + " " + f(y + tb) + "H" + f(sx) +

&#x20;   "A" + f(rx - t) + " " + f(ry - tb) + " 0 0 1 " + f(sx) + " " + f(y + h - tb) + "H" + f(x + t) + "Z"

&#x20; )

}



export type Glyph = { w: number; d: string\[] }



const SPACE: Glyph = { w: 42, d: \[] }



/\*\* The display alphabet, A–Z. Each glyph is CAP tall; its shapes overlap into one letter. \*/

export const GLYPHS: Record<string, Glyph> = {

&#x20; A: { w: 96, d: \[slant(37, 0, 0, 100, 23), slant(37, 0, 73, 100, 23), rect(18, 60, 60, 16)] },

&#x20; B: { w: 84, d: \[rect(0, 0, S, 100), bowl(0, 0, 78, 52, S, B), bowl(0, 52 - B, 84, 100 - 52 + B, S, B)] },

&#x20; C: { w: 90, d: \[band(45, 50, 45, 50, S + 2, B, -40, -320)] },

&#x20; D: { w: 90, d: \[rect(0, 0, S + 1, 100), bowl(0, 0, 90, 100, S + 2, B)] },

&#x20; E: { w: 72, d: \[rect(0, 0, S, 100), rect(0, 0, 72, B), rect(0, 41.5, 64, B), rect(0, 100 - B, 72, B)] },

&#x20; F: { w: 70, d: \[rect(0, 0, S, 100), rect(0, 0, 70, B), rect(0, 43, 62, B)] },

&#x20; G: { w: 94, d: \[band(47, 50, 47, 50, S + 2, B, -38, -360), rect(48, 46, 46, B)] },

&#x20; H: { w: 86, d: \[rect(0, 0, S, 100), rect(86 - S, 0, S, 100), rect(0, 42, 86, B)] },

&#x20; I: { w: S + 2, d: \[rect(0, 0, S + 2, 100)] },

&#x20; J: { w: 72, d: \[rect(72 - S, 0, S, 64), band(36, 62, 36, 38, S, B, 0, 180)] },

&#x20; K: { w: 86, d: \[rect(0, 0, S, 100), slant(62, 0, 10, 62, 24), slant(30, 42, 62, 100, 24)] },

&#x20; L: { w: 68, d: \[rect(0, 0, S, 100), rect(0, 100 - B, 68, B)] },

&#x20; M: { w: 112, d: \[rect(0, 0, S + 3, 100), slant(0, 0, 46, 100, 9), slant(68, 0, 40, 100, 22), rect(112 - S - 3, 0, S + 3, 100)] },

&#x20; N: { w: 88, d: \[rect(0, 0, S, 100), rect(88 - S, 0, S, 100), slant(0, 0, 63, 100, 25)] },

&#x20; O: { w: 100, d: \[ring(50, 50, 50, 50, S + 2, B)] },

&#x20; P: { w: 80, d: \[rect(0, 0, S, 100), bowl(0, 0, 80, 60, S, B)] },

&#x20; Q: { w: 100, d: \[ring(50, 50, 50, 50, S + 2, B), slant(50, 62, 78, 100, 22)] },

&#x20; R: { w: 84, d: \[rect(0, 0, S, 100), bowl(0, 0, 82, 58, S, B), slant(34, 50, 62, 100, 22)] },

&#x20; // Two bands that meet on the spine: r = (CAP + B) / 4 makes it exactly B thick.

&#x20; S: { w: 80, d: \[band(40, 29.25, 40, 29.25, S, B, -22, -273), band(40, 70.75, 40, 29.25, S, B, -93, 158)] },

&#x20; T: { w: 82, d: \[rect(0, 0, 82, B), rect(41 - S / 2 - 1, 0, S + 2, 100)] },

&#x20; // Stems run 2 past the band so the joins never show a hairline.

&#x20; U: { w: 86, d: \[rect(0, 0, S, 60), rect(86 - S, 0, S, 60), band(43, 58, 43, 42, S, B, 0, 180)] },

&#x20; V: { w: 94, d: \[slant(0, 0, 36, 100, 22), slant(72, 0, 36, 100, 22)] },

&#x20; W: { w: 132, d: \[slant(0, 0, 26, 100, 20), slant(56, 0, 26, 100, 20), slant(56, 0, 86, 100, 20), slant(112, 0, 86, 100, 20)] },

&#x20; X: { w: 92, d: \[slant(0, 0, 68, 100, 24), slant(68, 0, 0, 100, 24)] },

&#x20; Y: { w: 92, d: \[slant(0, 0, 35, 56, 22), slant(70, 0, 35, 56, 22), rect(35, 50, 22, 50)] },

&#x20; Z: { w: 80, d: \[rect(0, 0, 80, B), rect(0, 100 - B, 80, B), slant(56, B - 1, 0, 100 - B + 1, 24)] },

}



/\*\* Any character outside A–Z is a gap. \*/

export const glyphOf = (ch: string): Glyph => GLYPHS\[ch.toUpperCase()] ?? SPACE



/\*\* The shutter is a square, one cap tall. \*/

export const SHUTTER = 100

/\*\* Blade width along the edges it touches. \*/

const K = 21

/\*\* Where the pivot rests, in the shutter's own (unrotated) frame. \*/

export const REST = 77



/\*\* Rotate (x, y) by `turns` quarter turns clockwise about the shutter's centre. \*/

export const turn = (x: number, y: number, turns: number): \[number, number] => {

&#x20; const n = ((turns % 4) + 4) % 4

&#x20; let a = x

&#x20; let b = y

&#x20; for (let i = 0; i < n; i++) {

&#x20;   const t = a

&#x20;   a = SHUTTER - b

&#x20;   b = t

&#x20; }

&#x20; return \[a, b]

}



/\*\* Where the pivot rests for a given rotation. \*/

export const restPivot = (turns: number): \[number, number] => turn(REST, REST, turns)



/\*\*

&#x20;\* The shutter's three blades for a pivot at (px, py), rotated `turns` quarter

&#x20;\* turns. Built in the unrotated frame — one thin wedge from the top-left

&#x20;\* corner, two wide ones along the top and left edges — then turned.

&#x20;\*/

export const blades = (px: number, py: number, turns: number): number\[]\[] => {

&#x20; const \[qx, qy] = turn(clamp(px, 8, 92), clamp(py, 8, 92), -turns)

&#x20; const shapes = \[

&#x20;   \[0, 0, K, 0, qx, qy, 0, K],

&#x20;   \[qx, 0, SHUTTER, 0, SHUTTER, K, qx, qy],

&#x20;   \[0, qy, qx, qy, K, SHUTTER, 0, SHUTTER],

&#x20; ]

&#x20; return shapes.map((s) => {

&#x20;   const out: number\[] = \[]

&#x20;   for (let i = 0; i < s.length; i += 2) out.push(...turn(s\[i], s\[i + 1], turns))

&#x20;   return out

&#x20; })

}



export type Placed = { ch: string; x: number; w: number; shutter: boolean }



/\*\* Lay the word out left to right with a fixed gap. `shutterAt` swaps that letter for the shutter. \*/

export const layout = (word: string, shutterAt: number, gap: number = 12): { items: Placed\[]; width: number } => {

&#x20; const items: Placed\[] = \[]

&#x20; let x = 0

&#x20; Array.from(word).forEach((ch, i) => {

&#x20;   const shutter = i === shutterAt \&\& ch.trim() !== ""

&#x20;   const w = shutter ? SHUTTER : glyphOf(ch).w

&#x20;   items.push({ ch, x, w, shutter })

&#x20;   x += w + gap

&#x20; })

&#x20; return { items, width: Math.max(1, x - (items.length ? gap : 0)) }

}



/\*\* Frame-rate independent ease toward a target: `k` is the fraction closed per 1/60s. \*/

export const approach = (from: number, to: number, k: number, dt: number): number =>

&#x20; to + (from - to) \* Math.pow(1 - clamp(k, 0, 1), clamp(dt, 0, 0.1) \* 60)



const NOISE = "ABCDEFGHJKLMNPQRSTUVWXYZ0123456789#%\&\*+=/<>"



/\*\*

&#x20;\* One frame of the link scramble. Letters left of `progress` (0 → 1) are

&#x20;\* settled; the rest show a noise glyph picked from `seed`. Spaces and

&#x20;\* punctuation never scramble, so the line keeps its shape.

&#x20;\*/

export const scramble = (text: string, progress: number, seed: number): string => {

&#x20; const chars = Array.from(text)

&#x20; const settled = Math.floor(clamp(Number.isFinite(progress) ? progress : 1, 0, 1) \* chars.length)

&#x20; return chars

&#x20;   .map((ch, i) => {

&#x20;     if (i < settled || !/\[a-z0-9]/i.test(ch)) return ch

&#x20;     const r = Math.abs(Math.sin((i + 1) \* 12.9898 + seed \* 78.233) \* 43758.5453) % 1

&#x20;     return NOISE\[Math.floor(r \* NOISE.length)]

&#x20;   })

&#x20;   .join("")

}



/\*\* Loose email check: something@something.tld, no spaces. \*/

export const isEmail = (v: string): boolean => /^\[^\\s@]+@\[^\\s@]+\\.\[^\\s@]{2,}$/.test((v || "").trim())



/\*\* "#f9531f" / "#f53" → \[249, 83, 31]. Anything unparseable is null. \*/

export const parseHex = (hex: string): \[number, number, number] | null => {

&#x20; const m = /^#?(\[\\da-f]{3}|\[\\da-f]{6})$/i.exec((hex || "").trim())

&#x20; if (!m) return null

&#x20; const h = m\[1].length === 3 ? m\[1].replace(/./g, (c) => c + c) : m\[1]

&#x20; const n = parseInt(h, 16)

&#x20; return \[(n >> 16) \& 255, (n >> 8) \& 255, n \& 255]

}



/\*\* Mix two hex colours, `t` of the way from a to b. Unparseable input returns `a` as given. \*/

export const mixHex = (a: string, b: string, t: number): string => {

&#x20; const x = parseHex(a)

&#x20; const y = parseHex(b)

&#x20; if (!x || !y) return a

&#x20; const k = clamp(Number.isFinite(t) ? t : 0, 0, 1)

&#x20; return "#" + x.map((v, i) => Math.round(v + (y\[i] - v) \* k).toString(16).padStart(2, "0")).join("")

}



// #endregion



export type FooterLink = { label: string; href?: string }



export type ShutterGlyphFooterProps = {

&#x20; brand?: string

&#x20; /\*\* What the giant wordmark spells. Defaults to `brand`. Letters A–Z; anything else is a gap. \*/

&#x20; wordmark?: string

&#x20; /\*\* Index of the letter the shutter replaces. `-1` for none. \*/

&#x20; shutterAt?: number

&#x20; company?: string

&#x20; since?: number

&#x20; year?: number

&#x20; signupLabel?: string

&#x20; placeholder?: string

&#x20; /\*\*

&#x20;  \* Called with a valid address. Return or resolve `false`, or throw, to show

&#x20;  \* the error state. Without it the form pretends to send.

&#x20;  \*/

&#x20; onSubscribe?: (email: string) => void | boolean | Promise<void | boolean>

&#x20; socials?: FooterLink\[]

&#x20; legal?: FooterLink\[]

&#x20; onLinkClick?: (label: string, href?: string) => void

&#x20; background?: string

&#x20; ink?: string

&#x20; fontMono?: string

&#x20; /\*\* `false` holds the shutter still and skips the reveal and scramble. \*/

&#x20; animate?: boolean

&#x20; className?: string

}



const DEFAULT\_SOCIALS: FooterLink\[] = \[

&#x20; { label: "Instagram", href: "#" },

&#x20; { label: "Linked In", href: "#" },

&#x20; { label: "Spotify", href: "#" },

]



const DEFAULT\_LEGAL: FooterLink\[] = \[

&#x20; { label: "Terms \& Conditions", href: "#" },

&#x20; { label: "Privacy Policy", href: "#" },

&#x20; { label: "Cookies Policy", href: "#" },

]



const MONO =

&#x20; '"JetBrains Mono", "IBM Plex Mono", "Space Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace'



// One scoped stylesheet. Every rule sits under .sgf; element resets go through

// :where(.sgf) so they never out-rank the component's own classes or yours.

const CSS =

&#x20; ".sgf{position:relative;isolation:isolate;overflow:hidden;container-type:inline-size;color:var(--sgf-ink);background:linear-gradient(180deg,var(--sgf-top) 0%,var(--sgf-bg) 24%);font-family:var(--sgf-mono);font-size:clamp(11px,1.12cqw,13.5px);line-height:1.18;letter-spacing:.015em;text-transform:uppercase;-webkit-font-smoothing:antialiased}" +

&#x20; ".sgf ::selection{background:var(--sgf-ink);color:var(--sgf-bg)}" +

&#x20; ":where(.sgf) a{color:inherit;text-decoration:none}" +

&#x20; ":where(.sgf) button{font:inherit;color:inherit;letter-spacing:inherit;text-transform:inherit;background:none;border:0;padding:0;margin:0;cursor:pointer}" +

&#x20; ":where(.sgf) ul{list-style:none;margin:0;padding:0}" +

&#x20; ":where(.sgf) p{margin:0}" +

&#x20; ".sgf svg{max-width:none}" +

&#x20; ".sgf .sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}" +

&#x20; ".sgf-top{box-sizing:border-box;display:grid;grid-template-columns:minmax(0,2fr) minmax(0,1fr) minmax(0,2fr) auto;column-gap:24px;row-gap:36px;padding:clamp(64px,11.5cqw,150px) clamp(16px,2.6cqw,40px) 0}" +

&#x20; ".sgf-fade{transition:opacity .8s ease var(--sgf-d,0ms),translate .8s cubic-bezier(.2,.7,.1,1) var(--sgf-d,0ms)}" +

&#x20; ".sgf\[data-in='false'] .sgf-fade{opacity:0;translate:0 10px}" +

&#x20; // Signup.

&#x20; ".sgf-form{max-width:266px}" +

&#x20; ".sgf-lede{max-width:232px}" +

&#x20; ".sgf-field{position:relative;display:flex;align-items:center;margin-top:clamp(18px,2.2cqw,26px);padding:4px 0 5px;border-bottom:1px solid var(--sgf-ink)}" +

&#x20; ".sgf-field::after{content:'';position:absolute;left:0;right:0;bottom:-2px;height:2px;background:var(--sgf-ink);transform:scaleX(0);transform-origin:0 50%;transition:transform .5s cubic-bezier(.2,.8,.2,1)}" +

&#x20; ".sgf-field:focus-within::after{transform:scaleX(1)}" +

&#x20; ".sgf-field\[data-state='error']{animation:sgf-shake .42s cubic-bezier(.36,.07,.19,.97)}" +

&#x20; "@keyframes sgf-shake{20%,60%{translate:-5px 0}40%,80%{translate:5px 0}}" +

&#x20; ".sgf-input{flex:1;min-width:0;font:inherit;letter-spacing:inherit;text-transform:uppercase;color:inherit;background:transparent;border:0;outline:none;padding:0;margin:0;border-radius:0;-webkit-appearance:none;appearance:none}" +

&#x20; ".sgf-input::placeholder{color:var(--sgf-ink);opacity:1;transition:opacity .25s}" +

&#x20; ".sgf-input:focus::placeholder{opacity:.4}" +

&#x20; ".sgf-go{flex:none;display:grid;place-items:center;width:26px;height:20px;margin-right:-6px}" +

&#x20; ".sgf-go svg{width:11px;height:11px;transition:translate .35s cubic-bezier(.2,.8,.2,1)}" +

&#x20; ".sgf-go:hover svg,.sgf-go:focus-visible svg{translate:4px 0}" +

&#x20; ".sgf-go:focus-visible{outline:1px dashed var(--sgf-ink);outline-offset:1px}" +

&#x20; ".sgf-spin{display:inline-block;width:1ch;text-align:center}" +

&#x20; ".sgf-done{display:flex;align-items:center;gap:10px}" +

&#x20; ".sgf-done svg{width:12px;height:12px;flex:none}" +

&#x20; ".sgf-done button{margin-left:auto;opacity:.55;transition:opacity .2s}" +

&#x20; ".sgf-done button:hover,.sgf-done button:focus-visible{opacity:1;outline:none;text-decoration:underline;text-underline-offset:3px}" +

&#x20; ".sgf-msg{min-height:1.2em;margin-top:8px;font-size:.86em;opacity:.85}" +

&#x20; // Links: a mono label, an arrow that walks right, an underline that wipes in.

&#x20; ".sgf-list{display:flex;flex-direction:column;gap:clamp(5px,.6cqw,7px)}" +

&#x20; ".sgf-link{position:relative;display:inline-flex;align-items:center;gap:.65em;white-space:nowrap;padding:1px 0}" +

&#x20; ".sgf-link::after{content:'';position:absolute;left:0;right:1.6em;bottom:-2px;height:1px;background:currentColor;transform:scaleX(0);transform-origin:100% 50%;transition:transform .4s cubic-bezier(.2,.8,.2,1)}" +

&#x20; ".sgf-link:hover::after,.sgf-link:focus-visible::after{transform:scaleX(1);transform-origin:0 50%}" +

&#x20; ".sgf-link svg{width:.8em;height:.8em;flex:none;transition:translate .35s cubic-bezier(.2,.8,.2,1)}" +

&#x20; ".sgf-link:hover svg,.sgf-link:focus-visible svg{translate:5px 0}" +

&#x20; ".sgf-link:focus-visible{outline:none}" +

&#x20; ".sgf-copy{white-space:pre-line}" +

&#x20; // The wordmark.

&#x20; ".sgf-mark{box-sizing:border-box;padding:clamp(36px,4.6cqw,64px) clamp(16px,2.6cqw,40px) clamp(14px,2.1cqw,28px)}" +

&#x20; ".sgf-svg{display:block;width:100%;height:auto;overflow:hidden;fill:var(--sgf-ink)}" +

&#x20; ".sgf-rise{transition:transform 1.15s cubic-bezier(.16,.84,.2,1) var(--sgf-d,0ms)}" +

&#x20; ".sgf\[data-in='false'] .sgf-rise{transform:translateY(112px)}" +

&#x20; ".sgf-g{cursor:pointer}" +

&#x20; ".sgf-flip{transform-box:fill-box;transform-origin:50% 50%}" +

&#x20; ".sgf-flip.is-flip{animation:sgf-flip .7s cubic-bezier(.2,.8,.2,1)}" +

&#x20; "@keyframes sgf-flip{0%{transform:scaleY(1)}45%{transform:scaleY(-1)}100%{transform:scaleY(1)}}" +

&#x20; ".sgf-half{transition:transform .45s cubic-bezier(.2,.9,.25,1.15)}" +

&#x20; ".sgf-g:hover .sgf-up{transform:translate(5px,-1.5px)}" +

&#x20; ".sgf-g:hover .sgf-dn{transform:translate(-5px,1.5px)}" +

&#x20; ".sgf-sh polygon{transition:none}" +

&#x20; "@container (max-width: 760px){.sgf-top{grid-template-columns:minmax(0,1fr) minmax(0,1fr)}.sgf-top>:first-child,.sgf-top>.sgf-copy{grid-column:1 / -1}.sgf-copy{order:3}.sgf-form{max-width:360px}}" +

&#x20; "@container (max-width: 420px){.sgf-top{grid-template-columns:minmax(0,1fr)}}" +

&#x20; "@media (prefers-reduced-motion: reduce){.sgf .sgf-rise,.sgf .sgf-fade,.sgf .sgf-half,.sgf .sgf-link svg,.sgf .sgf-link::after,.sgf .sgf-field::after,.sgf .sgf-go svg{transition:none!important}.sgf .sgf-field,.sgf .sgf-flip{animation:none!important}.sgf\[data-in='false'] .sgf-rise{transform:none}.sgf\[data-in='false'] .sgf-fade{opacity:1;translate:none}}"



const Arrow = () => (

&#x20; <svg viewBox="0 0 12 12" aria-hidden="true">

&#x20;   <path d="M1 6h9.2M6.4 2.2 10.2 6l-3.8 3.8" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="square" />

&#x20; </svg>

)



const Check = () => (

&#x20; <svg viewBox="0 0 12 12" aria-hidden="true">

&#x20;   <path d="M1.5 6.4 4.6 9.4 10.6 2.6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />

&#x20; </svg>

)



const external = (href?: string) => (href \&\& /^https?:/.test(href) ? { target: "\_blank", rel: "noreferrer" } : {})



/\*\* A mono link whose label scrambles through noise glyphs on hover, then settles. \*/

function ScrambleLink({

&#x20; link,

&#x20; still,

&#x20; onFollow,

&#x20; style,

}: {

&#x20; link: FooterLink

&#x20; still: boolean

&#x20; onFollow: (e: React.MouseEvent<HTMLAnchorElement>, l: FooterLink) => void

&#x20; style?: React.CSSProperties

}) {

&#x20; const textRef = React.useRef<HTMLSpanElement>(null)

&#x20; const raf = React.useRef(0)

&#x20; const text = link.label



&#x20; const run = () => {

&#x20;   const el = textRef.current

&#x20;   if (still || !el) return

&#x20;   cancelAnimationFrame(raf.current)

&#x20;   const t0 = performance.now()

&#x20;   const seed = Math.random() \* 100

&#x20;   let n = 0

&#x20;   const step = (now: number) => {

&#x20;     const p = (now - t0) / 420

&#x20;     if (p >= 1) {

&#x20;       el.textContent = text

&#x20;       return

&#x20;     }

&#x20;     // A new noise glyph every other frame reads as typing, not static.

&#x20;     if (n++ % 2 === 0) el.textContent = scramble(text, p, seed + Math.floor(n / 2))

&#x20;     raf.current = requestAnimationFrame(step)

&#x20;   }

&#x20;   raf.current = requestAnimationFrame(step)

&#x20; }



&#x20; React.useEffect(() => () => cancelAnimationFrame(raf.current), \[])



&#x20; return (

&#x20;   <li className="sgf-fade" style={style}>

&#x20;     <a

&#x20;       className="sgf-link"

&#x20;       href={link.href || "#"}

&#x20;       aria-label={text}

&#x20;       onPointerEnter={run}

&#x20;       onFocus={run}

&#x20;       onClick={(e) => onFollow(e, link)}

&#x20;       {...external(link.href)}

&#x20;     >

&#x20;       <span ref={textRef} aria-hidden="true">

&#x20;         {text}

&#x20;       </span>

&#x20;       <Arrow />

&#x20;     </a>

&#x20;   </li>

&#x20; )

}



type FormState = "idle" | "error" | "sending" | "done" | "failed"



export default function ShutterGlyphFooter({

&#x20; brand = "Vanda",

&#x20; wordmark,

&#x20; shutterAt = 2,

&#x20; company,

&#x20; since = 2020,

&#x20; year = new Date().getFullYear(),

&#x20; signupLabel = "Sign up for the latest work, news \& insights",

&#x20; placeholder = "Email address",

&#x20; onSubscribe,

&#x20; socials = DEFAULT\_SOCIALS,

&#x20; legal = DEFAULT\_LEGAL,

&#x20; onLinkClick,

&#x20; background = "#f9531f",

&#x20; ink = "#0c0c0c",

&#x20; fontMono = MONO,

&#x20; animate = true,

&#x20; className = "",

}: ShutterGlyphFooterProps) {

&#x20; const word = ((wordmark ?? brand).trim() || brand).toUpperCase()

&#x20; const { items, width } = React.useMemo(() => layout(word, shutterAt), \[word, shutterAt])

&#x20; const shutter = items.find((it) => it.shutter)



&#x20; const uid = React.useId().replace(/\[^a-zA-Z0-9\_-]/g, "")

&#x20; const upId = "sgf-up-" + uid

&#x20; const dnId = "sgf-dn-" + uid



&#x20; const rootRef = React.useRef<HTMLElement>(null)

&#x20; const svgRef = React.useRef<SVGSVGElement>(null)

&#x20; const bladeRefs = React.useRef<(SVGPolygonElement | null)\[]>(\[])

&#x20; const ptr = React.useRef({ x: 0, y: 0, inside: false })

&#x20; const \[turns, setTurns] = React.useState(0)

&#x20; const pivot = React.useRef<\[number, number]>(restPivot(0))



&#x20; const \[reduced, setReduced] = React.useState(false)

&#x20; React.useEffect(() => {

&#x20;   const mq = window.matchMedia("(prefers-reduced-motion: reduce)")

&#x20;   const onMq = () => setReduced(mq.matches)

&#x20;   onMq()

&#x20;   mq.addEventListener("change", onMq)

&#x20;   return () => mq.removeEventListener("change", onMq)

&#x20; }, \[])

&#x20; const still = reduced || !animate



&#x20; // Reveal once, the first time the footer is on screen; the shutter only

&#x20; // tracks while it is.

&#x20; const \[seen, setSeen] = React.useState(false)

&#x20; const \[visible, setVisible] = React.useState(false)

&#x20; React.useEffect(() => {

&#x20;   const root = rootRef.current

&#x20;   if (!root) return

&#x20;   const io = new IntersectionObserver(

&#x20;     (\[e]) => {

&#x20;       setVisible(e.isIntersecting)

&#x20;       if (e.isIntersecting) setSeen(true)

&#x20;     },

&#x20;     { threshold: 0.1 },

&#x20;   )

&#x20;   io.observe(root)

&#x20;   return () => io.disconnect()

&#x20; }, \[])



&#x20; // The shutter's pivot eases toward the pointer, written straight to the

&#x20; // polygons so tracking never re-renders React.

&#x20; React.useEffect(() => {

&#x20;   if (!shutter) return

&#x20;   const paint = (x: number, y: number) => {

&#x20;     blades(x, y, turns).forEach((pts, i) => {

&#x20;       bladeRefs.current\[i]?.setAttribute("points", pts.map(f).join(" "))

&#x20;     })

&#x20;   }

&#x20;   const rest = restPivot(turns)

&#x20;   if (still || !visible) {

&#x20;     pivot.current = rest

&#x20;     paint(rest\[0], rest\[1])

&#x20;     return

&#x20;   }

&#x20;   let raf = 0

&#x20;   let last = performance.now()

&#x20;   const tick = (now: number) => {

&#x20;     const dt = Math.min(0.1, (now - last) / 1000)

&#x20;     last = now

&#x20;     const p = ptr.current

&#x20;     const tx = p.inside ? clamp(p.x, 8, 92) : rest\[0]

&#x20;     const ty = p.inside ? clamp(p.y, 8, 92) : rest\[1]

&#x20;     const \[x, y] = pivot.current

&#x20;     pivot.current = \[approach(x, tx, 0.12, dt), approach(y, ty, 0.12, dt)]

&#x20;     paint(pivot.current\[0], pivot.current\[1])

&#x20;     raf = requestAnimationFrame(tick)

&#x20;   }

&#x20;   raf = requestAnimationFrame(tick)

&#x20;   return () => cancelAnimationFrame(raf)

&#x20; }, \[shutter, still, visible, turns])



&#x20; const onPointer = (e: React.PointerEvent<HTMLElement>) => {

&#x20;   const svg = svgRef.current

&#x20;   const p = ptr.current

&#x20;   p.inside = e.type !== "pointerleave"

&#x20;   if (!svg || !shutter) return

&#x20;   // Pointer in the shutter's own units, from the SVG's on-screen box.

&#x20;   const r = svg.getBoundingClientRect()

&#x20;   const scale = r.width / width || 1

&#x20;   p.x = (e.clientX - r.left) / scale - shutter.x

&#x20;   p.y = (e.clientY - r.top) / scale

&#x20; }



&#x20; const flip = (e: React.MouseEvent<SVGGElement>) => {

&#x20;   if (still) return

&#x20;   const el = e.currentTarget

&#x20;   el.classList.remove("is-flip")

&#x20;   void el.getBoundingClientRect()

&#x20;   el.classList.add("is-flip")

&#x20; }



&#x20; const follow = (e: React.MouseEvent<HTMLAnchorElement>, l: FooterLink) => {

&#x20;   // "#" and missing hrefs never touch the host page's URL hash.

&#x20;   if (!l.href || l.href === "#") e.preventDefault()

&#x20;   onLinkClick?.(l.label, l.href)

&#x20; }



&#x20; // ---- signup ----------------------------------------------------------------

&#x20; const \[email, setEmail] = React.useState("")

&#x20; const \[state, setState] = React.useState<FormState>("idle")

&#x20; const \[shake, setShake] = React.useState(0)

&#x20; const \[spin, setSpin] = React.useState(0)

&#x20; const inputRef = React.useRef<HTMLInputElement>(null)

&#x20; const alive = React.useRef(true)

&#x20; React.useEffect(() => {

&#x20;   alive.current = true

&#x20;   return () => {

&#x20;     alive.current = false

&#x20;   }

&#x20; }, \[])



&#x20; // The shake remounts the field (a fresh key restarts its animation), so the

&#x20; // caret is put back afterwards.

&#x20; React.useEffect(() => {

&#x20;   if (shake \&\& state === "error") inputRef.current?.focus()

&#x20; }, \[shake])



&#x20; React.useEffect(() => {

&#x20;   if (state !== "sending" || still) return

&#x20;   const id = window.setInterval(() => setSpin((s) => s + 1), 90)

&#x20;   return () => window.clearInterval(id)

&#x20; }, \[state, still])



&#x20; const submit = async (e: React.FormEvent) => {

&#x20;   e.preventDefault()

&#x20;   if (state === "sending") return

&#x20;   if (!isEmail(email)) {

&#x20;     setState("error")

&#x20;     setShake((n) => n + 1)

&#x20;     return

&#x20;   }

&#x20;   setState("sending")

&#x20;   let ok = true

&#x20;   try {

&#x20;     if (onSubscribe) ok = (await onSubscribe(email.trim())) !== false

&#x20;     else await new Promise((r) => setTimeout(r, 1100))

&#x20;   } catch {

&#x20;     ok = false

&#x20;   }

&#x20;   if (!alive.current) return

&#x20;   setState(ok ? "done" : "failed")

&#x20;   if (!ok) setShake((n) => n + 1)

&#x20; }



&#x20; const reset = () => {

&#x20;   setEmail("")

&#x20;   setState("idle")

&#x20;   requestAnimationFrame(() => inputRef.current?.focus())

&#x20; }



&#x20; const message =

&#x20;   state === "error"

&#x20;     ? "That doesn't look like an email"

&#x20;     : state === "failed"

&#x20;       ? "Couldn't sign you up. Try again"

&#x20;       : state === "sending"

&#x20;         ? "Sending"

&#x20;         : ""



&#x20; // ---- render ----------------------------------------------------------------

&#x20; const vars = {

&#x20;   "--sgf-bg": background,

&#x20;   "--sgf-top": mixHex(background, "#ffffff", 0.13),

&#x20;   "--sgf-ink": ink,

&#x20;   "--sgf-mono": fontMono,

&#x20; } as React.CSSProperties



&#x20; let d = 0

&#x20; const delay = () => ({ "--sgf-d": (d += 60) + "ms" }) as React.CSSProperties

&#x20; const label = company ?? "The " + brand + " Creative Co."

&#x20; const years = since \&\& since < year ? since + "—" + year : String(year)



&#x20; return (

&#x20;   <footer

&#x20;     ref={rootRef}

&#x20;     className={"sgf " + className}

&#x20;     style={vars}

&#x20;     data-in={seen || still ? "true" : "false"}

&#x20;     onPointerMove={onPointer}

&#x20;     onPointerEnter={onPointer}

&#x20;     onPointerLeave={onPointer}

&#x20;   >

&#x20;     <style>{CSS}</style>



&#x20;     <div className="sgf-top">

&#x20;       <form className="sgf-form sgf-fade" style={delay()} onSubmit={submit} noValidate>

&#x20;         <label htmlFor={"sgf-email-" + uid} className="sgf-lede" style={{ display: "block" }}>

&#x20;           {signupLabel}

&#x20;         </label>

&#x20;         <div className="sgf-field" data-state={state} key={shake}>

&#x20;           {state === "done" ? (

&#x20;             <div className="sgf-done" role="status">

&#x20;               <Check />

&#x20;               <span>You\&apos;re on the list</span>

&#x20;               <button type="button" onClick={reset}>

&#x20;                 Undo

&#x20;               </button>

&#x20;             </div>

&#x20;           ) : (

&#x20;             <>

&#x20;               <input

&#x20;                 ref={inputRef}

&#x20;                 id={"sgf-email-" + uid}

&#x20;                 className="sgf-input"

&#x20;                 type="email"

&#x20;                 inputMode="email"

&#x20;                 autoComplete="email"

&#x20;                 spellCheck={false}

&#x20;                 placeholder={placeholder}

&#x20;                 value={email}

&#x20;                 aria-invalid={state === "error" || undefined}

&#x20;                 aria-describedby={"sgf-msg-" + uid}

&#x20;                 disabled={state === "sending"}

&#x20;                 onChange={(e) => {

&#x20;                   setEmail(e.target.value)

&#x20;                   if (state === "error" || state === "failed") setState("idle")

&#x20;                 }}

&#x20;               />

&#x20;               <button className="sgf-go" type="submit" aria-label="Subscribe" disabled={state === "sending"}>

&#x20;                 {state === "sending" ? (

&#x20;                   <span className="sgf-spin" aria-hidden="true">

&#x20;                     {still ? "…" : "|/-\\\\"\[spin % 4]}

&#x20;                   </span>

&#x20;                 ) : (

&#x20;                   <Arrow />

&#x20;                 )}

&#x20;               </button>

&#x20;             </>

&#x20;           )}

&#x20;         </div>

&#x20;         <p id={"sgf-msg-" + uid} className="sgf-msg" aria-live="polite">

&#x20;           {message}

&#x20;         </p>

&#x20;       </form>



&#x20;       {socials.length > 0 \&\& (

&#x20;         <nav aria-label="Social">

&#x20;           <ul className="sgf-list">

&#x20;             {socials.map((l, i) => (

&#x20;               <ScrambleLink key={l.label + i} link={l} still={still} onFollow={follow} style={delay()} />

&#x20;             ))}

&#x20;           </ul>

&#x20;         </nav>

&#x20;       )}



&#x20;       <p className="sgf-copy sgf-fade" style={delay()}>

&#x20;         {"© " + years + "\\n" + label}

&#x20;       </p>



&#x20;       {legal.length > 0 \&\& (

&#x20;         <nav aria-label="Legal">

&#x20;           <ul className="sgf-list">

&#x20;             {legal.map((l, i) => (

&#x20;               <ScrambleLink key={l.label + i} link={l} still={still} onFollow={follow} style={delay()} />

&#x20;             ))}

&#x20;           </ul>

&#x20;         </nav>

&#x20;       )}

&#x20;     </div>



&#x20;     <div className="sgf-mark">

&#x20;       <p className="sr-only">{word}</p>

&#x20;       <svg

&#x20;         ref={svgRef}

&#x20;         className="sgf-svg"

&#x20;         viewBox={"0 0 " + f(width) + " " + CAP}

&#x20;         style={{ aspectRatio: width + " / " + CAP }}

&#x20;         aria-hidden="true"

&#x20;         focusable="false"

&#x20;       >

&#x20;         <defs>

&#x20;           {/\* Every letter is drawn twice, cut at its waist; hover slides the halves apart. \*/}

&#x20;           <clipPath id={upId} clipPathUnits="userSpaceOnUse">

&#x20;             <rect x={-40} y={-200} width={400} height={252.6} />

&#x20;           </clipPath>

&#x20;           <clipPath id={dnId} clipPathUnits="userSpaceOnUse">

&#x20;             <rect x={-40} y={51.4} width={400} height={250} />

&#x20;           </clipPath>

&#x20;         </defs>

&#x20;         {items.map((it, i) => {

&#x20;           if (it.ch.trim() === "") return null

&#x20;           const rise = { "--sgf-d": 200 + i \* 90 + "ms" } as React.CSSProperties

&#x20;           if (it.shutter) {

&#x20;             const rest = restPivot(turns)

&#x20;             return (

&#x20;               <g key={i} transform={"translate(" + f(it.x) + " 0)"}>

&#x20;                 <g className="sgf-rise" style={rise}>

&#x20;                   <g className="sgf-g sgf-sh" onClick={() => setTurns((t) => t + 1)}>

&#x20;                     <rect width={SHUTTER} height={CAP} fill="transparent" />

&#x20;                     {blades(rest\[0], rest\[1], turns).map((pts, b) => (

&#x20;                       <polygon

&#x20;                         key={b}

&#x20;                         ref={(el) => {

&#x20;                           bladeRefs.current\[b] = el

&#x20;                         }}

&#x20;                         points={pts.map(f).join(" ")}

&#x20;                       />

&#x20;                     ))}

&#x20;                   </g>

&#x20;                 </g>

&#x20;               </g>

&#x20;             )

&#x20;           }

&#x20;           const g = glyphOf(it.ch)

&#x20;           const paths = g.d.map((p, k) => <path key={k} d={p} fillRule="evenodd" />)

&#x20;           return (

&#x20;             <g key={i} transform={"translate(" + f(it.x) + " 0)"}>

&#x20;               <g className="sgf-rise" style={rise}>

&#x20;                 <g

&#x20;                   className="sgf-g sgf-flip"

&#x20;                   onClick={flip}

&#x20;                   onAnimationEnd={(e) => e.currentTarget.classList.remove("is-flip")}

&#x20;                 >

&#x20;                   <rect width={g.w} height={CAP} fill="transparent" />

&#x20;                   <g clipPath={"url(#" + upId + ")"}>

&#x20;                     <g className="sgf-half sgf-up">{paths}</g>

&#x20;                   </g>

&#x20;                   <g clipPath={"url(#" + dnId + ")"}>

&#x20;                     <g className="sgf-half sgf-dn">{paths}</g>

&#x20;                   </g>

&#x20;                 </g>

&#x20;               </g>

&#x20;             </g>

&#x20;           )

&#x20;         })}

&#x20;       </svg>

&#x20;     </div>

&#x20;   </footer>

&#x20; )

}





// --- Demo ---

"use client"



import ShutterGlyphFooter from "@/components/ui/shutter-glyph-footer"



// The same footer re-branded and re-inked: bone on black, the shutter on the

// third letter, other links, and a signup handler that can fail — try

// fail@example.com to see the error state.

export default function Demo() {

&#x20; return (

&#x20;   <div className="w-full bg-\[#111110]">

&#x20;     <ShutterGlyphFooter

&#x20;       brand="Verso"

&#x20;       company="Verso Type \& Print"

&#x20;       since={2017}

&#x20;       background="#111110"

&#x20;       ink="#efe9dc"

&#x20;       signupLabel="Monthly letters from the print room"

&#x20;       placeholder="Your email"

&#x20;       socials={\[

&#x20;         { label: "Are.na", href: "#" },

&#x20;         { label: "Instagram", href: "#" },

&#x20;         { label: "Bandcamp", href: "#" },

&#x20;       ]}

&#x20;       legal={\[

&#x20;         { label: "Imprint", href: "#" },

&#x20;         { label: "Privacy", href: "#" },

&#x20;       ]}

&#x20;       onSubscribe={async (email) => {

&#x20;         await new Promise((r) => setTimeout(r, 900))

&#x20;         return !email.startsWith("fail@")

&#x20;       }}

&#x20;       onLinkClick={(label) => console.log("footer link:", label)}

&#x20;     />

&#x20;   </div>

&#x20; )

}



