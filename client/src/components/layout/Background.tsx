export function Background() {
  return (
    <div
      className="fixed inset-0 -z-50 pointer-events-none"
      style={{
        backgroundImage: "url(/black_gold_brick_texture.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        opacity: 0.15,
      }}
    />
  );
}
