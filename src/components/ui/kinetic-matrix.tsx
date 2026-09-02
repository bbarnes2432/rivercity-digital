'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Sparkles, Play, Pause } from 'lucide-react';
import { useReducedMotion } from '@/lib/use-reduced-motion';

/* Deliberately NOT importing `cn` from "@/lib/utils".
 *
 * That helper is the real shadcn one and stays available at the conventional
 * path for components pasted in later — but it pulls in tailwind-merge, which
 * measured at 11.5 KB gzipped in the client bundle. Paying that on the page
 * that advertises "LCP under 1.2 seconds", and that receives $20–33 ad clicks,
 * to resolve exactly one className is a bad trade.
 *
 * It isn't needed here anyway: the root is always an absolutely positioned
 * layer, so there is no position utility for a caller's className to conflict
 * with, which is the only thing tailwind-merge would have been resolving. */
const classes = (...parts: Array<string | false | null | undefined>) =>
    parts.filter(Boolean).join(' ');

/* ─────────────────────────────────────────────────────────────────────────────
 * KineticMatrix — a spring-mass lattice that reacts to the pointer.
 *
 * Adapted from the upstream component in five ways, each of which it needed to
 * survive on a paid landing page rather than a demo card:
 *
 *  1. POINTER EVENTS, NOT MOUSE EVENTS. Upstream binds onMouseMove/Down/Up,
 *     which no touch device fires. On a phone the original is a dead static
 *     grid — on the very page brief that asked for mobile. Pointer Events
 *     cover mouse, touch and pen in one API. `touch-action: pan-y` is
 *     essential alongside them: without it the canvas swallows the drag and
 *     the visitor physically cannot scroll past the hero.
 *
 *  2. TRANSPARENT, NOT OPAQUE. Upstream takes a `{ alpha: false }` context and
 *     paints its own near-black background, so it can only ever be the whole
 *     surface. Here it clears to transparent and composites over the hero's
 *     photograph and gradient — a wireframe forming over the real image, which
 *     is what the page is actually selling.
 *
 *  3. IT STOPS. Upstream runs requestAnimationFrame forever. This pauses when
 *     scrolled out of view and when the tab is hidden, so it is not spending
 *     phone battery on physics nobody is looking at.
 *
 *  4. IT RESPECTS prefers-reduced-motion. Upstream has no such check. Here a
 *     single settled frame is drawn and the loop never starts.
 *
 *  5. NO HEADING OF ITS OWN. Upstream renders an <h1> reading "TOPOLOGY".
 *     Dropped: this sits behind a hero that already has the one <h1> the ads
 *     and search results depend on, and canvas text is invisible to both.
 *
 * The canvas is decoration — aria-hidden, never focusable, and carries no
 * information that isn't also in the DOM.
 * ───────────────────────────────────────────────────────────────────────────── */

interface MatrixNode {
    x: number; y: number;
    vx: number; vy: number;
    baseX: number; baseY: number;
    col: number; row: number;
    radius: number;
    label: string;
    tension: number;
    pulsePhase: number;
}

interface SynapticPulse {
    fromNode: number;
    toNode: number;
    progress: number;
    speed: number;
}

interface GravitationalShockwave {
    x: number; y: number;
    radius: number;
    maxRadius: number;
    power: number;
}

export interface KineticMatrixProps {
    /** Show the PULSE / FREEZE chips. Off by default — on a lead-gen hero they
     *  compete with the call to action. */
    controls?: boolean;
    /** Base lattice spacing in px at desktop. Widened automatically on narrow
     *  viewports so a phone runs a fraction of the node count. */
    spacing?: number;
    /** Fire a shockwave from the centre this many ms after mount. Used to land
     *  the ripple exactly as the portal entrance finishes. null disables it. */
    autoImpulseDelay?: number | null;
    className?: string;
}

export function KineticMatrix({
    controls = false,
    spacing: spacingProp = 52,
    autoImpulseDelay = null,
    className = '',
}: KineticMatrixProps) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const [isRunning, setIsRunning] = useState(true);
    const reducedMotion = useReducedMotion();

    // Visibility gates. Both must be true for the loop to advance.
    const onScreenRef = useRef(true);
    const tabVisibleRef = useRef(true);

    const pointerRef = useRef({
        x: -2000, y: -2000,
        prevX: -2000, prevY: -2000,
        vx: 0, vy: 0,
        // Upstream uses 220 on a 600px demo card. Across a full-bleed hero that
        // catches most of the grid at once, so the whole lattice lurches toward
        // the cursor instead of rippling around it.
        radius: 170,
        isDown: false,
    });

    const nodesRef = useRef<MatrixNode[]>([]);
    const pulsesRef = useRef<SynapticPulse[]>([]);
    const shockwavesRef = useRef<GravitationalShockwave[]>([]);
    const dimensionsRef = useRef({ width: 0, height: 0, cols: 0, rows: 0, spacing: spacingProp });

    const buildLattice = useCallback((width: number, height: number) => {
        // Coarser lattice on small screens: at 52px a 390px-wide phone would
        // still build a dense grid and run the same per-frame cost as desktop.
        const spacing = width < 640 ? spacingProp + 14 : width < 1024 ? spacingProp + 6 : spacingProp;
        const cols = Math.ceil(width / spacing) + 1;
        const rows = Math.ceil(height / spacing) + 1;
        const nodes: MatrixNode[] = [];

        for (let c = 0; c < cols; c++) {
            for (let r = 0; r < rows; r++) {
                const x = c * spacing;
                const y = r * spacing;
                nodes.push({
                    x, y, vx: 0, vy: 0,
                    baseX: x, baseY: y,
                    col: c, row: r,
                    radius: 1.4,
                    label: `0x${((c * 17 + r * 31) % 256).toString(16).padStart(2, '0').toUpperCase()}`,
                    tension: 0,
                    pulsePhase: Math.random() * Math.PI * 2,
                });
            }
        }

        dimensionsRef.current = { width, height, cols, rows, spacing };
        nodesRef.current = nodes;
        pulsesRef.current = [];
        shockwavesRef.current = [];
    }, [spacingProp]);

    // Size the backing store, and rebuild the lattice only on a real size change.
    useEffect(() => {
        const container = containerRef.current;
        const canvas = canvasRef.current;
        if (!container || !canvas) return;

        const ctx = canvas.getContext('2d', { alpha: true });
        if (!ctx) return;

        let lastW = 0;
        let lastH = 0;

        const ro = new ResizeObserver((entries) => {
            for (const entry of entries) {
                const rect = entry.contentRect;
                if (rect.width === 0 || rect.height === 0) continue;

                const dpr = Math.min(window.devicePixelRatio || 1, 2);
                canvas.width = Math.floor(rect.width * dpr);
                canvas.height = Math.floor(rect.height * dpr);
                canvas.style.width = `${rect.width}px`;
                canvas.style.height = `${rect.height}px`;
                ctx.setTransform(1, 0, 0, 1, 0, 0);
                ctx.scale(dpr, dpr);

                // Mobile browsers fire resize constantly as the URL bar hides and
                // shows. Rebuilding on every one of those resets the simulation
                // mid-interaction, so ignore pure-height jitter.
                const widthChanged = Math.abs(rect.width - lastW) > 1;
                const heightJumped = Math.abs(rect.height - lastH) > 90;
                if (widthChanged || heightJumped || nodesRef.current.length === 0) {
                    buildLattice(rect.width, rect.height);
                    lastW = rect.width;
                    lastH = rect.height;
                } else {
                    dimensionsRef.current.width = rect.width;
                    dimensionsRef.current.height = rect.height;
                }
            }
        });

        ro.observe(container);
        return () => ro.disconnect();
    }, [buildLattice]);

    // Pause offscreen and on hidden tabs.
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const io = new IntersectionObserver(
            (entries) => { onScreenRef.current = entries[0]?.isIntersecting ?? true; },
            { rootMargin: '120px' },
        );
        io.observe(container);

        const onVis = () => { tabVisibleRef.current = !document.hidden; };
        document.addEventListener('visibilitychange', onVis);

        return () => {
            io.disconnect();
            document.removeEventListener('visibilitychange', onVis);
        };
    }, []);

    const drawLatticeLink = (
        ctx: CanvasRenderingContext2D,
        n1: MatrixNode,
        n2: MatrixNode,
        restLen: number,
    ) => {
        const dx = n1.x - n2.x;
        const dy = n1.y - n2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const stretch = Math.abs(dist - restLen) / restLen;
        const isTensioned = n1.tension > 0.05 || n2.tension > 0.05 || stretch > 0.1;

        if (isTensioned) {
            const glow = Math.max(n1.tension, n2.tension, stretch * 2);
            // Brand teal carries the energy; the resting grid stays neutral so
            // the accent reads as a reaction rather than as the base state.
            ctx.strokeStyle = `rgba(76, 165, 173, ${Math.min(1, 0.3 + glow * 0.7)})`;
            ctx.lineWidth = 0.8 + glow * 1.4;
        } else {
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.10)';
            ctx.lineWidth = 0.65;
        }

        ctx.beginPath();
        ctx.moveTo(n1.x, n1.y);
        ctx.lineTo(n2.x, n2.y);
        ctx.stroke();
    };

    const paint = useCallback((ctx: CanvasRenderingContext2D, animate: boolean, dt: number) => {
        const { width, height, cols, rows, spacing } = dimensionsRef.current;
        const nodes = nodesRef.current;
        const pulses = pulsesRef.current;
        const shockwaves = shockwavesRef.current;
        const pointer = pointerRef.current;

        ctx.clearRect(0, 0, width, height);

        if (animate) {
            pointer.vx = (pointer.x - pointer.prevX) / (dt * 1000 || 1);
            pointer.vy = (pointer.y - pointer.prevY) / (dt * 1000 || 1);
            pointer.prevX = pointer.x;
            pointer.prevY = pointer.y;
            const mouseSpeed = Math.hypot(pointer.vx, pointer.vy);

            for (let s = shockwaves.length - 1; s >= 0; s--) {
                const sw = shockwaves[s];
                sw.radius += 400 * dt;
                sw.power *= Math.pow(0.12, dt);
                if (sw.radius > sw.maxRadius || sw.power < 0.01) shockwaves.splice(s, 1);
            }

            const SPRING_K = 34;   // stiffer than upstream's 26: snaps back sooner
            const DAMPING = 0.85;
            // No input may displace a node further than this from its rest
            // position. Without the clamp a fast flick — or a burst of pointer
            // events arriving in one frame — drives velocity high enough to tear
            // the grid into a collapsed web across the whole hero.
            const MAX_DISPLACEMENT = 30;

            for (let i = 0; i < nodes.length; i++) {
                const n = nodes[i];
                n.pulsePhase += dt * 3.2;

                const dx = pointer.x - n.x;
                const dy = pointer.y - n.y;
                const dist = Math.hypot(dx, dy);

                if (dist < pointer.radius && dist > 0) {
                    const ratio = 1 - dist / pointer.radius;
                    // Tuned well down from upstream (1600 / 180 / 2400) and the
                    // speed term is capped, so a flick can't spike the force.
                    const force = ratio * (380 + Math.min(mouseSpeed, 4) * 55 + (pointer.isDown ? 700 : 0));
                    const angle = Math.atan2(dy, dx);
                    n.vx -= Math.cos(angle) * force * dt;
                    n.vy -= Math.sin(angle) * force * dt;
                    n.tension = Math.min(1, n.tension + ratio * 0.5);
                }

                for (let s = 0; s < shockwaves.length; s++) {
                    const sw = shockwaves[s];
                    const swDx = n.x - sw.x;
                    const swDy = n.y - sw.y;
                    const delta = Math.abs(Math.hypot(swDx, swDy) - sw.radius);
                    if (delta < 55) {
                        const force = (1 - delta / 55) * sw.power * 950;
                        const angle = Math.atan2(swDy, swDx);
                        n.vx += Math.cos(angle) * force * dt;
                        n.vy += Math.sin(angle) * force * dt;
                        n.tension = 1.0;
                    }
                }

                n.vx += (n.baseX - n.x) * SPRING_K * dt;
                n.vy += (n.baseY - n.y) * SPRING_K * dt;
                n.vx *= DAMPING;
                n.vy *= DAMPING;
                n.x += n.vx * dt * 60;
                n.y += n.vy * dt * 60;

                const ddx = n.x - n.baseX;
                const ddy = n.y - n.baseY;
                const disp = Math.hypot(ddx, ddy);
                if (disp > MAX_DISPLACEMENT) {
                    const k = MAX_DISPLACEMENT / disp;
                    n.x = n.baseX + ddx * k;
                    n.y = n.baseY + ddy * k;
                    n.vx *= 0.5;
                    n.vy *= 0.5;
                }

                n.tension = Math.max(0, n.tension - dt * 0.9);
            }

            if (Math.random() < 0.3 && nodes.length > 0 && pulses.length < 40) {
                const fromIdx = Math.floor(Math.random() * nodes.length);
                const fromNode = nodes[fromIdx];
                const dirs = [{ dc: 1, dr: 0 }, { dc: -1, dr: 0 }, { dc: 0, dr: 1 }, { dc: 0, dr: -1 }];
                const dir = dirs[Math.floor(Math.random() * dirs.length)];
                const tc = fromNode.col + dir.dc;
                const tr = fromNode.row + dir.dr;
                if (tc >= 0 && tc < cols && tr >= 0 && tr < rows) {
                    const toIdx = tc * rows + tr;
                    if (toIdx >= 0 && toIdx < nodes.length) {
                        pulses.push({ fromNode: fromIdx, toNode: toIdx, progress: 0, speed: 1.6 + Math.random() * 2.2 });
                    }
                }
            }
        }

        // Lattice strands
        for (let c = 0; c < cols; c++) {
            for (let r = 0; r < rows; r++) {
                const n = nodes[c * rows + r];
                if (!n) continue;
                if (c < cols - 1) {
                    const nr = nodes[(c + 1) * rows + r];
                    if (nr) drawLatticeLink(ctx, n, nr, spacing);
                }
                if (r < rows - 1) {
                    const nd = nodes[c * rows + (r + 1)];
                    if (nd) drawLatticeLink(ctx, n, nd, spacing);
                }
            }
        }

        // Travelling pulses
        if (animate) {
            for (let p = pulses.length - 1; p >= 0; p--) {
                const pulse = pulses[p];
                pulse.progress += dt * pulse.speed;
                const n1 = nodes[pulse.fromNode];
                const n2 = nodes[pulse.toNode];
                if (!n1 || !n2 || pulse.progress >= 1) {
                    if (n2) n2.tension = Math.min(1, n2.tension + 0.35);
                    pulses.splice(p, 1);
                    continue;
                }
                ctx.fillStyle = '#7FD4DA';
                ctx.beginPath();
                ctx.arc(
                    n1.x + (n2.x - n1.x) * pulse.progress,
                    n1.y + (n2.y - n1.y) * pulse.progress,
                    2.0, 0, Math.PI * 2,
                );
                ctx.fill();
            }
        }

        // Nodes
        const pointerActive = pointerRef.current.x > -1000;
        for (let i = 0; i < nodes.length; i++) {
            const n = nodes[i];
            const dist = pointerActive ? Math.hypot(pointerRef.current.x - n.x, pointerRef.current.y - n.y) : Infinity;
            const isNear = dist < pointerRef.current.radius;

            const currentRadius = isNear
                ? n.radius * 2.2 + n.tension * 1.5
                : n.radius + (animate ? Math.sin(n.pulsePhase) * 0.25 : 0);

            if (isNear || n.tension > 0.1) {
                ctx.fillStyle = `rgba(76, 165, 173, ${Math.min(1, 0.25 + n.tension * 0.65)})`;
                ctx.beginPath();
                ctx.arc(n.x, n.y, currentRadius * 2.2, 0, Math.PI * 2);
                ctx.fill();
            }

            ctx.fillStyle = isNear || n.tension > 0.1 ? '#FFFFFF' : 'rgba(255, 255, 255, 0.30)';
            ctx.beginPath();
            ctx.arc(n.x, n.y, Math.max(0.8, currentRadius), 0, Math.PI * 2);
            ctx.fill();

            // Hex readout near the cursor. Pointer-driven, so it simply never
            // appears on touch — which is correct, not a gap.
            if (animate && dist < 90) {
                const ring = ((n.pulsePhase * 20) % 32) + 4;
                ctx.strokeStyle = `rgba(127, 212, 218, ${(1 - ring / 36) * 0.35})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.arc(n.x, n.y, ring, 0, Math.PI * 2);
                ctx.stroke();

                ctx.font = '8px ui-monospace, SFMono-Regular, Consolas, monospace';
                ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
                ctx.fillText(n.label, n.x + 9, n.y - 9);
            }
        }
    }, []);

    // Reduced motion: one settled frame, no loop at all.
    useEffect(() => {
        if (!reducedMotion) return;
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d', { alpha: true });
        if (!ctx) return;
        const id = window.setTimeout(() => paint(ctx, false, 0), 60);
        return () => window.clearTimeout(id);
    }, [reducedMotion, paint]);

    useEffect(() => {
        if (reducedMotion) return;
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d', { alpha: true });
        if (!ctx) return;

        let animId = 0;
        let lastTime = performance.now();

        const render = (now: number) => {
            const dt = Math.min((now - lastTime) / 1000, 0.033);
            lastTime = now;
            if (isRunning && onScreenRef.current && tabVisibleRef.current) {
                paint(ctx, true, dt);
            }
            animId = requestAnimationFrame(render);
        };

        animId = requestAnimationFrame(render);
        return () => cancelAnimationFrame(animId);
    }, [isRunning, reducedMotion, paint]);

    /* Fire a shockwave from the centre a beat after mount, timed to land as
     * the portal entrance finishes opening. The lattice then ripples outward
     * from the point the visitor just stepped through, so the two animations
     * read as one event rather than two that happen to overlap.
     *
     * The push is inlined rather than calling triggerCentralImpulse, which is
     * rebuilt every render and would restart this timer on each one. */
    useEffect(() => {
        if (autoImpulseDelay == null || reducedMotion) return;
        const id = window.setTimeout(() => {
            const { width, height } = dimensionsRef.current;
            if (width === 0 || height === 0) return;
            shockwavesRef.current.push({
                x: width / 2,
                y: height / 2,
                radius: 10,
                maxRadius: Math.max(width, height) * 0.85,
                power: 1.4,
            });
        }, autoImpulseDelay);
        return () => window.clearTimeout(id);
    }, [autoImpulseDelay, reducedMotion]);

    const setPointerFromEvent = (e: React.PointerEvent<HTMLDivElement>) => {
        const container = containerRef.current;
        if (!container) return;
        const rect = container.getBoundingClientRect();
        pointerRef.current.x = e.clientX - rect.left;
        pointerRef.current.y = e.clientY - rect.top;
    };

    const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => setPointerFromEvent(e);

    const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
        setPointerFromEvent(e);
        pointerRef.current.isDown = true;
        const rect = containerRef.current?.getBoundingClientRect();
        if (!rect) return;
        shockwavesRef.current.push({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
            radius: 8,
            maxRadius: 420,
            power: 1.2,
        });
    };

    const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
        pointerRef.current.isDown = false;
        // A finger has no hover state: once it lifts there is no pointer on the
        // surface, so park it offscreen and let the lattice settle.
        if (e.pointerType === 'touch') {
            pointerRef.current.x = -2000;
            pointerRef.current.y = -2000;
        }
    };

    const handlePointerLeave = () => {
        pointerRef.current.x = -2000;
        pointerRef.current.y = -2000;
        pointerRef.current.isDown = false;
    };

    const triggerCentralImpulse = () => {
        const { width, height } = dimensionsRef.current;
        shockwavesRef.current.push({
            x: width / 2,
            y: height / 2,
            radius: 10,
            maxRadius: Math.max(width, height) * 0.85,
            power: 1.4,
        });
    };

    return (
        <div
            ref={containerRef}
            onPointerMove={handlePointerMove}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            onPointerLeave={handlePointerLeave}
            /* Always an absolutely positioned layer: it fills whichever
               positioned ancestor it is dropped into. That keeps the canvas's
               `absolute inset-0` anchored without the caller having to supply a
               position class, and removes the only class conflict there was. */
            className={classes('absolute inset-0 select-none overflow-hidden', className)}
            /* pan-y is load-bearing: it lets a vertical drag scroll the page
               while we still receive the coordinates. Without it the hero traps
               the finger and the page cannot be scrolled on a phone. */
            style={{ touchAction: 'pan-y' }}
        >
            <canvas
                ref={canvasRef}
                aria-hidden="true"
                className="absolute inset-0 block h-full w-full"
            />

            {controls && (
                <div className="pointer-events-none absolute inset-0 z-20 p-4 md:p-6">
                    <div className="pointer-events-auto flex items-center gap-2">
                        <button
                            type="button"
                            onClick={triggerCentralImpulse}
                            className="flex items-center gap-1.5 rounded-lg border border-white/20 bg-white/10 px-2.5 py-1.5 font-mono text-[10px] text-white/80 backdrop-blur-md transition-colors hover:bg-white/20"
                        >
                            <Sparkles className="size-3" />
                            <span className="hidden sm:inline">PULSE</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsRunning((p) => !p)}
                            aria-pressed={!isRunning}
                            className="flex items-center gap-1.5 rounded-lg border border-white/20 bg-white/10 px-2.5 py-1.5 font-mono text-[10px] text-white/80 backdrop-blur-md transition-colors hover:bg-white/20"
                        >
                            {isRunning ? <Pause className="size-3" /> : <Play className="size-3" />}
                            <span>{isRunning ? 'FREEZE' : 'RUN'}</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default KineticMatrix;
