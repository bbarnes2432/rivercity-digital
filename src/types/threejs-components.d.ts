/* The tubes cursor build is a self-contained ES module with a default
 * export: `TubesCursor(canvas, options)`. Typed loosely here; the component
 * narrows what it uses. */
declare module "threejs-components/build/cursors/tubes1.min.js" {
  const TubesCursor: (canvas: HTMLCanvasElement, options?: Record<string, unknown>) => unknown;
  export default TubesCursor;
}
