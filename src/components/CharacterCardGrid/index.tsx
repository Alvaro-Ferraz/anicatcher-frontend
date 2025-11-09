import React from 'react';
import AnimeCardSkeleton from '../skeletons/AnimeCardSkeleton';

type Character = {
  character: {
    mal_id: number;
    name: string;
    images?: { jpg?: { image_url?: string; small_image_url?: string } };
  };
  role?: string;
  anime?: {
    mal_id: number;
    title: string;
    images?: { jpg?: { image_url?: string; small_image_url?: string; large_image_url?: string } };
  };
};

const CharacterCardGrid: React.FC<{
  title?: string;
  characters?: Character[];
  columns?: number;
  rows?: number;
  isLoading?: boolean;
  isLoadingMore?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
}> = ({
  title = '',
  characters = [],
  columns = 5,
  rows,
  isLoading = false,
  isLoadingMore = false,
  hasMore = false,
  onLoadMore
}) => {
  const gridRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!hasMore || !onLoadMore) return;

    const options = {
      root: null,
      rootMargin: '100px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      const [entry] = entries;
      if (entry.isIntersecting && !isLoadingMore) {
        onLoadMore();
      }
    }, options);

    const gridElement = gridRef.current;
    if (gridElement) {
      const items = gridElement.querySelectorAll('.character-card');
      const lastItem = items[items.length - 1];
      if (lastItem) {
        observer.observe(lastItem);
      }
    }

    return () => observer.disconnect();
  }, [hasMore, onLoadMore, isLoadingMore, characters.length]);
  const hasRows = typeof rows === 'number' && rows > 0;
  const fixedSlots = hasRows ? rows! * columns : undefined;

  const unique = React.useMemo(() => {
    const seen = new Set<string>();
    return characters.filter((c) => {
      const key = `${c.character?.mal_id}-${c.anime?.mal_id || 0}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [characters]);

  const nonLoadingCount = fixedSlots ?? unique.length;
  const skeletonCount = fixedSlots ?? Math.max(columns * 2, 8);
  const displayed = unique.slice(0, nonLoadingCount);

  const responsiveGridClass = 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4';

  return (
    <section>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-sans font-semibold px-5 sm:px-5 text-[#ADC0D2]">{title}</h2>
      </div>

      <div ref={gridRef} className={responsiveGridClass + ' relative z-0 px-5 sm:p-5 overflow-hidden'}>
        {isLoading ? (
          <AnimeCardSkeleton items={skeletonCount} />
        ) : (
          [...Array(nonLoadingCount)].map((_, index) => {
            const ch = displayed[index];
            if (!ch) {
              return (
                <div key={`empty-${index}`} className="relative overflow-hidden transition-transform duration-300 z-0">
                  <div className="block w-full aspect-[3/4] overflow-hidden bg-gray-800 rounded">
                    <div className="w-full h-full flex items-center justify-center text-gray-500">No Data</div>
                  </div>
                  <div className="mt-2 h-6 w-3/4 bg-gray-800 rounded" />
                </div>
              );
            }

            const charImg = ch.character?.images?.jpg?.small_image_url || ch.character?.images?.jpg?.image_url || 'https://via.placeholder.com/150';
            const animePoster = ch.anime?.images?.jpg?.large_image_url || ch.anime?.images?.jpg?.image_url || null;

            return (
              <div key={`${ch.character?.mal_id}-${ch.anime?.mal_id || 0}-${index}`} className="character-card relative overflow-hidden transition-transform duration-300 hover:scale-105 z-0">
                <div className="relative">
                  <a href={`/character/${ch.character?.mal_id}`} className="block w-full aspect-[3/4] overflow-hidden rounded bg-[#1e2a3a]">
                    <img src={charImg} alt={ch.character?.name} className="w-full h-full object-cover" />
                  </a>

                  {animePoster && (
                    <a href={`/anime/${ch.anime?.mal_id}`} className="absolute right-0 bottom-0 w-[65px] h-[85px] overflow-hidden border border-gray-800 shadow-lg z-10">
                      <img src={animePoster} alt={ch.anime?.title} className="w-full h-full object-cover" />
                    </a>
                  )}
                </div>

                <div className='flex flex-col'>
                  <div className="flex items-center gap-1 mt-2">
                    <a href={`/character/${ch.character?.mal_id}`} className="text-[#8BA0B2] font-sans text-1xl font-semibold leading-[21px] overflow-hidden break-words">
                      {ch.character?.name}
                    </a>
                    {ch.role && <p className="text-gray-500 text-xs truncate">{ch.role}</p>}
                  </div>
                  {ch.anime && (
                    <div className="mt-1">
                      <a href={`/anime/${ch.anime.mal_id}`} className="text-gray-400 text-sm">
                        {ch.anime.title}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {isLoading && (
        <div className="flex justify-center my-6">
          <span className="text-blue-400 animate-pulse">Procurando...</span>
        </div>
      )}

      {(hasMore || isLoadingMore) && !isLoading && (
        <div className={responsiveGridClass + ' mt-4'}>
          {[...Array(6)].map((_, index) => (
            <div key={`skeleton-${index}`} className="animate-pulse">
              <div className="relative">
                <div className="block w-full aspect-[3/4] bg-gray-700 rounded"></div>
                <div className="absolute right-0 bottom-0 w-[65px] h-[85px] bg-gray-600 border border-gray-800"></div>
              </div>
              <div className="mt-2 h-4 bg-gray-700 rounded w-3/4"></div>
              <div className="mt-1 h-3 bg-gray-700 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default CharacterCardGrid;
