import React from 'react';
import AnimeCardSkeleton from '../skeletons/AnimeCardSkeleton';

type Staff = {
  person: {
    mal_id: number;
    name: string;
    images?: { jpg?: { image_url?: string; small_image_url?: string } };
  };
  role?: string;
  language?: string;
  anime?: {
    mal_id: number;
    title: string;
    images?: { jpg?: { large_image_url?: string; image_url?: string } };
  };
};

const StaffCardGrid: React.FC<{
  title?: string;
  staffs?: Staff[];
  columns?: number;
  rows?: number;
  isLoading?: boolean;
}> = ({
  title = '',
  staffs = [],
  columns = 5,
  rows,
  isLoading = false,
}) => {
  const hasRows = typeof rows === 'number' && rows > 0;
  const fixedSlots = hasRows ? rows! * columns : undefined;

  const unique = React.useMemo(() => {
    const seen = new Set<number>();
    return staffs.filter((s) => {
      const id = s.person?.mal_id;
      if (!id) return false;
      if (seen.has(id)) return false;
      seen.add(id);
      return true;
    });
  }, [staffs]);

  const nonLoadingCount = fixedSlots ?? unique.length;
  const skeletonCount = fixedSlots ?? Math.max(columns * 2, 6);
  const displayed = unique.slice(0, nonLoadingCount);

  const responsiveGridClass = 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4';

  return (
    <section>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-sans font-semibold px-5 sm:px-5 text-[#ADC0D2]">{title}</h2>
      </div>

      <div className={responsiveGridClass + ' relative z-0 px-5 sm:p-5 overflow-hidden'}>
        {isLoading ? (
          <AnimeCardSkeleton items={skeletonCount} />
        ) : (
          [...Array(nonLoadingCount)].map((_, index) => {
            const s = displayed[index];
            if (!s) {
              return (
                <div key={`empty-${index}`} className="relative overflow-hidden transition-transform duration-300 z-0">
                  <div className="block w-full aspect-[3/4] overflow-hidden bg-gray-800 rounded">
                    <div className="w-full h-full flex items-center justify-center text-gray-500">No Data</div>
                  </div>
                  <div className="mt-2 h-6 w-3/4 bg-gray-800 rounded" />
                </div>
              );
            }

            const img = s.person?.images?.jpg?.image_url || s.person?.images?.jpg?.small_image_url || 'https://via.placeholder.com/150';

            return (
              <div key={`${s.person.mal_id}-${index}`} className="relative overflow-hidden transition-transform duration-300 hover:scale-105 z-0">
                <a href={`/staff/${s.person.mal_id}/${encodeURIComponent(s.person.name)}`} className="block w-full aspect-[3/4] overflow-hidden rounded bg-[#1e2a3a]">
                  <img src={img} alt={s.person.name} className="w-full h-full object-cover" />
                </a>

                <a href={`/staff/${s.person.mal_id}/${encodeURIComponent(s.person.name)}`} className="block mt-2 text-[#8BA0B2] font-sans text-1xl font-semibold leading-[21px] overflow-hidden break-words">
                  {s.person.name}
                </a>
                {(s.role || s.language) && <p className="text-gray-400 text-xs mt-1 truncate">{s.role || s.language}</p>}
              </div>
            );
          })
        )}
      </div>
    </section>
  );
};

export default StaffCardGrid;
