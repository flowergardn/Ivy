"use client";

import { useQRCode } from "next-qrcode";

export default function QRCode(props: { url: string }) {
  const { Canvas } = useQRCode();

  return (
    <Canvas
      text={props.url}
      options={{
        type: "image/jpeg",
        quality: 0.1,
        errorCorrectionLevel: "M",
        margin: 3,
        scale: 4,
        width: 200,
        color: {
          dark: "#000",
          light: "#fff",
        },
      }}
    />
  );
}
