import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "UNDIMENSION — Circle Beyond Space & Time";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#09090b",
          backgroundImage:
            "radial-gradient(circle at 20% 50%, rgba(255,77,77,0.15) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(0,229,255,0.15) 0%, transparent 50%)",
          fontFamily: "sans-serif",
        }}
      >
        {/* Decorative top bar */}
        <div
          style={{
            display: "flex",
            gap: "8px",
            marginBottom: "40px",
          }}
        >
          <div style={{ width: "60px", height: "4px", backgroundColor: "#ff4d4d" }} />
          <div style={{ width: "40px", height: "4px", backgroundColor: "#00e5ff" }} />
          <div style={{ width: "20px", height: "4px", backgroundColor: "#d4ff00" }} />
        </div>

        {/* Main title */}
        <div
          style={{
            fontSize: "120px",
            fontWeight: 900,
            color: "#ffffff",
            letterSpacing: "0.05em",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            lineHeight: 1,
          }}
        >
          <span style={{ fontSize: "28px", color: "#d4ff00", letterSpacing: "0.3em", marginBottom: "20px" }}>
            EST. 2020
          </span>
          <span>UNDIMENSION</span>
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: "28px",
            color: "#00e5ff",
            marginTop: "30px",
            letterSpacing: "0.1em",
          }}
        >
          Circle Beyond Space &amp; Time
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: "18px",
            color: "rgba(255,255,255,0.5)",
            marginTop: "20px",
            letterSpacing: "0.05em",
          }}
        >
          Seven orbits. One gravity. No limits.
        </div>

        {/* Decorative bottom bar */}
        <div
          style={{
            display: "flex",
            gap: "8px",
            marginTop: "40px",
          }}
        >
          <div style={{ width: "20px", height: "4px", backgroundColor: "#d4ff00" }} />
          <div style={{ width: "40px", height: "4px", backgroundColor: "#00e5ff" }} />
          <div style={{ width: "60px", height: "4px", backgroundColor: "#ff4d4d" }} />
        </div>
      </div>
    ),
    { ...size }
  );
}
