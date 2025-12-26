import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

type Props = {
  animes: any[];
  isLoading?: boolean;
  intervalMs?: number;
};

const HeroCarousel: React.FC<Props> = ({ animes, isLoading = false, intervalMs = 5000 }) => {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const navigate = useNavigate();
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (isLoading || animes.length === 0) return;
    if (paused) return;

    intervalRef.current = window.setInterval(() => {
      setIndex((i) => (i + 1) % animes.length);
    }, intervalMs);

    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
      }
    };
  }, [animes, paused, isLoading, intervalMs]);

  useEffect(() => {
    if (index >= animes.length && animes.length > 0) {
      setIndex(0);
    }
  }, [animes.length, index]);

  const current = animes[index] || null;

  const shortText = (s: string | undefined, max = 180) => {
    if (!s) return '';
    return s.length > max ? s.slice(0, max).trim() + '…' : s;
  };

  return (
    <div className="w-full h-[420px] rounded-lg overflow-hidden relative">
      {isLoading ? (
        <div className="w-full h-full bg-gray-700 animate-pulse" />
      ) : animes.length === 0 ? (
        <div className="w-full h-full flex items-center justify-center text-gray-400">Dados indisponíveis no momento.</div>
      ) : (
        <>
          <div
            className="w-full h-full"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            <img
              src={current?.images?.jpg?.large_image_url || current?.images?.jpg?.image_url || 'https://via.placeholder.com/1200x420'}
              alt={current?.title || 'Destaque'}
              className="w-full h-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent" />

            <div className="absolute left-6 bottom-6 text-white max-w-3xl">
              <h2 className="text-3xl font-bold leading-tight">{current?.title}</h2>
              <p className="mt-2 text-sm text-white/90">{shortText(current?.synopsis)}</p>

              <div className="mt-4 flex items-center space-x-3">
                <button
                  onClick={() => navigate(`/anime/${current?.mal_id || current?.id}`)}
                  className="px-4 py-2 bg-[#bfe7ff] text-[#0d121d] rounded-md font-medium"
                >
                  Ver detalhes
                </button>
                {current?.trailer?.url && (
                  <a
                    href={current.trailer.url}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 border border-white/30 text-white rounded-md"
                  >
                    Trailer
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Arrows */}
          <button
            aria-label="Previous"
            onClick={() => setIndex((i) => (i - 1 + animes.length) % animes.length)}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full"
          >
            ‹
          </button>
          <button
            aria-label="Next"
            onClick={() => setIndex((i) => (i + 1) % animes.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full"
          >
            ›
          </button>

          {/* Indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center space-x-2">
            {animes.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                aria-current={i === index}
                className={`w-3 h-3 rounded-full ${i === index ? 'bg-white' : 'bg-white/40'}`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default HeroCarousel;
