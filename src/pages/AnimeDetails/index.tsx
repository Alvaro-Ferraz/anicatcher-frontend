import AnimeRecommendations from "../../components/AnimeRecommendations/index.tsx.tsx";
import AnimeStatistics from "../../components/AnimeStatistics/index.tsx";
import { Link } from "react-router-dom";
import { useAnimeDetail } from "../../components/layout/AnimeDetailLayout/index.tsx";

export const Overview: React.FC = () => {
  const { anime, characters, staff, videos, trailer, recommendations } = useAnimeDetail();

  return (
    <>
      <div className="mt-0">
        <div className="flex-1 p-0 md:p-3 min-w-0">
          <h2 className="text-[13px] font-medium text-[#ADC0D2] mb-2">Characters</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {characters.slice(0, 6).map((char) => (
              <div key={char.character.mal_id} className="bg-[#1e2a3a] flex h-[80px] overflow-hidden">
                <div className="w-[48px] sm:w-[64px] h-full flex-shrink-0">
                  <img src={char.character.images?.jpg?.image_url || "/placeholder.svg"} alt={char.character.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 flex flex-col justify-between text-left pl-2 py-2 min-h-full min-w-0">
                  <Link to={`/character/${char.character.mal_id}`} className="font-semibold text-[#8BA0B2] hover:text-blue-400 text-[11px] sm:text-[13px] leading-tight whitespace-normal max-w-[110px] sm:max-w-full">{char.character.name}
                  </Link>
                  <p className="text-gray-400 text-[10px] sm:text-[11px]">{char.role}</p>
                </div>
                {char.voice_actors?.length > 0 && (
                  <div className="flex h-full flex-shrink-0">
                    <div className="flex flex-col justify-between text-right px-1 sm:px-2 py-2 min-h-full min-w-0">
                      <Link
                        to={`/staff/${char.voice_actors[0].person.mal_id}/${char.voice_actors[0].person.name}`}
                        className="text-gray-300 text-[10px] sm:text-[13px] hover:text-blue-400 leading-tight whitespace-pre-line break-words max-w-[90px] sm:max-w-full"
                      >
                        {char.voice_actors[0].person.name.split(',').join(',\n')}
                      </Link>
                      <p className="text-gray-400 text-[9px] sm:text-[11px]">{char.voice_actors[0].language}</p>
                    </div>
                    <div className="w-[48px] sm:w-[64px] h-full flex-shrink-0">
                      <img src={char.voice_actors[0].person.images.jpg.image_url || "/placeholder.svg"} alt={char.voice_actors[0].person.name} className="w-full h-full object-cover" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <h2 className="text-[13px] font-medium text-[#ADC0D2] mb-2 mt-4">Staff</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {staff.slice(0, 3).map((member) => (
              <div key={member.person.mal_id} className="bg-[#1e2a3a] flex h-[80px] overflow-hidden">
                <div className="w-[48px] sm:w-[64px] h-full flex-shrink-0">
                  <img src={member.person.images?.jpg?.image_url || "/placeholder.svg"} alt={member.person.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 flex flex-col justify-between px-2 py-2 text-sm text-white min-w-0">
                  <p className="font-semibold text-gray-300 text-[11px] sm:text-[13px] leading-tight truncate">{member.person.name}</p>
                  <p className="text-gray-400 text-[10px] sm:text-[11px] truncate">{member.positions.join(", ")}</p>
                </div>
              </div>
            ))}
          </div>

          {videos && videos.length > 0 && (
            <div className="mt-8">
              <h2 className="text-[13px] font-medium text-[#ADC0D2] mb-2">Watch</h2>
              <div className="flex gap-4 flex-wrap">
                {videos.slice(-4).map((video) => (
                  <a key={video.url} href={video.url} target="_blank" rel="noopener noreferrer" className="relative w-[200px] h-[100px] rounded overflow-hidden group">
                    <img src={video.images?.jpg?.image_url} alt={video.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-2 py-1">
                      <p className="text-[12px] font-medium text-[#c4d9ec] truncate">{video.episode} - {video.title}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          {trailer && trailer.embed_url && (
            <div className="mt-8">
              <h2 className="text-[13px] font-medium text-[#ADC0D2] mb-2">Trailer</h2>
              <div className="relative w-full max-w-[350px] aspect-video rounded overflow-hidden group">
                <iframe className="w-full h-full" src={trailer.embed_url} title="Trailer do Anime" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
              </div>
            </div>
          )}

          {anime && <AnimeStatistics id={Number(anime.mal_id)} />}

          {recommendations.length > 0 && (
            <AnimeRecommendations recommendations={recommendations} />
          )}
        </div>
      </div>
    </>
  );
};
