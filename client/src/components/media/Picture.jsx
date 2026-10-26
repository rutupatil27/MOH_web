/**
 * Responsive image from a processed media record ({ width, height, placeholder, variants }).
 * Dimensions are always reserved; below-the-fold images lazy-load over a blurred placeholder.
 */
export function Picture({ media, alt, sizes = "100vw", priority = false, className = "", imgClassName = "", fit = "cover", aspectRatio, placeholder = true }) {
  if (!media?.variants?.length) return null;
  const variants = [...media.variants].sort((a, b) => a.width - b.width);
  const largest = variants[variants.length - 1];
  const fallback = variants.find((v) => v.width >= 960) ?? largest;

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{
        aspectRatio: aspectRatio ?? `${media.width} / ${media.height}`,
        backgroundImage: placeholder && media.placeholder ? `url("${media.placeholder}")` : undefined,
        backgroundSize: fit === "cover" ? "cover" : "contain",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}
    >
      <img
        src={fallback.url}
        srcSet={variants.map((v) => `${v.url} ${v.width}w`).join(", ")}
        sizes={sizes}
        width={media.width}
        height={media.height}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        decoding={priority ? "sync" : "async"}
        fetchPriority={priority ? "high" : undefined}
        className={`absolute inset-0 h-full w-full ${fit === "cover" ? "object-cover" : "object-contain"} ${imgClassName}`}
      />
    </div>
  );
}

export function largestUrl(media) {
  if (!media?.variants?.length) return null;
  return [...media.variants].sort((a, b) => b.width - a.width)[0].url;
}
