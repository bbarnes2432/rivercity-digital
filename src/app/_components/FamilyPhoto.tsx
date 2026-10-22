import Image from "next/image";

export default function FamilyPhoto({ compact = false }: { compact?: boolean }) {
  return <figure className="fx-reveal" style={{ margin: compact ? "0 auto 28px" : 0, width: "100%", maxWidth: compact ? 420 : undefined }}>
    <Image src="/assets/river-city-family.webp" alt="The family behind River City Digital" width={1200} height={1200} sizes={compact ? "(max-width: 480px) 90vw, 420px" : "(max-width: 980px) 90vw, 520px"} style={{ display: "block", width: "100%", height: "auto", aspectRatio: "4 / 3", objectFit: "cover", objectPosition: "50% 40%", borderRadius: 4 }} />
    <figcaption style={{ marginTop: 12, fontSize: 13, lineHeight: 1.5, opacity: .85 }}>The family behind River City Digital.</figcaption>
  </figure>;
}
