import React, { createContext, useContext, useEffect, useState } from 'react';
import { useParams, useLocation, Link, Outlet } from 'react-router-dom';
import axios from 'axios';
import { Anime, Episode, Trailer } from '../../../pages/AnimeDetails/interface';
import ClientLayout from '../ClientLayout';

const delay = (ms: number | undefined) => new Promise((resolve) => setTimeout(resolve, ms));

type ContextType = {
    anime: Anime | null;
    characters: any[];
    staff: any[];
    videos: Episode[];
    trailer: Trailer | null;
    isLoading: boolean;
    error: string | null;
    recommendations: any[];
};

const AnimeDetailContext = createContext<ContextType | undefined>(undefined);

export const useAnimeDetail = () => {
    const ctx = useContext(AnimeDetailContext);
    if (!ctx) throw new Error('useAnimeDetail must be used within AnimeDetailLayout');
    return ctx;
};

const AnimeDetailLayout: React.FC<React.PropsWithChildren<{}>> = ({ }) => {
    const { id } = useParams();
    const location = useLocation();

    const [anime, setAnime] = useState<Anime | null>(null);
    console.log(anime);
    const [characters, setCharacters] = useState<any[]>([]);
    const [staff, setStaff] = useState<any[]>([]);
    const [videos, setVideos] = useState<Episode[]>([]);
    const [trailer, setTrailer] = useState<Trailer | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [recommendations, setRecommendations] = useState([]);

    useEffect(() => {
        let isMounted = true;
        const fetchAnimeDetails = async () => {
            try {
                setIsLoading(true);
                while (isMounted) {
                    try {
                        const [animeRes, charactersRes, staffRes, videosRes, recommendationsRes] = await Promise.all([
                            axios.get(`https://api.jikan.moe/v4/anime/${id}/full`, { timeout: 5000 }),
                            axios.get(`https://api.jikan.moe/v4/anime/${id}/characters`, { timeout: 5000 }),
                            axios.get(`https://api.jikan.moe/v4/anime/${id}/staff`, { timeout: 5000 }),
                            axios.get(`https://api.jikan.moe/v4/anime/${id}/videos`, { timeout: 5000 }),
                            axios.get(`https://api.jikan.moe/v4/anime/${id}/recommendations`, { timeout: 5000 }),
                        ]);

                        const animeData = animeRes.data.data;
                        const videosData = videosRes.data.data;

                        if (!isMounted) return;
                        setAnime(animeData);
                        setCharacters(charactersRes.data.data);
                        setStaff(staffRes.data.data);
                        setVideos(videosData.episodes || []);
                        setTrailer(animeData.trailer || null);
                        setRecommendations(recommendationsRes.data.data);
                        setIsLoading(false);
                        setError(null);
                        break;
                    } catch (err: any) {
                        if (err.response?.status === 429) {
                            await delay(5000);
                            continue;
                        }
                        if (!isMounted) return;
                        setError('Não foi possível carregar os detalhes do anime.');
                        setIsLoading(false);
                        break;
                    }
                }
            } finally {
            }
        };
        fetchAnimeDetails();
        return () => { isMounted = false; };
    }, [id]);

    if (isLoading) return <ClientLayout><div className="text-center text-gray-400 mt-10">Carregando...</div></ClientLayout>;
    if (error) return <ClientLayout><div className="text-center text-red-400 mt-10">{error}</div></ClientLayout>;
    if (!anime) return <ClientLayout><div className="text-center text-gray-400 mt-10">Anime não encontrado.</div></ClientLayout>;

    return (
        <AnimeDetailContext.Provider value={{ anime, characters, staff, videos, trailer, isLoading, error, recommendations }}>
            <ClientLayout>
                <div className="mt-16 mb-4 md:mt-20 w-full px-2 sm:px-4">
                    <div className="mt-2 flex flex-col md:flex-row gap-6 w-full">
                        <div className="flex-shrink-0 flex flex-col items-center md:block">
                            <img
                                src={anime.images?.jpg?.large_image_url || 'https://via.placeholder.com/200x300'}
                                alt={anime.title}
                                className="w-[180px] h-[260px] md:w-[250px] md:h-[370px] rounded"
                            />
                            <div className="mt-2 flex gap-2 w-[180px] md:w-[250px]">
                                <button className="flex items-center justify-center flex-1 bg-blue-500 text-white h-8 rounded-lg hover:bg-blue-600 transition-colors text-xs font-medium">Add to List</button>
                                <button className="flex items-center justify-center w-8 h-8 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">❤</button>
                            </div>
                        </div>

                        <div className="flex-1 w-full text-center md:text-left">
                            <h1 className="text-2xl md:text-2xl font-medium text-[#9bb5cc] mb-2">{anime.title}</h1>
                            <p className="text-sm text-gray-500 mb-4">{anime.year || 'Ano desconhecido'} • {anime.genres?.map((g: any) => g.name).join(', ') || 'Gêneros desconhecidos'} • {anime.episodes || 'N/A'} episódios</p>
                            <p className="text-gray-400 hover:text-gray-300 md:text-left">{anime.synopsis || 'Sinopse não disponível.'}</p>
                        </div>
                    </div>

                    <div className="flex w-full min-w-0">
                        <div className="flex-1 p-0 md:p-0 min-w-0">
                            <div className="mt-6 border-b border-gray-700 w-full overflow-x-auto">
                                <div className="flex gap-2 sm:gap-4 md:gap-8 border-gray-700 justify-start sm:justify-center w-full">
                                    <Link to={`/anime/${id}`} className={`pb-2 whitespace-nowrap ${location.pathname === `/anime/${id}` ? 'text-white border-b-2 border-blue-500' : 'text-gray-400 hover:text-white'}`}>
                                        Overview
                                    </Link>
                                    <button disabled className="pb-2 text-gray-400 line-through whitespace-nowrap">Watch</button>
                                    <Link to={`/anime/${id}/characters`} className={`pb-2 whitespace-nowrap ${location.pathname.includes('/characters') ? 'text-white border-b-2 border-blue-500' : 'text-gray-400 hover:text-white'}`}>
                                        Characters
                                    </Link>
                                    <Link to={`/anime/${id}/staff`} className={`pb-2 whitespace-nowrap ${location.pathname.includes('/staff') ? 'text-white border-b-2 border-blue-500' : 'text-gray-400 hover:text-white'}`}>
                                        Staff
                                    </Link>
                                    <button disabled className="pb-2 text-gray-400 line-through whitespace-nowrap">Reviews</button>
                                    <button disabled className="pb-2 text-gray-400 line-through whitespace-nowrap">Stats</button>
                                    <button disabled className="pb-2 text-gray-400 line-through whitespace-nowrap">Social</button>
                                </div>
                            </div>
                            <div className="mt-6 flex flex-col md:flex-row gap-6 w-full">
                                <div className="w-full md:w-[240px] flex-shrink-0 text-gray-400 bg-[#151F2E] p-5 rounded mb-4 md:mb-0 min-w-0">
                                    {[
                                        { label: 'Format', value: anime.type },
                                        { label: 'Episodes', value: anime.episodes },
                                        { label: 'Episode Duration', value: anime.duration },
                                        { label: 'Status', value: anime.status },
                                        { label: 'Start Date', value: (anime.aired && anime.aired.from) ? new Date(anime.aired.from).toLocaleDateString('pt-BR') : 'Desconhecido' },
                                        { label: 'End date', value: (anime.aired && anime.aired.to) ? new Date(anime.aired.to).toLocaleDateString('pt-BR') : 'Desconhecido' },
                                        { label: 'Season', value: anime.season ? `${anime.season.charAt(0).toUpperCase() + anime.season.slice(1)} ${anime.year}` : 'Desconhecido' },
                                        { label: 'Score', value: anime.score ? `${Math.round(anime.score * 10)}%` : 'N/A' },
                                        { label: 'Popularity', value: anime.popularity },
                                        { label: 'Favorites', value: anime.favorites },
                                        { label: 'Studios', value: anime.studios?.map((s) => s.name).join(', ') },
                                        { label: 'Producers', value: anime.producers?.map((p) => p.name).join(', ') },
                                        { label: 'Licensors', value: anime.licensors?.map((l) => l.name).join(', ') || 'N/A' },
                                        { label: 'Source', value: anime.source },
                                        { label: 'Genres', value: anime.genres?.map((g) => g.name).join(', ') },
                                        { label: 'Romaji', value: anime.title },
                                        { label: 'English', value: anime.title_english },
                                        { label: 'Native', value: anime.title_japanese },
                                        { label: 'Synonyms', value: anime.title_synonyms?.join(', ') },
                                        {
                                            label: 'Streaming', value: anime.streaming?.map((s: any) => (
                                                <a key={s.url} href={s.url} target="_blank" rel="noopener noreferrer" className="text-blue-400">{s.name} <br /></a>
                                            )) || 'N/A'
                                        },
                                    ].map(({ label, value }) => (
                                        <div className="mb-3" key={label}>
                                            <p className="text-[14px] font-bold text-[#9FADBD]">{label}</p>
                                            <p className="text-[13px]">{value || 'Desconhecido'}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex-1 min-w-0 md:p-2">
                                    <Outlet />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </ClientLayout>
        </AnimeDetailContext.Provider >
    );
};

export default AnimeDetailLayout;

