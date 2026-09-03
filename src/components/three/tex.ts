/* Next's image optimiser serves a resized WebP for any /public image. The
 * portfolio originals are up to 2560×1600 — eight of those decoded on the GPU
 * is well over 100 MB on a phone. 1080 wide is plenty at any distance the
 * page shows them from. Every texture on the shared canvas goes through
 * this, so one URL means one decode, however many places show the site. */
export const texUrl = (src: string, w: number) => `/_next/image?url=${encodeURIComponent(src)}&w=${w}&q=75`;
