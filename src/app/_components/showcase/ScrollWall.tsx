import Image from "next/image";
import { BUILDS } from "./builds";
import styles from "./ScrollWall.module.css";

/* Columns of client-site screenshots drifting behind a hero headline.
 * Pure CSS motion: each column holds its pair of screenshots twice and
 * slides by exactly half its height, so the loop is seamless. It stops for
 * reduced motion and for the site-wide pause (<html data-motion-paused>).
 * Every image has fixed dimensions, so nothing shifts while they load.
 * Decorative only: hidden from assistive tech. */
const COLUMNS = [
  ["alwaysclean", "upright"],
  ["lindas", "wellness"],
  ["robinsons", "sethanthony"],
  ["mend", "stjoseph"],
] as const;

const byId = new Map(BUILDS.map(build => [build.id, build]));

export default function ScrollWall({ backdrop }: { backdrop?: string }) {
  return (
    <div className={styles.wall} aria-hidden="true">
      {backdrop && (
        <Image className={styles.backdrop} src={backdrop} alt="" fill sizes="100vw" priority={false} />
      )}
      <div className={styles.columns}>
        {COLUMNS.map((ids, column) => {
          const shots = ids.map(id => byId.get(id)!);
          return (
            <div className={styles.column} key={column} data-direction={column % 2 ? "down" : "up"}>
              <div className={styles.track}>
                {[...shots, ...shots].map((build, index) => (
                  <Image
                    key={`${build.id}-${index}`}
                    className={styles.shot}
                    src={build.wall.src}
                    width={build.wall.width}
                    height={build.wall.height}
                    alt=""
                    unoptimized
                    // The first column paints first; the rest wait their turn.
                    loading={column === 0 && index === 0 ? "eager" : "lazy"}
                    fetchPriority={column === 0 && index === 0 ? "high" : "low"}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
      <div className={styles.scrim} />
    </div>
  );
}
