
import { memo, useState } from 'react';

const OptimizedImage = memo(({ src, alt, className, fallback }) => {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  if (!src || failed) return fallback;

  return (
    <div className="relative h-full w-full overflow-hidden">
      {!loaded && (
        <div className="absolute inset-0 animate-pulse bg-slate-200" />
      )}

      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        fetchPriority="low"
        className={`${className} transition-opacity duration-200 ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
      />
    </div>
  );
});

export default OptimizedImage;
