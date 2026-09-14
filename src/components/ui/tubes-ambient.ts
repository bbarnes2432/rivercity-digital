/** The cursor's idle figure-eight, sized to stay inside a phone's viewport. */
export function ambientTubeTarget(
  elapsed: number,
  size: { width: number; height: number; wWidth: number },
) {
  const scale = size.wWidth / Math.max(size.width, 1);
  return {
    x: Math.min(300, size.width * 0.32) * scale * Math.cos(elapsed * 0.8),
    y: Math.min(150, size.height * 0.18) * scale * Math.sin(elapsed * 1.6),
  };
}
