/* Shared, mutable, read-every-frame state for the world.
 *
 * The DOM side writes (scroll progress, whether the hallway is on screen,
 * where the pointer is); the three side reads inside useFrame. Deliberately
 * not React state: these change on every scroll and pointer event, and the
 * only thing that should re-run for them is the render loop. */
export const world = {
  /** 0 at the top of the hallway section, 1 at its end. */
  progress: 0,
  /** True while the hallway section intersects the viewport. */
  active: false,
  /** Which project is nearest the camera, 0..7. */
  index: 0,
  pointer: {
    /** Client pixels. */
    x: 0,
    y: 0,
    /** Normalised −1..1, y up. */
    nx: 0,
    ny: 0,
    /** performance.now() of the last move. */
    t: 0,
    /** A mouse or pen, not a finger. */
    fine: false,
  },
};
