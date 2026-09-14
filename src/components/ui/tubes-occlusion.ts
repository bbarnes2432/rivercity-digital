/** Keep the studio's ribbon masks aligned without measuring the page at 60 Hz.
 * Scroll/resize/layout changes request a frame; moving masks keep requesting
 * frames only for the duration of their entrance or hover transition. */
export function observeTubeOcclusion(layer: HTMLElement, ambient: boolean) {
  const page = layer.closest<HTMLElement>(".wd-site");
  if (!page) return;

  const selector = ".btn, .wd-button, .wd-app-window, .rcd-light, .rcd-tilt-fill i";
  let masks: HTMLElement[] = [];
  const nearby = new Set<HTMLElement>();
  const moving = new Map<HTMLElement, Set<string>>();
  let frame = 0;
  let last = "";
  let disposed = false;

  const request = () => {
    if (!disposed && !document.hidden && !frame) frame = requestAnimationFrame(update);
  };
  const affectsMask = (target: HTMLElement) => masks.some(mask => target === mask || target.contains(mask));
  const update = () => {
    frame = 0;
    // The fixed canvas excludes the scrollbar; innerWidth includes it and
    // would keep a fully covered desktop canvas rendering unnecessarily.
    const width = document.documentElement.clientWidth, height = window.innerHeight;
    const holes: string[] = [];
    let covered = false;
    for (const mask of nearby) {
      if (!ambient && mask.matches(".btn, .wd-button") && !mask.matches(":hover")) continue;
      const r = mask.getBoundingClientRect();
      if (mask.matches(".rcd-tilt-fill i") && r.height < 2) continue;
      if (r.bottom <= 0 || r.top >= height || r.right <= 0 || r.left >= width) continue;
      if (r.left <= 0 && r.right >= width && r.top <= 0 && r.bottom >= height) covered = true;
      // Counterclockwise holes within a clockwise outer rectangle.
      const left = r.left.toFixed(1), right = r.right.toFixed(1);
      const top = r.top.toFixed(1), bottom = r.bottom.toFixed(1);
      holes.push(`${left}px ${bottom}px, ${right}px ${bottom}px, ${right}px ${top}px, ${left}px ${top}px, ${left}px ${bottom}px, 0px 0px`);
    }
    const next = holes.length
      ? `polygon(nonzero, 0px 0px, ${width}px 0px, ${width}px ${height}px, 0px ${height}px, 0px 0px, ${holes.join(", ")})`
      : "";
    if (next !== last) { layer.style.clipPath = next; last = next; }
    layer.toggleAttribute("data-covered", covered);
    if (moving.size) request();
  };
  const intersection = new IntersectionObserver(entries => {
    for (const entry of entries) {
      const target = entry.target as HTMLElement;
      if (entry.isIntersecting) nearby.add(target);
      else nearby.delete(target);
    }
    request();
  }, { rootMargin: "120px" });
  const resize = new ResizeObserver(request);
  const collect = () => {
    const next = Array.from(page.querySelectorAll<HTMLElement>(selector));
    for (const mask of masks) {
      if (!next.includes(mask)) {
        nearby.delete(mask); intersection.unobserve(mask); resize.unobserve(mask);
      }
    }
    for (const mask of next) {
      if (!masks.includes(mask)) { intersection.observe(mask); resize.observe(mask); }
    }
    masks = next;
    for (const target of moving.keys()) if (!page.contains(target)) moving.delete(target);
    request();
  };
  const mutation = new MutationObserver(records => {
    if (records.some(record => record.type === "childList")) collect();
    else if (records.some(record => record.target instanceof HTMLElement && affectsMask(record.target))) request();
  });
  const onMotion = (event: Event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement) || !affectsMask(target)) return;
    const key = event instanceof AnimationEvent ? `animation:${event.animationName}` : `transition:${(event as TransitionEvent).propertyName}`;
    if (event.type === "animationstart" || event.type === "transitionrun") {
      if (!moving.has(target)) moving.set(target, new Set());
      moving.get(target)!.add(key);
    } else {
      moving.get(target)?.delete(key);
      if (!moving.get(target)?.size) moving.delete(target);
    }
    request();
  };
  const visibility = () => {
    if (document.hidden) { cancelAnimationFrame(frame); frame = 0; }
    else request();
  };
  const motionEvents = ["animationstart", "animationend", "animationcancel", "transitionrun", "transitionend", "transitioncancel"];
  collect();
  resize.observe(page);
  mutation.observe(page, { subtree: true, childList: true, attributes: true, attributeFilter: ["class", "style", "data-enter-state"] });
  window.addEventListener("scroll", request, { passive: true, capture: true });
  window.addEventListener("resize", request);
  page.addEventListener("pointerover", request);
  page.addEventListener("pointerout", request);
  motionEvents.forEach(name => page.addEventListener(name, onMotion));
  document.addEventListener("visibilitychange", visibility);
  return () => {
    disposed = true;
    cancelAnimationFrame(frame);
    intersection.disconnect(); resize.disconnect(); mutation.disconnect();
    window.removeEventListener("scroll", request, true);
    window.removeEventListener("resize", request);
    page.removeEventListener("pointerover", request);
    page.removeEventListener("pointerout", request);
    motionEvents.forEach(name => page.removeEventListener(name, onMotion));
    document.removeEventListener("visibilitychange", visibility);
    layer.style.clipPath = "";
    layer.removeAttribute("data-covered");
  };
}
