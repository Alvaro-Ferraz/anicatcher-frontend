import AnimeGenres from '../../components/AnimeGenresFilter';
import AnimeCardGrid from '../../components/AnimeCardGrid';
import RecentEpisodesShowcase from '../../components/RecentEpisodesShowcase';
import ClientLayout from '../../components/layout/ClientLayout/index';
import axios from 'axios';
import { useState, useEffect } from 'react';

const delay = (ms: number | undefined) => new Promise((resolve) => setTimeout(resolve, ms));

export const Home = () => {
  const [genres, setGenres] = useState<any[]>([]);
  const [seasonAnimes, setSeasonAnimes] = useState<any[]>([]);
  const [nextSeason, setNextSeason] = useState<any[]>([]);
  const [filteredAnimes, setFilteredAnimes] = useState<any[]>([]);
  const [selectedGenre, setSelectedGenre] = useState('Todos');
  const [isLoadingSeason, setIsLoadingSeason] = useState(true);
  const [isLoadingNextSeason, setIsLoadingNextSeason] = useState(true);
  const [isLoadingFiltered, setIsLoadingFiltered] = useState(true);
  const getCurrentSeason = () => {
    const date = new Date();
    const month = date.getMonth() + 1;
    if (month >= 1 && month <= 3) return { season: 'Winter', year: date.getFullYear() };
    if (month >= 4 && month <= 6) return { season: 'Spring', year: date.getFullYear() };
    if (month >= 7 && month <= 9) return { season: 'Summer', year: date.getFullYear() };
    return { season: 'Fall', year: date.getFullYear() };
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoadingSeason(true);

        const seasonResponse = await axios.get('https://api.jikan.moe/v4/seasons/now', { timeout: 5000 });
        const seasonData = seasonResponse.data.data;
        setSeasonAnimes(seasonData);
        setFilteredAnimes(seasonData);

        setIsLoadingSeason(false);
        setIsLoadingFiltered(false);

        await delay(1000);

        setIsLoadingNextSeason(true);
        const nextSeasonResponse = await axios.get('https://api.jikan.moe/v4/seasons/upcoming', { timeout: 5000 });
        const nextSeasonData = nextSeasonResponse.data.data;
        setNextSeason(nextSeasonData);
        setIsLoadingNextSeason(false);

        await delay(1000);

        const genresResponse = await axios.get('https://api.jikan.moe/v4/genres/anime', { timeout: 5000 });
        const genresData = genresResponse.data.data;
        setGenres(genresData);
      } catch (error: any) {
        console.error('Erro ao buscar dados:', error);

        if (error.response?.status === 429) {
          console.log('Rate limit atingido, tentando novamente em 5 segundos...');
          await delay(5000);
          fetchData();
          return;
        }

        setIsLoadingSeason(false);
        setIsLoadingNextSeason(false);
        setIsLoadingFiltered(false);
      }
    };

    fetchData();
  }, []);

  const handleGenreSelect = async (genre: { mal_id: any; name: string }) => {
    if (!genre) {
      setFilteredAnimes(seasonAnimes);
      setSelectedGenre('Todos');
      setIsLoadingFiltered(false);
      return;
    }

    setIsLoadingFiltered(true);
    setSelectedGenre(genre.name);
    try {
      const response = await axios.get(`https://api.jikan.moe/v4/anime?genres=${genre.mal_id}`, { timeout: 5000 });
      const filteredData = response.data.data;
      setFilteredAnimes(filteredData);
      setIsLoadingFiltered(false);

      await delay(1000);
    } catch (error: any) {
      console.error('Erro ao buscar animes filtrados:', error);

      if (error.response?.status === 429) {
        console.log('Rate limit atingido na filtragem, tentando novamente em 5 segundos...');
        await delay(5000);
        handleGenreSelect(genre);
        return;
      }

      setIsLoadingFiltered(false);
    }
  };

  return (
    <ClientLayout>
      {/* Episódios Recentes */}
      <div className="mt-10 mb-10">
        <RecentEpisodesShowcase />
      </div>

      <AnimeCardGrid
        title="Popular this season"
        animes={seasonAnimes}
        columns={6}
        rows={2}
        showViewAll={true}
        viewAllLink={`/anime/search?season=${getCurrentSeason().season}`}
        isLoading={isLoadingSeason}
      />
      <div className="mt-10"></div>
      <AnimeCardGrid
        title="Upcoming next season"
        animes={nextSeason}
        columns={6}
        rows={1}
        showViewAll={true}
        viewAllLink={`/anime/search?status=Upcoming`}
        isLoading={isLoadingNextSeason}
      />

      <section className="mt-10">
        <div className="flex justify-between items-center mb-5 scroll-bar">
          <AnimeGenres genres={genres} onGenreSelect={handleGenreSelect} />
        </div>
        <AnimeCardGrid
          title={selectedGenre}
          animes={filteredAnimes}
          columns={6}
          rows={2}
          showViewAll={true}
          viewAllLink={`/anime/search`}
          isLoading={isLoadingFiltered}
        />
      </section>
    </ClientLayout>
  );
};

export default Home;