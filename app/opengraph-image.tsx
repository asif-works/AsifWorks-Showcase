import { ImageResponse } from "next/og";

export const alt = "AsifWorks — Digital experiences made impossible to ignore.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "56px 64px",
          background: "radial-gradient(circle at 78% 30%, #3d4dff 0%, #14164a 28%, #08080a 62%)",
          color: "#ece7dd",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 20, letterSpacing: 4, opacity: 0.7 }}>
          <span>ASIFWORKS</span>
          <span>DOHA / WORLDWIDE</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 104, fontWeight: 800, lineHeight: 0.9, letterSpacing: -5 }}>
          <span>DIGITAL EXPERIENCES</span>
          <span>MADE IMPOSSIBLE</span>
          <span style={{ color: "#8a96ff" }}>TO IGNORE.</span>
        </div>
        <div style={{ display: "flex", fontSize: 20, letterSpacing: 3, opacity: 0.6 }}>INDEPENDENT DIGITAL STUDIO</div>
      </div>
    ),
    size,
  );
}
