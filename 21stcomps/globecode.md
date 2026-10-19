// --- Component ---

"use client"



import createGlobe, { COBEOptions } from "cobe"

import { useCallback, useEffect, useRef, useState } from "react"



import { cn } from "@/lib/utils"



const GLOBE\_CONFIG: COBEOptions = {

&#x20; width: 800,

&#x20; height: 800,

&#x20; onRender: () => {},

&#x20; devicePixelRatio: 2,

&#x20; phi: 0,

&#x20; theta: 0.3,

&#x20; dark: 0,

&#x20; diffuse: 0.4,

&#x20; mapSamples: 16000,

&#x20; mapBrightness: 1.2,

&#x20; baseColor: \[1, 1, 1],

&#x20; markerColor: \[251 / 255, 100 / 255, 21 / 255],

&#x20; glowColor: \[1, 1, 1],

&#x20; markers: \[

&#x20;   { location: \[14.5995, 120.9842], size: 0.03 },

&#x20;   { location: \[19.076, 72.8777], size: 0.1 },

&#x20;   { location: \[23.8103, 90.4125], size: 0.05 },

&#x20;   { location: \[30.0444, 31.2357], size: 0.07 },

&#x20;   { location: \[39.9042, 116.4074], size: 0.08 },

&#x20;   { location: \[-23.5505, -46.6333], size: 0.1 },

&#x20;   { location: \[19.4326, -99.1332], size: 0.1 },

&#x20;   { location: \[40.7128, -74.006], size: 0.1 },

&#x20;   { location: \[34.6937, 135.5022], size: 0.05 },

&#x20;   { location: \[41.0082, 28.9784], size: 0.06 },

&#x20; ],

}



export function Globe({

&#x20; className,

&#x20; config = GLOBE\_CONFIG,

}: {

&#x20; className?: string

&#x20; config?: COBEOptions

}) {

&#x20; let phi = 0

&#x20; let width = 0

&#x20; const canvasRef = useRef<HTMLCanvasElement>(null)

&#x20; const pointerInteracting = useRef(null)

&#x20; const pointerInteractionMovement = useRef(0)

&#x20; const \[r, setR] = useState(0)



&#x20; const updatePointerInteraction = (value: any) => {

&#x20;   pointerInteracting.current = value

&#x20;   if (canvasRef.current) {

&#x20;     canvasRef.current.style.cursor = value ? "grabbing" : "grab"

&#x20;   }

&#x20; }



&#x20; const updateMovement = (clientX: any) => {

&#x20;   if (pointerInteracting.current !== null) {

&#x20;     const delta = clientX - pointerInteracting.current

&#x20;     pointerInteractionMovement.current = delta

&#x20;     setR(delta / 200)

&#x20;   }

&#x20; }



&#x20; const onRender = useCallback(

&#x20;   (state: Record<string, any>) => {

&#x20;     if (!pointerInteracting.current) phi += 0.005

&#x20;     state.phi = phi + r

&#x20;     state.width = width \* 2

&#x20;     state.height = width \* 2

&#x20;   },

&#x20;   \[r],

&#x20; )



&#x20; const onResize = () => {

&#x20;   if (canvasRef.current) {

&#x20;     width = canvasRef.current.offsetWidth

&#x20;   }

&#x20; }



&#x20; useEffect(() => {

&#x20;   window.addEventListener("resize", onResize)

&#x20;   onResize()



&#x20;   const globe = createGlobe(canvasRef.current!, {

&#x20;     ...config,

&#x20;     width: width \* 2,

&#x20;     height: width \* 2,

&#x20;     onRender,

&#x20;   })



&#x20;   setTimeout(() => (canvasRef.current!.style.opacity = "1"))

&#x20;   return () => globe.destroy()

&#x20; }, \[])



&#x20; return (

&#x20;   <div

&#x20;     className={cn(

&#x20;       "absolute inset-0 mx-auto aspect-\[1/1] w-full max-w-\[600px]",

&#x20;       className,

&#x20;     )}

&#x20;   >

&#x20;     <canvas

&#x20;       className={cn(

&#x20;         "size-full opacity-0 transition-opacity duration-500 \[contain:layout\_paint\_size]",

&#x20;       )}

&#x20;       ref={canvasRef}

&#x20;       onPointerDown={(e) =>

&#x20;         updatePointerInteraction(

&#x20;           e.clientX - pointerInteractionMovement.current,

&#x20;         )

&#x20;       }

&#x20;       onPointerUp={() => updatePointerInteraction(null)}

&#x20;       onPointerOut={() => updatePointerInteraction(null)}

&#x20;       onMouseMove={(e) => updateMovement(e.clientX)}

&#x20;       onTouchMove={(e) =>

&#x20;         e.touches\[0] \&\& updateMovement(e.touches\[0].clientX)

&#x20;       }

&#x20;     />

&#x20;   </div>

&#x20; )

}





// --- Demo ---

import { Globe } from "@/components/ui/globe"



export function GlobeDemo() {

&#x20; return (

&#x20;   <div className="relative flex size-full max-w-lg items-center justify-center overflow-hidden rounded-lg border bg-background px-40 pb-40 pt-8 md:pb-60 md:shadow-xl">

&#x20;     <span className="pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-black to-gray-300/80 bg-clip-text text-center text-8xl font-semibold leading-none text-transparent dark:from-white dark:to-slate-900/10">

&#x20;       Globe

&#x20;     </span>

&#x20;     <Globe className="top-28" />

&#x20;     <div className="pointer-events-none absolute inset-0 h-full bg-\[radial-gradient(circle\_at\_50%\_200%,rgba(0,0,0,0.2),rgba(255,255,255,0))]" />

&#x20;   </div>

&#x20; )

}



