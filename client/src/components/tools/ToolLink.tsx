// client/src/components/tools/ToolLink.tsx
import { Link } from "wouter";

interface ToolLinkProps {
  badge: string;
  title: string;
  titleAccent: string;
  description: string;
  tags: string[];
  ctaLabel: string;
  href: string;
  accent: string;
  reverse?: boolean;
  comingSoon?: boolean;
  icon: React.ReactNode;
  imageSrc?: string;
  imagePlaceholderLabel: string;
}

export default function ToolLink({
  badge,
  title,
  titleAccent,
  description,
  tags,
  ctaLabel,
  href,
  accent,
  reverse = false,
  comingSoon = false,
  icon,
  imageSrc,
  imagePlaceholderLabel,
}: ToolLinkProps) {
  const TextBlock = (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div
        style={{
          fontSize: "11px",
          fontWeight: 700,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: accent,
        }}
      >
        {badge}
      </div>

      <h2
        style={{
          fontSize: "clamp(28px, 4vw, 48px)",
          fontWeight: 800,
          lineHeight: 1.05,
          letterSpacing: "-0.03em",
          margin: 0,
        }}
      >
        {title}
        <br />
        <span style={{ color: "#444" }}>{titleAccent}</span>
      </h2>

      <p
        style={{
          fontSize: "15px",
          color: "#555",
          lineHeight: 1.7,
          margin: 0,
          maxWidth: "400px",
        }}
      >
        {description}
      </p>

      {/* Tags */}
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        {tags.map((tag) => (
          <span
            key={tag}
            style={{
              fontSize: "11px",
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#444",
              border: "1px solid #222",
              borderRadius: "100px",
              padding: "4px 12px",
            }}
          >
            {tag}
          </span>
        ))}
      </div>

      {comingSoon ? (
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "10px",
            marginTop: "8px",
            padding: "14px 28px",
            background: "transparent",
            color: "#444",
            fontSize: "12px",
            fontWeight: 800,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            borderRadius: "100px",
            border: "1px solid #222",
            cursor: "not-allowed",
            width: "fit-content",
          }}
        >
          Coming Soon
        </div>
      ) : (
        <Link href={href}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              marginTop: "8px",
              padding: "14px 28px",
              background: "transparent",
              color: accent,
              fontSize: "12px",
              fontWeight: 800,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              borderRadius: "100px",
              border: `1px solid ${accent}`,
              cursor: "pointer",
              transition: "background 0.2s ease, color 0.2s ease",
              width: "fit-content",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = accent;
              (e.currentTarget as HTMLElement).style.color = "#000";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "transparent";
              (e.currentTarget as HTMLElement).style.color = accent;
            }}
          >
            {ctaLabel}
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M2 7h10M8 3l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </Link>
      )}
    </div>
  );

  const ImageBlock = (
    <div
      style={{
        position: "relative",
        aspectRatio: "4/3",
        borderRadius: "16px",
        overflow: "hidden",
        background: "#111",
        border: "1px solid #1a1a1a",
      }}
    >
      {imageSrc && (
        <img
          src={imageSrc}
          alt={imagePlaceholderLabel}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.display = "none";
          }}
        />
      )}
      {/* Fallback placeholder UI */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: -1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "12px",
          background: "linear-gradient(135deg, #0a0a12 0%, #111 100%)",
        }}
      >
        {icon}
        <span
          style={{
            fontSize: "12px",
            color: "#333",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          {imagePlaceholderLabel}
        </span>
      </div>

      {/* Corner accents */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "60px",
          height: "60px",
          borderTop: `2px solid ${accent}`,
          borderLeft: `2px solid ${accent}`,
          borderTopLeftRadius: "16px",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 0,
          right: 0,
          width: "60px",
          height: "60px",
          borderBottom: `2px solid ${accent}`,
          borderRight: `2px solid ${accent}`,
          borderBottomRightRadius: "16px",
          pointerEvents: "none",
        }}
      />
    </div>
  );

  return (
    <div
      style={{
        background: "transparent",
        color: "#fff",
        fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
        padding: "80px 0",
        borderTop: "1px solid #0d0d0d",
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "0 24px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "64px",
          alignItems: "center",
        }}
      >
        {reverse ? (
          <>
            {ImageBlock}
            {TextBlock}
          </>
        ) : (
          <>
            {TextBlock}
            {ImageBlock}
          </>
        )}
      </div>
    </div>
  );
}
