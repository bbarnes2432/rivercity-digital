/* Shared, mutable, read every frame — never React state. The hallway section
 * writes progress and whether it is on screen; the world reads them, walks
 * the camera, and writes back which screen is beside the visitor. */
export const world = {
  /** 0..1 through the hallway section. */
  progress: 0,
  /** 0..1 as the hallway section enters the viewport — the room's lights. */
  enter: 0,
  /** The hallway section is on screen: the world draws. */
  active: false,
  /** The screen beside (or just ahead of) the visitor, written by the world. */
  index: 0,
  pointer: { x: 0, y: 0, nx: 0, ny: 0, t: 0, fine: false },
};
