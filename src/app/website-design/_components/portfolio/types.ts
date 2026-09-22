// A WebGL hero effect running inside a portfolio preview. Pointer coordinates are normalized to
// the preview (0..1, y from the top); the preview owns the render loop and visibility.
export type LiveEffect = {
  pointer(x: number, y: number): void;
  leave(): void;
  render(delta: number, elapsed: number): void;
  dispose(): void;
};
