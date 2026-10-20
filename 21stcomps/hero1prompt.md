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

responsive-hero-banner.tsx

"use client";



import React, { useState } from 'react';



interface NavLink {

&#x20;   label: string;

&#x20;   href: string;

&#x20;   isActive?: boolean;

}



interface Partner {

&#x20;   logoUrl: string;

&#x20;   href: string;

}



interface ResponsiveHeroBannerProps {

&#x20;   logoUrl?: string;

&#x20;   backgroundImageUrl?: string;

&#x20;   navLinks?: NavLink\[];

&#x20;   ctaButtonText?: string;

&#x20;   ctaButtonHref?: string;

&#x20;   badgeText?: string;

&#x20;   badgeLabel?: string;

&#x20;   title?: string;

&#x20;   titleLine2?: string;

&#x20;   description?: string;

&#x20;   primaryButtonText?: string;

&#x20;   primaryButtonHref?: string;

&#x20;   secondaryButtonText?: string;

&#x20;   secondaryButtonHref?: string;

&#x20;   partnersTitle?: string;

&#x20;   partners?: Partner\[];

}



const ResponsiveHeroBanner: React.FC<ResponsiveHeroBannerProps> = ({

&#x20;   logoUrl = "https://cdn.21st.dev/assets/mirror/c4/c4d5f159140e3ccc35a8bd4f043453cb9e2692f700206e43855ff598c171b924.png",

&#x20;   backgroundImageUrl = "https://cdn.21st.dev/assets/mirror/a8/a8cf38f65f7315f95eba8c803c4a80a9d78cb2ea36fbfee49828396e4a0b9737.jpg",

&#x20;   navLinks = \[

&#x20;       { label: "Home", href: "#", isActive: true },

&#x20;       { label: "Missions", href: "#" },

&#x20;       { label: "Destinations", href: "#" },

&#x20;       { label: "Technology", href: "#" },

&#x20;       { label: "Book Flight", href: "#" }

&#x20;   ],

&#x20;   ctaButtonText = "Reserve Seat",

&#x20;   ctaButtonHref = "#",

&#x20;   badgeLabel = "New",

&#x20;   badgeText = "First Commercial Flight to Mars 2026",

&#x20;   title = "Journey Beyond Earth",

&#x20;   titleLine2 = "Into the Cosmos",

&#x20;   description = "Experience the cosmos like never before. Our advanced spacecraft and cutting-edge technology make interplanetary travel accessible, safe, and unforgettable.",

&#x20;   primaryButtonText = "Book Your Journey",

&#x20;   primaryButtonHref = "#",

&#x20;   secondaryButtonText = "Watch Launch",

&#x20;   secondaryButtonHref = "#",

&#x20;   partnersTitle = "Partnering with leading space agencies worldwide",

&#x20;   partners = \[

&#x20;       { logoUrl: "https://cdn.21st.dev/assets/mirror/96/964eca0b0415aebc2718799b530b39d6f552b39634f3fb2072e769df17c6668f.png", href: "#" },

&#x20;       { logoUrl: "https://cdn.21st.dev/assets/mirror/90/900ad16bdb8bd723836996d2283c47420e719ba8c9a4f7d24ff67e59056e88fe.png", href: "#" },

&#x20;       { logoUrl: "https://cdn.21st.dev/assets/mirror/1b/1b66b155997cb81da3bdabeb8da22771b07f4ac5273d6a19d629c77cf75a861f.png", href: "#" },

&#x20;       { logoUrl: "https://cdn.21st.dev/assets/mirror/cb/cb112906d9fa8a57380201b1385c5534075020542dab48d5f29f2e35a3e19bc1.png", href: "#" },

&#x20;       { logoUrl: "https://cdn.21st.dev/assets/mirror/f6/f68e2933c2f24ef4b28fb81328350831eb56bf42244dee50e2b7f6efd7497783.png", href: "#" }

&#x20;   ]

}) => {

&#x20;   const \[mobileMenuOpen, setMobileMenuOpen] = useState(false);



&#x20;   return (

&#x20;       <section className="w-full isolate min-h-screen overflow-hidden relative">

&#x20;           <img

&#x20;               src={backgroundImageUrl}

&#x20;               alt=""

&#x20;               className="w-full h-full object-cover absolute top-0 right-0 bottom-0 left-0"

&#x20;           />

&#x20;           <div className="pointer-events-none absolute inset-0 ring-1 ring-black/30" />



&#x20;           <header className="z-10 xl:top-4 relative">

&#x20;               <div className="mx-6">

&#x20;                   <div className="flex items-center justify-between pt-4">

&#x20;                       <a

&#x20;                           href="#"

&#x20;                           className="inline-flex items-center justify-center bg-center w-\[100px] h-\[40px] bg-cover rounded"

&#x20;                           style={{ backgroundImage: `url(${logoUrl})` }}

&#x20;                       />



&#x20;                       <nav className="hidden md:flex items-center gap-2">

&#x20;                           <div className="flex items-center gap-1 rounded-full bg-white/5 px-1 py-1 ring-1 ring-white/10 backdrop-blur">

&#x20;                               {navLinks.map((link, index) => (

&#x20;                                   <a

&#x20;                                       key={index}

&#x20;                                       href={link.href}

&#x20;                                       className={`px-3 py-2 text-sm font-medium hover:text-white font-sans transition-colors ${link.isActive ? 'text-white/90' : 'text-white/80'

&#x20;                                           }`}

&#x20;                                   >

&#x20;                                       {link.label}

&#x20;                                   </a>

&#x20;                               ))}

&#x20;                               <a

&#x20;                                   href={ctaButtonHref}

&#x20;                                   className="ml-1 inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-2 text-sm font-medium text-neutral-900 hover:bg-white/90 font-sans transition-colors"

&#x20;                               >

&#x20;                                   {ctaButtonText}

&#x20;                                   <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">

&#x20;                                       <path d="M7 7h10v10" />

&#x20;                                       <path d="M7 17 17 7" />

&#x20;                                   </svg>

&#x20;                               </a>

&#x20;                           </div>

&#x20;                       </nav>



&#x20;                       <button

&#x20;                           onClick={() => setMobileMenuOpen(!mobileMenuOpen)}

&#x20;                           className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/15 backdrop-blur"

&#x20;                           aria-expanded={mobileMenuOpen}

&#x20;                           aria-label="Toggle menu"

&#x20;                       >

&#x20;                           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-white/90">

&#x20;                               <path d="M4 5h16" />

&#x20;                               <path d="M4 12h16" />

&#x20;                               <path d="M4 19h16" />

&#x20;                           </svg>

&#x20;                       </button>

&#x20;                   </div>

&#x20;               </div>

&#x20;           </header>



&#x20;           <div className="z-10 relative">

&#x20;               <div className="sm:pt-28 md:pt-32 lg:pt-40 max-w-7xl mx-auto pt-28 px-6 pb-16">

&#x20;                   <div className="mx-auto max-w-3xl text-center">

&#x20;                       <div className="mb-6 inline-flex items-center gap-3 rounded-full bg-white/10 px-2.5 py-2 ring-1 ring-white/15 backdrop-blur animate-fade-slide-in-1">

&#x20;                           <span className="inline-flex items-center text-xs font-medium text-neutral-900 bg-white/90 rounded-full py-0.5 px-2 font-sans">

&#x20;                               {badgeLabel}

&#x20;                           </span>

&#x20;                           <span className="text-sm font-medium text-white/90 font-sans">

&#x20;                               {badgeText}

&#x20;                           </span>

&#x20;                       </div>



&#x20;                       <h1 className="sm:text-5xl md:text-6xl lg:text-7xl leading-tight text-4xl text-white tracking-tight font-instrument-serif font-normal animate-fade-slide-in-2">

&#x20;                           {title}

&#x20;                           <br className="hidden sm:block" />

&#x20;                           {titleLine2}

&#x20;                       </h1>



&#x20;                       <p className="sm:text-lg animate-fade-slide-in-3 text-base text-white/80 max-w-2xl mt-6 mx-auto">

&#x20;                           {description}

&#x20;                       </p>



&#x20;                       <div className="flex flex-col sm:flex-row sm:gap-4 mt-10 gap-3 items-center justify-center animate-fade-slide-in-4">

&#x20;                           <a

&#x20;                               href={primaryButtonHref}

&#x20;                               className="inline-flex items-center gap-2 hover:bg-white/15 text-sm font-medium text-white bg-white/10 ring-white/15 ring-1 rounded-full py-3 px-5 font-sans transition-colors"

&#x20;                           >

&#x20;                               {primaryButtonText}

&#x20;                               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">

&#x20;                                   <path d="M5 12h14" />

&#x20;                                   <path d="m12 5 7 7-7 7" />

&#x20;                               </svg>

&#x20;                           </a>

&#x20;                           <a

&#x20;                               href={secondaryButtonHref}

&#x20;                               className="inline-flex items-center gap-2 rounded-full bg-transparent px-5 py-3 text-sm font-medium text-white/90 hover:text-white font-sans transition-colors"

&#x20;                           >

&#x20;                               {secondaryButtonText}

&#x20;                               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">

&#x20;                                   <path d="M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z" />

&#x20;                               </svg>

&#x20;                           </a>

&#x20;                       </div>

&#x20;                   </div>



&#x20;                   <div className="mx-auto mt-20 max-w-5xl">

&#x20;                       <p className="animate-fade-slide-in-1 text-sm text-white/70 text-center">

&#x20;                           {partnersTitle}

&#x20;                       </p>

&#x20;                       <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 animate-fade-slide-in-2 text-white/70 mt-6 items-center justify-items-center gap-4">

&#x20;                           {partners.map((partner, index) => (

&#x20;                               <a

&#x20;                                   key={index}

&#x20;                                   href={partner.href}

&#x20;                                   className="inline-flex items-center justify-center bg-center w-\[120px] h-\[36px] bg-cover rounded-full opacity-80 hover:opacity-100 transition-opacity"

&#x20;                                   style={{ backgroundImage: `url(${partner.logoUrl})` }}

&#x20;                               />

&#x20;                           ))}

&#x20;                       </div>

&#x20;                   </div>

&#x20;               </div>

&#x20;           </div>

&#x20;       </section>

&#x20;   );

};



export default ResponsiveHeroBanner;





demo.tsx

import React from 'react';

import ResponsiveHeroBanner from '../components/ui/responsive-hero-banner';



const HeroDemo = () => {

&#x20;   return (

&#x20;       <ResponsiveHeroBanner

&#x20;           badgeLabel="New"

&#x20;           badgeText="First Commercial Flight to Mars 2026"

&#x20;           title="Journey Beyond Earth"

&#x20;           titleLine2="Into the Cosmos"

&#x20;           description="Experience the cosmos like never before. Our advanced spacecraft and cutting-edge technology make interplanetary travel accessible, safe, and unforgettable."

&#x20;           primaryButtonText="Book Your Journey"

&#x20;           secondaryButtonText="Watch Launch"

&#x20;           ctaButtonText="Reserve Seat"

&#x20;           partnersTitle="Partnering with leading space agencies worldwide"

&#x20;       />

&#x20;   );

};



export default HeroDemo;



```



Extend existing Tailwind 4 index.css with this code (or if project uses Tailwind 3, extend tailwind.config.js or globals.css):

```css

@import "tailwindcss";

@import "tw-animate-css";



@theme inline {

&#x20; --font-serif: "Instrument Serif", Georgia, serif;

&#x20; --font-sans: "Inter", system-ui, sans-serif;

&#x20; --color-background: var(--bg-0);

&#x20; --color-foreground: var(--text-100);

}



:root {

&#x20; --bg-0: #09090b;

&#x20; --bg-100: #18181b;

&#x20; --bg-200: #27272a;

&#x20; --bg-300: #3f3f46;

&#x20; --text-100: #fafafa;

&#x20; --text-200: #e4e4e7;

&#x20; --text-300: #a1a1aa;

&#x20; --text-400: #71717a;

&#x20; --radius: 0.5rem;

}





@keyframes fadeSlideIn {

&#x20; from {

&#x20;   opacity: 0;

&#x20;   transform: translateY(20px);

&#x20; }

&#x20; to {

&#x20;   opacity: 1;

&#x20;   transform: translateY(0);

&#x20; }

}

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



