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

branching-reasoning-chat-input.tsx

"use client";



import \* as React from "react";

import { ArrowUp, Check, ChevronDown, GitFork, Square } from "lucide-react";



export type BranchingReasoningStatus = "idle" | "branching" | "choosing" | "answering" | "done";

export type ReasoningBranch = { id: string; title: string; note: string; score?: number; chosen?: boolean };

export type BranchingReasoningChatInputProps = {

&#x20; ref?: React.ComponentProps<"div">\["ref"];

&#x20; status?: BranchingReasoningStatus;

&#x20; branches?: ReasoningBranch\[];

&#x20; prompt?: string;

&#x20; answer?: string;

&#x20; value?: string;

&#x20; defaultValue?: string;

&#x20; onValueChange?: (value: string) => void;

&#x20; onSubmit?: (value: string) => void;

&#x20; onStop?: () => void;

&#x20; expanded?: boolean;

&#x20; defaultExpanded?: boolean;

&#x20; onExpandedChange?: (expanded: boolean) => void;

&#x20; placeholder?: string;

&#x20; disabled?: boolean;

&#x20; className?: string;

};



type CardPosition = { left: number; top: number; width: number; height: number; angle: number; opacity: number };

const EMPTY\_BRANCHES: ReasoningBranch\[] = \[];

const MOVE\_MS = 520;

const EASING = "cubic-bezier(0.22, 1, 0.36, 1)";



function boundedScore(score?: number) {

&#x20; return typeof score === "number" \&\& Number.isFinite(score) ? Math.min(100, Math.max(0, score)) : undefined;

}



/\*\* Present host-provided approach summaries and scores. No timers, autoplay, or requests. \*/

export function BranchingReasoningChatInput({

&#x20; ref,

&#x20; status = "idle",

&#x20; branches = EMPTY\_BRANCHES,

&#x20; prompt = "",

&#x20; answer = "",

&#x20; value,

&#x20; defaultValue = "",

&#x20; onValueChange,

&#x20; onSubmit,

&#x20; onStop,

&#x20; expanded,

&#x20; defaultExpanded = false,

&#x20; onExpandedChange,

&#x20; placeholder = "Ask a question…",

&#x20; disabled = false,

&#x20; className = "",

}: BranchingReasoningChatInputProps) {

&#x20; const \[draft, setDraft] = React.useState(defaultValue);

&#x20; const \[localExpanded, setLocalExpanded] = React.useState(defaultExpanded);

&#x20; const \[reduced, setReduced] = React.useState(true);

&#x20; const deck = React.useRef(null as HTMLDivElement | null);

&#x20; const shimmer = React.useRef(null as HTMLSpanElement | null);

&#x20; const positions = React.useRef({} as { \[id: string]: CardPosition });

&#x20; const animations = React.useRef(\[] as Animation\[]);

&#x20; const deckId = React.useId();

&#x20; const inputId = React.useId();

&#x20; const inputValue = value ?? draft;

&#x20; const busy = status === "branching" || status === "choosing" || status === "answering";

&#x20; const isExpanded = expanded ?? localExpanded;

&#x20; const chosen = branches.find((branch) => branch.chosen);

&#x20; const open = status === "branching" || !chosen || isExpanded;

&#x20; const otherCount = Math.max(0, branches.length - 1);

&#x20; const showBranches = status !== "idle" \&\& branches.length > 0;

&#x20; const heading = chosen \&\& status !== "branching"

&#x20;   ? `Chose: ${chosen.title}`

&#x20;   : status === "done" ? "Approaches considered"

&#x20;   : branches.length > 0 ? `Considering ${branches.length} ${branches.length === 1 ? "approach" : "approaches"}` : "Finding a few ways forward";

&#x20; const layoutKey = `${showBranches}:${open}:${chosen?.id ?? ""}:${branches.map((branch) => branch.id).join("|")}`;

&#x20; const announcement = status === "idle" ? "Ready for a question."

&#x20;   : status === "done" ? `Response complete. ${answer}`

&#x20;   : status === "answering" ? `${chosen ? `Chose: ${chosen.title}. ` : ""}Writing a response.` : heading;



&#x20; React.useEffect(() => {

&#x20;   const media = window.matchMedia("(prefers-reduced-motion: reduce)");

&#x20;   const update = () => setReduced(media.matches);

&#x20;   update();

&#x20;   media.addEventListener("change", update);

&#x20;   return () => media.removeEventListener("change", update);

&#x20; }, \[]);



&#x20; React.useEffect(() => {

&#x20;   if (status === "idle" || status === "branching") setLocalExpanded(false);

&#x20; }, \[status, prompt]);



&#x20; // FLIP: measure the final layout, invert to the previous geometry, then play.

&#x20; // Score/answer updates deliberately do not restart a running card transition.

&#x20; React.useLayoutEffect(() => {

&#x20;   animations.current.forEach((animation) => animation.cancel());

&#x20;   animations.current = \[];

&#x20;   const next: { \[id: string]: CardPosition } = {};

&#x20;   deck.current?.querySelectorAll("\[data-branch]").forEach((element, index) => {

&#x20;     const node = element as HTMLElement;

&#x20;     const id = node.dataset.branch!;

&#x20;     const to = {

&#x20;       left: node.offsetLeft, top: node.offsetTop, width: node.offsetWidth, height: node.offsetHeight,

&#x20;       angle: Number(node.dataset.angle), opacity: Number(node.style.opacity),

&#x20;     };

&#x20;     next\[id] = to;

&#x20;     const from = positions.current\[id];

&#x20;     if (reduced || typeof node.animate !== "function" || !to.width || !to.height) return;

&#x20;     const start = from ? {

&#x20;       transform: `translate(${from.left - to.left}px, ${from.top - to.top}px) rotate(${from.angle}deg) scale(${from.width / to.width}, ${from.height / to.height})`,

&#x20;       opacity: from.opacity,

&#x20;     } : {

&#x20;       transform: `translate(${(deck.current!.clientWidth - to.width) / 2 - to.left}px, 22px) rotate(0deg) scale(0.86)`,

&#x20;       opacity: 0,

&#x20;     };

&#x20;     animations.current.push(node.animate(\[

&#x20;       start,

&#x20;       { transform: `translate(0px, 0px) rotate(${to.angle}deg) scale(1)`, opacity: to.opacity },

&#x20;     ], { duration: MOVE\_MS, delay: from ? 0 : index \* 35, easing: EASING, fill: "backwards" }));

&#x20;   });

&#x20;   positions.current = next;

&#x20;   return () => animations.current.forEach((animation) => animation.cancel());

&#x20; }, \[layoutKey, reduced]);



&#x20; React.useEffect(() => {

&#x20;   if (status !== "branching" || reduced || !shimmer.current) return;

&#x20;   const animation = shimmer.current.animate(\[{ backgroundPosition: "100% 0" }, { backgroundPosition: "0% 0" }], {

&#x20;     duration: 1600, iterations: Infinity, easing: "linear",

&#x20;   });

&#x20;   return () => animation.cancel();

&#x20; }, \[status, reduced]);



&#x20; function changeValue(next: string) {

&#x20;   if (value === undefined) setDraft(next);

&#x20;   onValueChange?.(next);

&#x20; }



&#x20; function submit() {

&#x20;   const message = inputValue.trim();

&#x20;   if (!message || busy || disabled || !onSubmit) return;

&#x20;   changeValue("");

&#x20;   onSubmit(message);

&#x20; }



&#x20; return (

&#x20;   <div ref={ref} data-slot="branching-reasoning-chat-input" data-state={status} data-reduced={reduced}

&#x20;     className={`flex h-full min-h-0 w-full flex-col rounded-\[26px] border border-border bg-card p-4 text-card-foreground shadow-xl shadow-primary/5 ${className}`}>

&#x20;     <div data-transcript role="region" aria-label="Conversation" tabIndex={0}

&#x20;       className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden rounded-xl px-1 outline-none focus-visible:ring-2 focus-visible:ring-ring">

&#x20;       {status === "idle" ? (

&#x20;         <div data-empty className="flex h-full min-h-40 flex-col items-center justify-center pb-6 text-center">

&#x20;           <svg viewBox="0 0 176 70" className="mb-5 h-\[70px] w-44 text-muted-foreground" fill="none" aria-hidden="true">

&#x20;             <path d="M88 6V22M28 57V42Q28 32 38 32H138Q148 32 148 42V57M88 32V57" stroke="currentColor" strokeWidth="1.5" />

&#x20;             {\[28, 88, 148].map((x) => <circle key={x} cx={x} cy="60" r="5" className="fill-card stroke-border" strokeWidth="2" />)}

&#x20;             <circle cx="88" cy="7" r="6" className="fill-primary" />

&#x20;           </svg>

&#x20;           <p className="text-lg font-medium tracking-tight">One question. A few ways forward.</p>

&#x20;           <p className="mt-2 max-w-64 text-xs leading-5 text-muted-foreground">Explore the options, then bring the best approach into focus.</p>

&#x20;         </div>

&#x20;       ) : (

&#x20;         <>

&#x20;           {prompt \&\& <p data-question className="mb-3 ml-auto w-fit max-w-\[95%] rounded-2xl rounded-br-md bg-muted px-3 py-2 text-xs leading-5 \[overflow-wrap:anywhere]">{prompt}</p>}

&#x20;           <div data-assistant>

&#x20;             <div className="flex min-h-5 items-center gap-2 text-xs">

&#x20;               {chosen \&\& status !== "branching" ? <Check className="size-3.5 shrink-0" aria-hidden="true" /> : <GitFork className="size-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />}

&#x20;               <span ref={shimmer} data-branch-heading className={`font-medium \[overflow-wrap:anywhere] ${status === "branching" \&\& !reduced ? "bg-\[linear-gradient(100deg,var(--color-muted-foreground)\_25%,var(--color-foreground)\_50%,var(--color-muted-foreground)\_75%)] bg-\[length:240%\_100%] bg-clip-text text-transparent" : "text-muted-foreground"}`}>{heading}</span>

&#x20;             </div>

&#x20;             <div ref={deck} id={deckId} data-branch-deck data-open={open} role="group" aria-label="Approaches"

&#x20;               className="relative mx-1" style={{ height: showBranches ? (open ? 180 + Math.floor((branches.length - 1) / 3) \* 158 : 104) : 24 }}>

&#x20;               {showBranches \&\& branches.map((branch, index) => {

&#x20;                 const selected = branch.id === chosen?.id;

&#x20;                 const folded = !open \&\& !selected;

&#x20;                 const count = branches.length;

&#x20;                 const column = index % 3;

&#x20;                 const row = Math.floor(index / 3);

&#x20;                 const visibleColumns = Math.min(count, 3);

&#x20;                 const angle = open ? (column - (visibleColumns - 1) / 2) \* 4 : 0;

&#x20;                 const score = boundedScore(branch.score);

&#x20;                 const highlighted = selected \&\& status !== "branching";

&#x20;                 return (

&#x20;                   <div key={branch.id} data-branch={branch.id} data-selected={selected} data-angle={angle}

&#x20;                     aria-hidden={folded || undefined} inert={folded || undefined}

&#x20;                     className={`absolute flex flex-col rounded-xl border p-2.5 shadow-md shadow-primary/5 ${highlighted ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-card-foreground"}`}

&#x20;                     style={{

&#x20;                       left: open ? `${2 + column \* (96 / visibleColumns)}%` : "8%",

&#x20;                       top: open ? 20 + Math.abs(angle) \* 1.2 + row \* 158 : 8,

&#x20;                       width: open ? `${96 / visibleColumns - 2}%` : "84%",

&#x20;                       height: open ? 144 : 88,

&#x20;                       transform: `rotate(${angle}deg)`, transformOrigin: "top left",

&#x20;                       opacity: folded ? 0 : 1, zIndex: selected ? 4 : index + 1,

&#x20;                       pointerEvents: folded ? "none" : "auto",

&#x20;                     }}>

&#x20;                     <div className={`mb-2 flex items-center justify-between text-\[9px] font-medium uppercase tracking-\[0.12em] ${highlighted ? "text-primary-foreground/70" : "text-muted-foreground"}`}>

&#x20;                       <span>{highlighted ? "Selected approach" : `Approach 0${index + 1}`}</span>

&#x20;                       {highlighted \&\& <Check className="size-3" aria-hidden="true" />}

&#x20;                     </div>

&#x20;                     <p className={`font-medium leading-\[1.3] \[overflow-wrap:anywhere] ${open ? "text-\[12px]" : "text-sm"}`}>{branch.title}</p>

&#x20;                     {open \&\& <p className={`mt-1.5 text-\[10px] leading-\[1.4] \[overflow-wrap:anywhere] ${highlighted ? "text-primary-foreground/70" : "text-muted-foreground"}`}>{branch.note}</p>}

&#x20;                     <div className="mt-auto flex items-center gap-2 pt-2">

&#x20;                       <div role="progressbar" aria-label={`${branch.title} score`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={score}

&#x20;                         className={`h-1 flex-1 overflow-hidden rounded-full ${highlighted ? "bg-primary-foreground/20" : "bg-muted"}`}>

&#x20;                         <div data-score-fill className={`h-full rounded-full ${highlighted ? "bg-primary-foreground" : "bg-primary"}`}

&#x20;                           style={{ width: `${score ?? 0}%`, transition: reduced ? "none" : "width 180ms linear" }} />

&#x20;                       </div>

&#x20;                       <span data-score-label className="w-5 text-right font-mono text-\[10px] tabular-nums">{score === undefined ? "—" : Math.round(score)}</span>

&#x20;                     </div>

&#x20;                   </div>

&#x20;                 );

&#x20;               })}

&#x20;             </div>

&#x20;             {chosen \&\& status !== "branching" \&\& otherCount > 0 \&\& (

&#x20;               <button type="button" data-approaches-toggle aria-expanded={isExpanded} aria-controls={deckId} disabled={disabled}

&#x20;                 onClick={() => { if (expanded === undefined) setLocalExpanded(!isExpanded); onExpandedChange?.(!isExpanded); }}

&#x20;                 className="flex min-h-6 items-center gap-1.5 rounded-md px-1 text-\[11px] text-muted-foreground outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-40">

&#x20;                 <ChevronDown className={`size-3 transition-transform motion-reduce:transition-none ${isExpanded ? "rotate-180" : ""}`} aria-hidden="true" />

&#x20;                 {isExpanded ? "Hide" : otherCount} {isExpanded ? "other approaches" : `other ${otherCount === 1 ? "approach" : "approaches"}`}

&#x20;               </button>

&#x20;             )}

&#x20;             {(status === "answering" || status === "done") \&\& (

&#x20;               <div data-answer role="region" aria-label="Response" aria-live="off" className="mt-2 whitespace-pre-wrap text-\[13px] leading-\[1.55] \[overflow-wrap:anywhere]">

&#x20;                 {answer}{status === "answering" \&\& <span data-stream-cursor aria-hidden="true" className="ml-1 inline-block h-3 w-1 translate-y-0.5 rounded-full bg-primary motion-safe:animate-pulse" />}

&#x20;               </div>

&#x20;             )}

&#x20;           </div>

&#x20;         </>

&#x20;       )}

&#x20;     </div>

&#x20;     <form data-composer onSubmit={(event) => { event.preventDefault(); submit(); }}

&#x20;       className="mt-3 shrink-0 rounded-2xl border border-border bg-background p-2.5 focus-within:border-ring">

&#x20;       <label htmlFor={inputId} className="sr-only">Your question</label>

&#x20;       <textarea id={inputId} value={inputValue} placeholder={placeholder} disabled={disabled} rows={1}

&#x20;         onChange={(event) => changeValue(event.target.value)}

&#x20;         onKeyDown={(event) => {

&#x20;           if (event.key === "Enter" \&\& !event.shiftKey \&\& !event.nativeEvent.isComposing \&\& event.keyCode !== 229) {

&#x20;             event.preventDefault(); submit();

&#x20;           }

&#x20;         }}

&#x20;         className="block h-9 w-full resize-none rounded-lg bg-transparent px-1 py-1.5 text-\[13px] leading-5 outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-40" />

&#x20;       <div className="flex items-center justify-between gap-3">

&#x20;         <span className="flex items-center gap-1.5 pl-1 text-\[10px] text-muted-foreground"><GitFork className="size-3" aria-hidden="true" /> Explore approaches</span>

&#x20;         <button type={busy ? "button" : "submit"} aria-label={busy ? "Stop" : "Send question"} data-action={busy ? "stop" : "send"}

&#x20;           disabled={disabled || (busy ? !onStop : !inputValue.trim() || !onSubmit)}

&#x20;           onClick={busy ? (event) => { event.preventDefault(); onStop?.(); } : undefined}

&#x20;           className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-30">

&#x20;           {busy ? <Square className="size-3 fill-current" aria-hidden="true" /> : <ArrowUp className="size-4" aria-hidden="true" />}

&#x20;         </button>

&#x20;       </div>

&#x20;     </form>

&#x20;     <p role="status" aria-live="polite" aria-atomic="true" data-announcement className="sr-only">{announcement}</p>

&#x20;   </div>

&#x20; );

}



export default BranchingReasoningChatInput;





demo.tsx

"use client";



import \* as React from "react";

import { GitFork, RotateCcw } from "lucide-react";

import { BranchingReasoningChatInput } from "@/components/ui/branching-reasoning-chat-input";

import type { BranchingReasoningStatus, ReasoningBranch } from "@/components/ui/branching-reasoning-chat-input";



const QUESTION = "Which TokenPe setup should we ship first?";

const ANSWER = "Ship the white-label API if checkout has to stay in your product. Use the widget for a hosted ramp you can theme. Use payment links when there is no app yet.";

const BRANCHES: ReasoningBranch\[] = \[

&#x20; { id: "links", title: "Payment links", note: "Collect before an app is ready.", score: 74 },

&#x20; { id: "widget", title: "Hosted widget", note: "A themed ramp you can embed.", score: 86 },

&#x20; { id: "api", title: "White-label API", note: "Checkout stays in your UI.", score: 94 },

];

type DemoState = { status: BranchingReasoningStatus; prompt: string; value: string; branches: ReasoningBranch\[]; answer: string };

type DemoRun = { id: number; source: "auto" | "user"; prompt: string };

type DemoProps = { autoplay?: boolean };

const initial = (): DemoState => ({ status: "idle", prompt: "", value: QUESTION, branches: \[], answer: "" });



export default function BranchingReasoningDemo({ autoplay = true }: DemoProps) {

&#x20; const \[state, setState] = React.useState(initial);

&#x20; const \[motion, setMotion] = React.useState({ ready: false, reduced: true });

&#x20; const \[run, setRun] = React.useState({ id: 0, source: "auto", prompt: QUESTION } as DemoRun | null);

&#x20; const started = React.useRef(false);



&#x20; React.useEffect(() => {

&#x20;   const media = window.matchMedia("(prefers-reduced-motion: reduce)");

&#x20;   const update = () => setMotion({ ready: true, reduced: media.matches });

&#x20;   update();

&#x20;   media.addEventListener("change", update);

&#x20;   return () => media.removeEventListener("change", update);

&#x20; }, \[]);



&#x20; React.useEffect(() => {

&#x20;   if (!motion.ready || !run || (run.source === "auto" \&\& !autoplay)) return;

&#x20;   const sample = run.prompt === QUESTION;

&#x20;   const approaches: ReasoningBranch\[] = sample ? BRANCHES : \[

&#x20;     { id: "widget", title: "Hosted widget", note: "Theme the ramp and embed it.", score: 76 },

&#x20;     { id: "links", title: "Payment link", note: "Collect without a website.", score: 84 },

&#x20;     { id: "api", title: "Direct API", note: "Quotes, orders, and webhooks.", score: 92 },

&#x20;   ];

&#x20;   const response = sample ? ANSWER : "This preview compares TokenPe setups and shows a sample answer. It does not call a live service.";

&#x20;   const selected = approaches.map((branch, index) => ({ ...branch, chosen: index === 2 }));

&#x20;   if (motion.reduced) {

&#x20;     if (run.source === "auto" \&\& !started.current) return;

&#x20;     setState({ status: "done", prompt: run.prompt, value: "", branches: selected, answer: response });

&#x20;     setRun(null);

&#x20;     return;

&#x20;   }

&#x20;   started.current = false;

&#x20;   const timers: number\[] = \[];

&#x20;   const offset = run.source === "auto" ? 1000 : 0;

&#x20;   const later = (ms: number, callback: () => void) => timers.push(window.setTimeout(callback, offset + ms));

&#x20;   if (run.source === "auto") setState(initial());

&#x20;   later(0, () => {

&#x20;     started.current = true;

&#x20;     setState({ status: "branching", prompt: run.prompt, value: "", branches: \[], answer: "" });

&#x20;   });

&#x20;   later(400, () => setState((previous) => ({ ...previous, branches: approaches.map((branch) => ({ ...branch, score: 0 })) })));

&#x20;   for (let step = 0; step <= 10; step++) later(800 + step \* 180, () => {

&#x20;     setState((previous) => ({ ...previous, branches: approaches.map((branch) => ({ ...branch, score: Math.round(branch.score! \* step / 10) })) }));

&#x20;   });

&#x20;   later(2900, () => setState((previous) => ({ ...previous, status: "choosing", branches: selected })));

&#x20;   for (let step = 1; step <= 20; step++) later(3300 + (step - 1) \* 105, () => {

&#x20;     setState((previous) => ({ ...previous, status: "answering", answer: response.slice(0, Math.ceil(response.length \* step / 20)) }));

&#x20;   });

&#x20;   later(5400, () => {

&#x20;     setState((previous) => ({ ...previous, status: "done", answer: response }));

&#x20;     setRun(null);

&#x20;   });

&#x20;   return () => timers.forEach((timer) => window.clearTimeout(timer));

&#x20; }, \[autoplay, motion.ready, motion.reduced, run]);



&#x20; function send(prompt: string) {

&#x20;   setRun((previous) => ({ id: (previous?.id ?? 0) + 1, source: "user", prompt }));

&#x20; }



&#x20; return (

&#x20;   <div data-branching-demo data-autoplay={autoplay} className="flex min-h-svh w-full items-center justify-center bg-background p-4 font-sans text-foreground">

&#x20;     <div className="w-full max-w-\[600px]">

&#x20;       <header className="mb-3 flex items-end justify-between gap-3 px-1">

&#x20;         <div>

&#x20;           <p className="mb-1.5 flex items-center gap-1.5 text-\[9px] font-medium uppercase tracking-\[0.18em] text-muted-foreground"><GitFork className="size-3" aria-hidden="true" /> Choose a setup</p>

&#x20;           <h1 className="text-\[24px] font-medium leading-tight tracking-tight">Three ways onto the rail.</h1>

&#x20;         </div>

&#x20;         <span className="mb-1 shrink-0 rounded-full border border-border px-2 py-1 text-\[9px] text-muted-foreground">Preview</span>

&#x20;       </header>

&#x20;       <div className="h-\[468px]" data-demo-stage>

&#x20;         <BranchingReasoningChatInput status={state.status} prompt={state.prompt} branches={state.branches} answer={state.answer}

&#x20;           value={state.value} onValueChange={(value) => {

&#x20;             if (state.status === "idle") setRun(null);

&#x20;             setState((previous) => ({ ...previous, value }));

&#x20;           }}

&#x20;           onSubmit={send} onStop={() => {

&#x20;             setRun(null);

&#x20;             setState((previous) => ({ ...previous, status: "done", value: previous.value || previous.prompt, answer: previous.answer || "Stopped before an answer was ready." }));

&#x20;           }} />

&#x20;       </div>

&#x20;       <footer className="mt-2 flex min-h-6 items-center justify-between gap-3 px-1 text-\[10px] text-muted-foreground">

&#x20;         <span>Preview only. Scores are illustrative.</span>

&#x20;         <button type="button" data-replay onClick={() => send(QUESTION)}

&#x20;           className="flex shrink-0 items-center gap-1.5 rounded-md px-1 py-1 outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"><RotateCcw className="size-3" aria-hidden="true" /> Replay</button>

&#x20;       </footer>

&#x20;     </div>

&#x20;   </div>

&#x20; );

}



```



Install NPM dependencies:

```bash

lucide-react

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



