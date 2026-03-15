import React from 'react';
import AnimeCardSkeleton from '../skeletons/AnimeCardSkeleton';
import { mockRecentEpisodes, type RecentEpisode } from './mock';

type Props = {
  episodes?: RecentEpisode[];
  isLoading?: boolean;
  showViewAll?: boolean;
  viewAllLink?: string;
};

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const past = new Date(dateStr).getTime();
  const diffMs = now - past;

  const minutes = Math.floor(diffMs / 60_000);
  if (minutes < 1) return 'agora';
  if (minutes < 60) return `${minutes} min atrás`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h atrás`;

  const days = Math.floor(hours / 24);
  return `${days}d atrás`;
}

const RecentEpisodesShowcase: React.FC<Props> = ({
  episodes = mockRecentEpisodes,
  isLoading = false,
  showViewAll = true,
  viewAllLink = '#',
}) => {
  return (
    <section className="px-5 sm:px-5">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <span className="w-1 h-6 bg-[#ADC0D2] rounded-sm" />
          <h2 className="text-2xl font-sans font-bold text-[#ADC0D2]">
            Episódios Recentes
          </h2>
        </div>
        {showViewAll && (
          <a href={viewAllLink} className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
            View All
          </a>
        )}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
        {isLoading ? (
          <AnimeCardSkeleton items={8} />
        ) : (
          episodes.map((ep) => (
            <a
              key={ep.id}
              href={`/anime/${ep.animeId}`}
              className="group relative overflow-hidden transition-transform duration-300 hover:scale-105"
            >
              {/* Image */}
              <div className="relative w-full aspect-[3/4] overflow-hidden rounded">
                <img
                  src={ep.imageUrl}
                  alt={`${ep.animeTitle} - Episódio ${ep.episodeNumber}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />

                {/* EP Badge */}
                <span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs font-bold px-2 py-0.5 rounded">
                  EP {ep.episodeNumber}
                </span>
              </div>

              {/* Info */}
              <div className="mt-2">
                <p className="text-[#8BA0B2] font-sans text-sm font-semibold leading-tight overflow-hidden break-words line-clamp-1">
                  {ep.animeTitle}
                </p>
                <p className="text-[#5C7080] font-sans text-xs mt-0.5">
                  {timeAgo(ep.airedAt)}
                </p>
              </div>
            </a>
          ))
        )}
      </div>
    </section>
  );
};

export default RecentEpisodesShowcase;
