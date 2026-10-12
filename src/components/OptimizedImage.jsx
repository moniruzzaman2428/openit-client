import { memo, useEffect, useState } from 'react';

// Preserve the visible image while showing a small loader only on slow requests.
const OptimizedImage = memo(function OptimizedImage({ src, alt, className = '', fallback }) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    setFailed(false);
    setLoaded(false);
    setShowLoader(false);
  }, [src]);

  useEffect(() => {
    if (!src || loaded || failed) return;
    const timer = setTimeout(() => setShowLoader(true), 450);
    return () => clearTimeout(timer);
  }, [src, loaded, failed]);

  if (!src || failed) return fallback ?? null;

  return (
    <div className="relative h-full w-full overflow-hidden bg-slate-100">
      {!loaded && showLoader && (
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-slate-100/60" role="status" aria-label="Loading photo">
          <span className="h-6 w-6 animate-spin rounded-full border-[3px] border-blue-200 border-t-blue-700" />
        </div>
      )}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        className={className}
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
      />
    </div>
  );
});

export default OptimizedImage;
