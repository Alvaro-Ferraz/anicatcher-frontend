import React from 'react';
import AnimeCardSkeleton from '../skeletons/AnimeCardSkeleton';

type Anime = {
  mal_id: number;
  title: string;
  images?: {
    jpg?: {
      large_image_url?: string;
    };
  };
};

const AnimeCardGrid: React.FC<{
  title?: string;
  animes?: Anime[];
  columns?: number;
  rows?: number;
  showViewAll?: boolean;
  viewAllLink?: string;
  isLoading?: boolean;
}> = ({
  title = '',
  animes = [],
  columns = 5,
  rows,
  showViewAll = true,
  viewAllLink = '#',
  isLoading = false,
}) => {
  const hasRows = typeof rows === 'number' && rows > 0;
  const fixedSlots = hasRows ? rows! * columns : undefined;
  
  const uniqueAnimes = React.useMemo(() => {
    const seen = new Set<number>();
    return animes.filter(anime => {
      if (seen.has(anime.mal_id)) return false;
      seen.add(anime.mal_id);
      return true;
    });
  }, [animes]);

  const nonLoadingCount = fixedSlots ?? uniqueAnimes.length;

  const skeletonCount = fixedSlots ?? Math.max(columns * 2, 12);

  const displayedAnimes = uniqueAnimes.slice(0, nonLoadingCount);

  const responsiveGridClass =
    'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4';

  return (
    <section>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-sans px-5 sm:px-5 text-[#ADC0D2]">{title}</h2>
        {showViewAll && (
          <a href={viewAllLink} className="text-sm px-5 sm:px-5 text-blue-400">
            View All
          </a>
        )}
      </div>

      <div className={responsiveGridClass + " relative z-0 px-5 sm:p-5 overflow-hidden"}>
        {isLoading ? (
          <AnimeCardSkeleton items={skeletonCount} />
        ) : (
          [...Array(nonLoadingCount)].map((_, index) => {
            const anime = displayedAnimes[index];
            if (!anime) {
              return (
                <div
                  key={`empty-${index}`}
                  className="relative overflow-hidden transition-transform duration-300 z-0"
                >
                  <div className="block w-full aspect-[3/4] overflow-hidden bg-gray-800 rounded">
                    <div className="w-full h-full flex items-center justify-center text-gray-500">
                      No Data
                    </div>
                  </div>
                  <div className="mt-2 h-6 w-3/4 bg-gray-800 rounded" />
                </div>
              );
            }
            return (
              <div
                key={`${anime.mal_id}-${index}`}
                className="relative overflow-hidden transition-transform duration-300 hover:scale-105 z-0"
              >
                <a
                  href={`/anime/${anime.mal_id}`}
                  className="block w-full aspect-[3/4] overflow-hidden"
                >
                  <img
                    src={anime.images?.jpg?.large_image_url || 'https://via.placeholder.com/150'}
                    alt={anime.title}
                    className="w-full h-full object-cover"
                  />
                </a>
                <a
                  href={`/anime/${anime.mal_id}`}
                  className="block mt-2 text-[#8BA0B2] font-sans text-1xl font-semibold leading-[21px] overflow-hidden break-words"
                >
                  {anime.title}
                </a>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
};

export default AnimeCardGrid;
