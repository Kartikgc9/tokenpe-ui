You are given a task to integrate an existing React component in the codebase



The codebase should support:

\- shadcn project structure  

\- Tailwind CSS

\- Typescript



If it doesn't, provide instructions on how to setup project via shadcn CLI, install Tailwind or Typescript.



Determine the default path for components and styles. 

If default path for components is not /components/ui, provide instructions on why it's important to create this folder

Copy-paste this component to /components/ui folder:

```tsx

horizon-glow-hero.tsx

"use client";



import \* as React from "react";

import {

&#x20; animate,

&#x20; motion,

&#x20; useMotionTemplate,

&#x20; useMotionValue,

&#x20; useReducedMotion,

&#x20; useTransform,

&#x20; type MotionValue,

} from "motion/react";

import { cn } from "@/lib/utils";



/\* ── types ───────────────────────────────────────────────────── \*/



export interface HorizonGlowHeroProps {

&#x20; /\*\* Small line above the headline. \*/

&#x20; eyebrow?: React.ReactNode;

&#x20; /\*\* The headline. \*/

&#x20; title: React.ReactNode;

&#x20; /\*\* Optional content under the headline (CTAs, a form…). \*/

&#x20; children?: React.ReactNode;

&#x20; /\*\*

&#x20;  \* Conic gradient painted on the planet's rim. 0deg is the top of the

&#x20;  \* horizon; the wipe opens it from the left (180–360deg) first. Defaults to

&#x20;  \* the shadcn chart tokens.

&#x20;  \*/

&#x20; rimGradient?: string;

&#x20; className?: string;

}



/\* ── constants ───────────────────────────────────────────────── \*/



// Built from shadcn chart tokens so the rim follows the host theme: in the

// default dark palette that reads blue on the right, red on the left and

// yellow near the top — like light catching a planet's atmosphere.

const DEFAULT\_RIM =

&#x20; "conic-gradient(from 0deg at 50% 50%, var(--color-foreground) 0deg, var(--color-chart-2) 10deg, var(--color-chart-1) 60deg, var(--color-chart-1) 180deg, var(--color-chart-5) 180deg, var(--color-chart-5) 300deg, var(--color-chart-3) 350deg, var(--color-foreground) 360deg)";



// Dims the rim right at the top of the arc so the brightest white doesn't

// punch a hole in the headline above it.

const RIM\_MASK =

&#x20; "conic-gradient(from 0deg at 50% 50%, rgba(0,0,0,0.4) 0deg, #000 35deg, #000 325deg, rgba(0,0,0,0.4) 360deg)";



// Falling light streaks. Fixed values (not Math.random) so server and client

// render the same markup.

const STREAKS = \[

&#x20; { left: "2%", scaleX: 0.68, scaleY: 0.79, peak: 0.2, duration: 7, delay: 0 },

&#x20; {

&#x20;   left: "10%",

&#x20;   scaleX: 0.54,

&#x20;   scaleY: 0.65,

&#x20;   peak: 0.16,

&#x20;   duration: 9,

&#x20;   delay: 3.2,

&#x20; },

&#x20; {

&#x20;   left: "29%",

&#x20;   scaleX: 0.63,

&#x20;   scaleY: 0.92,

&#x20;   peak: 0.22,

&#x20;   duration: 8,

&#x20;   delay: 1.4,

&#x20; },

&#x20; {

&#x20;   left: "41%",

&#x20;   scaleX: 1,

&#x20;   scaleY: 0.66,

&#x20;   peak: 0.21,

&#x20;   duration: 10,

&#x20;   delay: 5.1,

&#x20; },

&#x20; {

&#x20;   left: "67%",

&#x20;   scaleX: 0.71,

&#x20;   scaleY: 0.65,

&#x20;   peak: 0.26,

&#x20;   duration: 7.5,

&#x20;   delay: 2.3,

&#x20; },

&#x20; {

&#x20;   left: "81%",

&#x20;   scaleX: 0.86,

&#x20;   scaleY: 0.9,

&#x20;   peak: 0.18,

&#x20;   duration: 8.5,

&#x20;   delay: 4.4,

&#x20; },

];



/\* ── helpers ─────────────────────────────────────────────────── \*/



const useIsomorphicLayoutEffect =

&#x20; typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;



/\*\* Maps a slice of the scroll progress onto an output range. \*/

function useStep<T extends number>(

&#x20; progress: MotionValue<number>,

&#x20; \[from, to]: \[number, number],

&#x20; output: \[T, T],

) {

&#x20; return useTransform(progress, \[from, to], output, { clamp: true });

}



/\*\*

&#x20;\* A square that shares the planet's centre. Every layer (glow, disk, rim)

&#x20;\* renders one of these, so they stay concentric at any size. `grow` pushes

&#x20;\* the edge outward by a CSS length.

&#x20;\*/

function Orb({

&#x20; grow = "0px",

&#x20; className,

&#x20; style,

&#x20; children,

}: {

&#x20; grow?: string;

&#x20; className?: string;

&#x20; style?: React.CSSProperties;

&#x20; children?: React.ReactNode;

}) {

&#x20; const size = `calc(var(--orb) + 2 \* ${grow})`;

&#x20; return (

&#x20;   <div

&#x20;     className={cn("absolute left-1/2", className)}

&#x20;     style={{

&#x20;       width: size,

&#x20;       height: size,

&#x20;       marginLeft: `calc(${size} / -2)`,

&#x20;       top: `calc(100% - var(--cap) - ${grow})`,

&#x20;       ...style,

&#x20;     }}

&#x20;   >

&#x20;     {children}

&#x20;   </div>

&#x20; );

}



/\* ── component ───────────────────────────────────────────────── \*/



/\*\*

&#x20;\* A dark "planet horizon" hero. As the section scrolls, a halo swells behind

&#x20;\* the arc, a colour rim wipes on from left to right and saturates, and the

&#x20;\* headline un-blurs into place above it.

&#x20;\*

&#x20;\* - The stage is sticky; the section's height is the scroll length. Tune it

&#x20;\*   with `className="h-\[…]"`. At viewport height or less it plays the reveal

&#x20;\*   once on mount instead.

&#x20;\* - Every surface is a shadcn token, so it follows light and dark themes.

&#x20;\*   The rim uses the chart tokens — override it with `rimGradient`.

&#x20;\*

&#x20;\* Honours `prefers-reduced-motion`: renders fully revealed, no streaks, no

&#x20;\* scroll listener.

&#x20;\*/

export function HorizonGlowHero({

&#x20; eyebrow,

&#x20; title,

&#x20; children,

&#x20; rimGradient = DEFAULT\_RIM,

&#x20; className,

}: HorizonGlowHeroProps) {

&#x20; const prefersReducedMotion = useReducedMotion();

&#x20; const still = Boolean(prefersReducedMotion);

&#x20; const sectionRef = React.useRef<HTMLElement>(null);

&#x20; const edgeId = React.useId();



&#x20; // 0 → 1 as the section scrolls through. Read from the section's own window

&#x20; // (not motion's `useScroll`, which binds to the global one) so it still

&#x20; // works when portaled into an iframe, like the docs preview.

&#x20; const progress = useMotionValue(0);



&#x20; useIsomorphicLayoutEffect(() => {

&#x20;   if (still) {

&#x20;     progress.set(1);

&#x20;     return;

&#x20;   }

&#x20;   const el = sectionRef.current;

&#x20;   if (!el) return;

&#x20;   const win = el.ownerDocument.defaultView ?? window;

&#x20;   // No scroll room (e.g. `className="h-svh"`): nothing to scrub, so play

&#x20;   // the reveal once on mount instead of sitting blank at progress 0.

&#x20;   // ponytail: decided once at mount; a later resize won't switch modes.

&#x20;   if (el.offsetHeight <= win.innerHeight) {

&#x20;     const controls = animate(progress, 1, { duration: 2.4, ease: "easeOut" });

&#x20;     return () => controls.stop();

&#x20;   }

&#x20;   let raf = 0;

&#x20;   const update = () => {

&#x20;     raf = 0;

&#x20;     const rect = el.getBoundingClientRect();

&#x20;     const travel = Math.max(1, rect.height - win.innerHeight);

&#x20;     progress.set(Math.min(1, Math.max(0, -rect.top / travel)));

&#x20;   };

&#x20;   const onScroll = () => {

&#x20;     if (!raf) raf = win.requestAnimationFrame(update);

&#x20;   };

&#x20;   update();

&#x20;   win.addEventListener("scroll", onScroll, { passive: true });

&#x20;   win.addEventListener("resize", onScroll);

&#x20;   return () => {

&#x20;     win.removeEventListener("scroll", onScroll);

&#x20;     win.removeEventListener("resize", onScroll);

&#x20;     if (raf) win.cancelAnimationFrame(raf);

&#x20;   };

&#x20; }, \[still, progress]);



&#x20; /\* timeline — each layer owns a slice of the scroll \*/

&#x20; const edgeOpacity = useStep(progress, \[0, 0.2], \[0, 1]);

&#x20; const haloOpacity = useStep(progress, \[0.05, 0.45], \[0, 1]);

&#x20; const haloScale = useStep(progress, \[0.05, 0.45], \[0.84, 1]);



&#x20; const rimOpacity = useStep(progress, \[0.1, 0.25], \[0, 1]);

&#x20; const wipe = useStep(progress, \[0.1, 0.65], \[0, 1]);

&#x20; // Right edge of the clip slides from 100% to -64px, opening the colour

&#x20; // left → right. The -64px margins leave room for the blur to bleed.

&#x20; const rimClip = useTransform(

&#x20;   wipe,

&#x20;   (t) => `inset(-64px calc(${(1 - t) \* 100}% - ${t \* 64}px) -64px -64px)`,

&#x20; );

&#x20; const rimHue = useStep(progress, \[0.1, 0.8], \[-40, 0]);

&#x20; const rimSat = useStep(progress, \[0.1, 0.8], \[0.35, 1.25]);

&#x20; const rimFilter = useMotionTemplate`hue-rotate(${rimHue}deg) saturate(${rimSat})`;



&#x20; const eyebrowOpacity = useStep(progress, \[0.35, 0.55], \[0, 1]);

&#x20; const eyebrowBlur = useStep(progress, \[0.35, 0.55], \[1.5, 0]);

&#x20; const titleOpacity = useStep(progress, \[0.45, 0.7], \[0, 1]);

&#x20; const titleBlur = useStep(progress, \[0.45, 0.7], \[2.5, 0]);

&#x20; const textY = useStep(progress, \[0.35, 0.7], \[4, 0]);

&#x20; const eyebrowFilter = useTransform(eyebrowBlur, (b) => `blur(${b}px)`);

&#x20; const titleFilter = useTransform(titleBlur, (b) => `blur(${b}px)`);



&#x20; return (

&#x20;   <section

&#x20;     ref={sectionRef}

&#x20;     aria-label="Hero"

&#x20;     className={cn("relative h-\[250vh] w-full bg-background", className)}

&#x20;   >

&#x20;     <div

&#x20;       className="sticky top-0 h-svh min-h-\[40rem] w-full overflow-hidden"

&#x20;       style={

&#x20;         {

&#x20;           // Planet diameter (in cqw, so it means the same thing in width,

&#x20;           // height and top) and how much of it pokes above the bottom edge.

&#x20;           containerType: "inline-size",

&#x20;           "--orb": "max(135cqw, 56rem)",

&#x20;           "--cap": "clamp(13rem, 42%, 22rem)",

&#x20;         } as React.CSSProperties

&#x20;       }

&#x20;     >

&#x20;       {/\* hairline texture \*/}

&#x20;       <div

&#x20;         aria-hidden

&#x20;         className="pointer-events-none absolute inset-0 text-foreground/\[0.035]"

&#x20;         style={{

&#x20;           backgroundImage:

&#x20;             "repeating-linear-gradient(to right, currentColor 0 1px, transparent 1px 8px)",

&#x20;         }}

&#x20;       />



&#x20;       {/\* falling streaks \*/}

&#x20;       {!still \&\& (

&#x20;         <div

&#x20;           aria-hidden

&#x20;           className="pointer-events-none absolute inset-0 overflow-hidden"

&#x20;         >

&#x20;           {STREAKS.map((s) => (

&#x20;             <motion.div

&#x20;               key={s.left}

&#x20;               className="absolute top-0 h-\[360px] w-0.5 origin-top-left"

&#x20;               style={{

&#x20;                 left: s.left,

&#x20;                 scaleX: s.scaleX,

&#x20;                 scaleY: s.scaleY,

&#x20;                 background:

&#x20;                   "linear-gradient(transparent, color-mix(in oklab, var(--color-foreground) 50%, transparent) 50%, transparent)",

&#x20;               }}

&#x20;               initial={{ y: "-100%", opacity: 0 }}

&#x20;               animate={{ y: \["-100%", "260%"], opacity: \[0, s.peak, 0] }}

&#x20;               transition={{

&#x20;                 duration: s.duration,

&#x20;                 delay: s.delay,

&#x20;                 repeat: Infinity,

&#x20;                 ease: "linear",

&#x20;               }}

&#x20;             />

&#x20;           ))}

&#x20;         </div>

&#x20;       )}



&#x20;       {/\* headline — sits 4rem above the top of the arc \*/}

&#x20;       <div

&#x20;         className="absolute inset-x-0 z-20 flex flex-col items-center px-6"

&#x20;         style={{ bottom: "calc(var(--cap) + 4rem)" }}

&#x20;       >

&#x20;         <motion.div

&#x20;           style={{ y: textY }}

&#x20;           className="flex max-w-full flex-col items-center gap-1 text-center"

&#x20;         >

&#x20;           {eyebrow \&\& (

&#x20;             <motion.p

&#x20;               style={{ opacity: eyebrowOpacity, filter: eyebrowFilter }}

&#x20;               className="text-sm text-muted-foreground will-change-\[filter,opacity] sm:text-base"

&#x20;             >

&#x20;               {eyebrow}

&#x20;             </motion.p>

&#x20;           )}

&#x20;           <motion.h2

&#x20;             style={{ opacity: titleOpacity, filter: titleFilter }}

&#x20;             className="max-w-full text-balance text-\[40px] font-semibold leading-none tracking-\[-0.024em] text-foreground will-change-\[filter,opacity] sm:text-\[48px] md:text-\[56px] lg:text-\[72px] xl:text-\[96px]"

&#x20;           >

&#x20;             {title}

&#x20;           </motion.h2>

&#x20;           {children \&\& (

&#x20;             <motion.div

&#x20;               style={{ opacity: titleOpacity, filter: titleFilter }}

&#x20;               className="mt-6"

&#x20;             >

&#x20;               {children}

&#x20;             </motion.div>

&#x20;           )}

&#x20;         </motion.div>

&#x20;       </div>



&#x20;       {/\* halo behind the arc \*/}

&#x20;       <div

&#x20;         aria-hidden

&#x20;         className="pointer-events-none absolute inset-0 z-10 overflow-hidden"

&#x20;       >

&#x20;         <Orb grow="calc(var(--orb) \* 0.15)">

&#x20;           <motion.div

&#x20;             className="size-full will-change-\[transform,opacity]"

&#x20;             style={{

&#x20;               opacity: haloOpacity,

&#x20;               scale: haloScale,

&#x20;               backgroundImage: `radial-gradient(circle closest-side, transparent 64%, ${\[

&#x20;                 \[4, 71],

&#x20;                 \[12, 74.5],

&#x20;                 \[16, 75.5],

&#x20;                 \[12.5, 77.5],

&#x20;                 \[7, 80.5],

&#x20;                 \[3.5, 85],

&#x20;                 \[1.5, 91],

&#x20;               ]

&#x20;                 .map(

&#x20;                   (\[a, at]) =>

&#x20;                     `color-mix(in oklab, var(--color-foreground) ${a}%, transparent) ${at}%`,

&#x20;                 )

&#x20;                 .join(", ")}, transparent 98%)`,

&#x20;             }}

&#x20;           />

&#x20;         </Orb>

&#x20;       </div>



&#x20;       {/\* planet + colour rim, fading out into the bottom edge \*/}

&#x20;       <div

&#x20;         aria-hidden

&#x20;         className="pointer-events-none absolute inset-0 z-30 overflow-hidden"

&#x20;         style={{

&#x20;           maskImage: "linear-gradient(to top, transparent 0, #000 64px)",

&#x20;           WebkitMaskImage:

&#x20;             "linear-gradient(to top, transparent 0, #000 64px)",

&#x20;         }}

&#x20;       >

&#x20;         <motion.div

&#x20;           className="absolute inset-0 will-change-\[opacity,clip-path]"

&#x20;           style={{ opacity: rimOpacity, clipPath: rimClip }}

&#x20;         >

&#x20;           <motion.div

&#x20;             className="absolute inset-0"

&#x20;             style={{ filter: rimFilter }}

&#x20;           >

&#x20;             {/\* wide soft bloom, then a tighter bright line \*/}

&#x20;             {\[

&#x20;               { blur: 10, opacity: 0.45, grow: "3px" },

&#x20;               { blur: 2, opacity: 1, grow: "2px" },

&#x20;             ].map((l) => (

&#x20;               <div

&#x20;                 key={l.blur}

&#x20;                 className="absolute inset-0"

&#x20;                 style={{ filter: `blur(${l.blur}px)`, opacity: l.opacity }}

&#x20;               >

&#x20;                 <Orb

&#x20;                   grow={l.grow}

&#x20;                   className="rounded-full"

&#x20;                   style={{

&#x20;                     backgroundImage: rimGradient,

&#x20;                     maskImage: RIM\_MASK,

&#x20;                     WebkitMaskImage: RIM\_MASK,

&#x20;                   }}

&#x20;                 />

&#x20;               </div>

&#x20;             ))}

&#x20;           </motion.div>

&#x20;         </motion.div>



&#x20;         {/\* the planet itself — covers the rim so only its edge glows \*/}

&#x20;         <div className="absolute inset-0" style={{ filter: "blur(0.5px)" }}>

&#x20;           <Orb className="rounded-full bg-background" />

&#x20;         </div>



&#x20;         <Orb>

&#x20;           <motion.svg

&#x20;             viewBox="0 0 1000 1000"

&#x20;             className="absolute inset-0 size-full overflow-visible"

&#x20;             style={{ opacity: edgeOpacity }}

&#x20;           >

&#x20;             <defs>

&#x20;               <linearGradient id={edgeId} x1="0" x2="0" y1="0" y2="1">

&#x20;                 <stop

&#x20;                   offset="0"

&#x20;                   stopColor="var(--color-foreground)"

&#x20;                   stopOpacity="0.5"

&#x20;                 />

&#x20;                 <stop

&#x20;                   offset="0.33"

&#x20;                   stopColor="var(--color-foreground)"

&#x20;                   stopOpacity="0"

&#x20;                 />

&#x20;               </linearGradient>

&#x20;             </defs>

&#x20;             <circle

&#x20;               cx="500"

&#x20;               cy="500"

&#x20;               r="500"

&#x20;               fill="none"

&#x20;               stroke={`url(#${edgeId})`}

&#x20;               strokeWidth="1.5"

&#x20;               vectorEffect="non-scaling-stroke"

&#x20;             />

&#x20;           </motion.svg>

&#x20;         </Orb>

&#x20;       </div>

&#x20;     </div>

&#x20;   </section>

&#x20; );

}



export default HorizonGlowHero;





demo.tsx

"use client";



import { HorizonGlowHero } from "@/components/ui/horizon-glow-hero";



export default function HorizonGlowHeroDemo() {

&#x20; return (

&#x20;   <HorizonGlowHero

&#x20;     eyebrow="Your tools, docs and conversations"

&#x20;     title="Finally in sync"

&#x20;     className="h-svh"

&#x20;   >

&#x20;     <div className="flex gap-3">

&#x20;       <button className="h-10 rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90">

&#x20;         Get started

&#x20;       </button>

&#x20;       <button className="h-10 rounded-md border border-border bg-background px-5 text-sm font-medium text-foreground transition-colors hover:bg-accent">

&#x20;         Learn more

&#x20;       </button>

&#x20;     </div>

&#x20;   </HorizonGlowHero>

&#x20; );

}



```



Install NPM dependencies:

```bash

motion

```



Implementation Guidelines

&#x20;1. Analyze the component structure and identify all required dependencies

&#x20;2. Review the component's argumens and state

&#x20;3. Identify any required context providers or hooks and install them

&#x20;4. Questions to Ask

&#x20;- What data/props will be passed to this component?

&#x20;- Are there any specific state management requirements?

&#x20;- Are there any required assets (images, icons, etc.)?

&#x20;- What is the expected responsive behavior?

&#x20;- What is the best place to use this component in the app?



Steps to integrate

&#x20;0. Copy paste all the code above in the correct directories

&#x20;1. Install external dependencies

&#x20;2. Fill image assets with Unsplash stock images you know exist

&#x20;3. Use lucide-react icons for svgs or logos if component requires them



