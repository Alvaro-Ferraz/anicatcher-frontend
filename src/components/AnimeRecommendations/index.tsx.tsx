import { useState, useEffect } from "react"

interface Recommendation {
  entry: {
    mal_id: number
    title: string
    images?: {
      webp?: {
        large_image_url?: string
      }
    }
    url: string
  }
  votes: number
}

interface Props {
  recommendations: Recommendation[]
}

export default function AnimeRecommendations({ recommendations }: Props) {
  const [showAll, setShowAll] = useState(false)
  const columns = 6
  const rows = 1
  const initialCards = rows * columns

  const displayedRecommendations = showAll ? recommendations : recommendations.slice(0, initialCards)

  useEffect(() => {
    const handleResize = () => {
      setTimeout(() => { }, 0);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <section className="mt-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-[15px] font-medium text-[#ADC0D2]">Recommendations</h2>
        {recommendations.length > initialCards && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-sm text-blue-400 hover:underline"
          >
            {showAll ? "View Less" : "View All"}
          </button>
        )}
      </div>

      <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 relative z-0 ${showAll ? 'auto-rows-auto' : ''}`}>
        {displayedRecommendations.map((rec) => (
          <div
            key={rec.entry.mal_id}
            className="relative overflow-hidden transition-transform duration-300 hover:scale-105 z-0"
          >
            <a
              href={`/anime/${rec.entry.mal_id}`}
              className="block w-full aspect-[3/4] overflow-hidden rounded"
            >
              <img
                src={rec.entry.images?.webp?.large_image_url || 'https://via.placeholder.com/150'}
                alt={rec.entry.title}
                className="w-full h-full object-cover"
              />
            </a>
            <a
              href={`/anime/${rec.entry.mal_id}`}
              className="block mt-2 text-[#8BA0B2] font-sans text-1xl font-semibold leading-[21px] overflow-hidden break-words"
            >
              {rec.entry.title}
            </a>
          </div>
        ))}
      </div>
    </section>
  )
}
