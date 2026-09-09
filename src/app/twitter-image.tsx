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
          fontFamily: "sans-serif",
        }}
      >
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
        <div
          style={{
            fontSize: "18px",
            color: "rgba(255,255,255,0.5)",
            marginTop: "20px",
          }}
        >
          Seven orbits. One gravity. No limits.
        </div>
      </div>
    ),
    { ...size }
  );
}
