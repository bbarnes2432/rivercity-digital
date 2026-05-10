import { ImageResponse } from "next/og";

export const alt = "River City Digital Co. — A St. Louis digital studio building websites and search visibility for local businesses.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const CREAM = "#F6F2EA";
const NAVY = "#1E3A5F";
const NAVY_INK = "#152A46";
const TEAL = "#4CA5AD";
const INK_DIM = "rgba(30, 58, 95, 0.62)";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: CREAM,
          display: "flex",
          flexDirection: "column",
          padding: "64px 80px",
          fontFamily: "sans-serif",
          color: NAVY_INK,
          position: "relative",
        }}
      >
        {/* Top bar: studio mark + filed-from */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                width: 14,
                height: 14,
                borderRadius: 999,
                background: TEAL,
              }}
            />
            <div
              style={{
                fontSize: 22,
                fontWeight: 700,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: NAVY,
              }}
            >
              River City Digital Co.
            </div>
          </div>
          <div
            style={{
              fontSize: 18,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: INK_DIM,
              fontFamily: "monospace",
            }}
          >
            Filed from St. Louis · 2026
          </div>
        </div>

        {/* Hairline rule */}
        <div
          style={{
            width: "100%",
            height: 1,
            background: NAVY,
            opacity: 0.18,
            marginTop: 28,
            marginBottom: 64,
          }}
        />

        {/* Main display */}
        <div style={{ display: "flex", flexDirection: "column", flex: 1, justifyContent: "center" }}>
          <div
            style={{
              fontSize: 132,
              lineHeight: 0.96,
              fontWeight: 800,
              letterSpacing: "-0.01em",
              color: NAVY,
              textTransform: "uppercase",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <span>Local Roots.</span>
            <span style={{ fontStyle: "italic", fontWeight: 600 }}>
              Built to be found.
            </span>
          </div>
          <div
            style={{
              marginTop: 28,
              fontSize: 30,
              lineHeight: 1.4,
              color: INK_DIM,
              maxWidth: 880,
            }}
          >
            A St. Louis digital studio. Websites, local SEO, and AI search visibility — personally handled, here.
          </div>
        </div>

        {/* Bottom strip: services + accent */}
        <div
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 56,
            paddingTop: 24,
            borderTop: `1px solid ${NAVY}1f`,
          }}
        >
          <div
            style={{
              display: "flex",
              gap: 20,
              fontFamily: "monospace",
              fontSize: 18,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: NAVY,
            }}
          >
            <span>AI Search</span>
            <span style={{ color: INK_DIM }}>·</span>
            <span>Local SEO</span>
            <span style={{ color: INK_DIM }}>·</span>
            <span>Website Design</span>
            <span style={{ color: INK_DIM }}>·</span>
            <span>Digital Marketing</span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              fontSize: 20,
              fontWeight: 700,
              color: TEAL,
              letterSpacing: "0.04em",
            }}
          >
            rivercitydigitalco.com
            <span
              style={{
                display: "block",
                width: 28,
                height: 2,
                background: TEAL,
              }}
            />
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
