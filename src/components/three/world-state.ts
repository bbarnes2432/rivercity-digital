/* Shared, mutable, read every frame — never React state. The hallway section
 * writes progress and whether it is on screen; the world reads them, walks
 * the camera, and writes back which screen is beside the visitor. The tubes
 * cursor writes its light colours; the hallway's cursor lights read them. */
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
  /** Where the caption hangs: under the nearest screen, in viewport px. */
  caption: { x: 0, y: 0, on: false },
  /** Screens nearer than the cursor's plane, as viewport-px polygons: the
   *  cursor is clipped out of them so it passes behind. */
  occluders: [] as number[][][],
  occludersAt: 0,
  /** The site being built (BuildSite), as a viewport-px polygon, and when
   *  it was last written — stale after a few hundred ms means off screen. */
  site: null as number[][] | null,
  siteAt: 0,
  /** The cursor's four light colours, and when they last changed. */
  cursorColors: ["#21d4fd", "#b721ff", "#f4d03f", "#11cdef"] as string[],
  cursorColorsAt: 0,
};
