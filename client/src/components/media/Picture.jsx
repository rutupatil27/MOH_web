/**
 * Responsive image from a processed media record ({ width, height, placeholder, variants }).
 * Dimensions are always reserved; below-the-fold images lazy-load over a blurred placeholder.
 */
export function Picture({ media, alt, sizes = "100vw", priority = false, className = "", imgClassName = "", fit = "cover", aspectRatio, placeholder = true }) {
  if (!media?.variants?.length) return null;
  const variants = [...media.variants].sort((a, b) => a.width - b.width);
  if (fit === "cover") sizes = coverSizes(sizes, media, aspectRatio);
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

/**
 * `sizes` describes the box width, but a photo cropped to fill a narrower box (a wide photo
 * in a square tile) is drawn wider than the box. Scale each size by that overflow so the
 * browser picks a file with enough pixels for the cropped height instead of stretching it.
 */
function coverSizes(sizes, media, aspectRatio) {
  const match = /^\s*([\d.]+)\s*\/\s*([\d.]+)\s*$/.exec(aspectRatio ?? "");
  if (!match || !media.width || !media.height) return sizes;
  const overflow = media.width / media.height / (Number(match[1]) / Number(match[2]));
  if (overflow <= 1.05) return sizes;
  const factor = Math.round(overflow * 100) / 100;
  return sizes
    .split(",")
    .map((entry) => entry.trim().replace(/(\S+)$/, (length) => `calc(${length} * ${factor})`))
    .join(", ");
}

export function largestUrl(media) {
  if (!media?.variants?.length) return null;
  return [...media.variants].sort((a, b) => b.width - a.width)[0].url;
}
