import { useEffect, useState, useCallback, useRef } from 'react';
import ClientLayout from '../../components/layout/ClientLayout';
import axios from 'axios';
import AnimeCardGrid from '../../components/AnimeCardGrid';
import AnimeSearchFilter from '../../components/SearchAnimeFilter';
import { useSearchParams } from 'react-router-dom';

export default function AnimeSearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState(() => searchParams.get('search') || '');
  const [genre, setGenre] = useState(() => Number(searchParams.get('genre')) || 0);
  const [year, setYear] = useState(() => searchParams.get('year') || 'Any');
  const [season, setSeason] = useState(() => searchParams.get('season') || 'Any');
  const [type, setType] = useState(() => searchParams.get('type') || 'Any');
  const [status, setStatus] = useState(() => searchParams.get('status') || 'Any');

  const [genres, setGenres] = useState<{ mal_id: number; name: string }[]>([{ mal_id: 0, name: 'Any' }]);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const genresResponse = await axios.get('https://api.jikan.moe/v4/genres/anime', { timeout: 5000 });
        let genresData = genresResponse.data.data;
        genresData = genresData.map((g: any) => ({ mal_id: g.mal_id, name: g.name }));
        setGenres([{ mal_id: 0, name: 'Any' }, ...genresData]);
      } catch (error) {
        setGenres([{ mal_id: 0, name: 'Any' }]);
      }
    };
    fetchGenres();
  }, []);

  useEffect(() => {
    const params: any = {};
    if (search.trim()) params.search = search;
    if (genre !== 0) params.genre = genre;
    if (year !== 'Any') params.year = year;
    if (season !== 'Any') params.season = season;
    if (type !== 'Any') params.type = type;
    if (status !== 'Any') params.status = status;
    setSearchParams(params, { replace: true });
  }, [search, genre, year, season, type, status]);

  const [animes, setAnimes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const requestIdRef = useRef(0);
  const [, setInitialLoad] = useState(true);

  const getCurrentSeason = () => {
    const date = new Date();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    if (month >= 1 && month <= 3) return { season: 'Winter', year };
    if (month >= 4 && month <= 6) return { season: 'Spring', year };
    if (month >= 7 && month <= 9) return { season: 'Summer', year };
    return { season: 'Fall', year };
  };

  const getSeasonDateRange = (season: string, year: string | number): [string, string] => {
    switch (season) {
      case 'Winter':
        return [`${year}-01-01`, `${year}-03-31`];
      case 'Spring':
        return [`${year}-04-01`, `${year}-06-30`];
      case 'Summer':
        return [`${year}-07-01`, `${year}-09-30`];
      case 'Fall':
        return [`${year}-10-01`, `${year}-12-31`];
      default:
        return [`${year}-01-01`, `${year}-12-31`];
    }
  };

  const normalizeStr = (v: string | number | undefined) =>
    typeof v === 'string' ? v.trim().toLowerCase() : '';

  const seasonAllowedFilters = ['tv', 'movie', 'ova', 'special', 'ona', 'music'];

  const buildParams = (customPage?: number) => {
    const params: Record<string, string | number> = {};

    const normType = normalizeStr(type);
    const normStatus = normalizeStr(status);
    const normSeason = normalizeStr(season);
    const normYear = normalizeStr(year);

    const hasSearch = search.trim().length > 0;
    const hasGenre = genre !== 0;
    const hasType = normType !== '' && normType !== 'any';
    const hasStatus = normStatus !== '' && normStatus !== 'any';
    const hasSeason = normSeason !== '' && normSeason !== 'any';
    const hasYear = normYear !== '' && normYear !== 'any';

    if (hasSearch) params.q = search;
    if (hasGenre) params.genres = genre;
    if (hasType) {
      // mantemos a possibilidade de enviar type para /anime
      const validTypes = ['tv', 'movie', 'ova', 'special', 'ona', 'music', 'cm', 'pv', 'tv_special'];
      if (validTypes.includes(normType)) params.type = normType;
    }
    if (hasStatus) {
      const validStatus = ['airing', 'complete', 'upcoming'];
      if (validStatus.includes(normStatus)) params.status = normStatus;
    }

    let selectedYear: string | number | undefined;
    if (hasYear) {
      selectedYear = year;
    } else if (hasSeason) {
      selectedYear = getCurrentSeason().year;
    }

    if (selectedYear) {
      if (hasSeason) {
        const [start_date, end_date] = getSeasonDateRange(season, selectedYear);
        params.start_date = start_date;
        params.end_date = end_date;
      } else if (hasType && hasYear) {
        params.start_date = `${selectedYear}-01-01`;
      } else {
        params.start_date = `${selectedYear}-01-01`;
        params.end_date = `${selectedYear}-12-31`;
      }
    }

    params.order_by = 'favorites';
    params.sort = 'desc';
    params.limit = 12;
    params.page = customPage ?? page;

    return params;
  };

  const fetchAnimeData = async (pageNumber: number) => {
    const normType = normalizeStr(type);
    const normStatus = normalizeStr(status);
    const normSeason = normalizeStr(season);
    const normYear = normalizeStr(year);

    const hasSearch = search.trim() !== '';
    const hasGenre = genre !== 0;
    const hasType = normType !== '' && normType !== 'any';
    const hasStatus = normStatus !== '' && normStatus !== 'any';
    const hasSeason = normSeason !== '' && normSeason !== 'any';
    const hasYear = normYear !== '' && normYear !== 'any';

    const shouldUseSeasonsOnly = hasSeason && !hasType && !hasSearch && !hasGenre && !hasStatus;

    const shouldUseSeasonsWithFilter =
      hasSeason &&
      hasType &&
      !hasSearch &&
      !hasGenre &&
      !hasStatus &&
      seasonAllowedFilters.includes(normType);

    if (shouldUseSeasonsOnly) {
      const yearForSeason = hasYear ? year : getCurrentSeason().year;
      const response = await axios.get(
        `https://api.jikan.moe/v4/seasons/${yearForSeason}/${season.toLowerCase()}`,
        { params: buildSeasonParams(pageNumber) }
      );
      return response.data;
    }

    if (shouldUseSeasonsWithFilter) {
      const yearForSeason = hasYear ? year : getCurrentSeason().year;
      const response = await axios.get(
        `https://api.jikan.moe/v4/seasons/${yearForSeason}/${season.toLowerCase()}`,
        { params: buildSeasonParams(pageNumber, normType) }
      );
      return response.data;
    }
    const response = await axios.get('https://api.jikan.moe/v4/anime', {
      params: buildParams(pageNumber),
    });
    return response.data;
  };

  const buildSeasonParams = (customPage?: number, filter?: string) => {
    const params: Record<string, string | number | boolean> = {
      page: customPage ?? page,
      limit: 12,
    };
    if (filter) params.filter = filter;
    return params;
  };


  useEffect(() => {
    let isMounted = true;
    const debounce = setTimeout(() => {
      requestIdRef.current += 1;
      const thisRequestId = requestIdRef.current;
      setIsLoading(true);
      setPage(1);
      (async () => {
        try {
          const data = await fetchAnimeData(1);
          if (requestIdRef.current === thisRequestId && isMounted) {
            setAnimes(data.data ?? []);
            setHasNextPage(data.pagination?.has_next_page ?? false);
          }
        } catch (e) {
          if (isMounted) console.error('Erro ao buscar animes:', e);
        } finally {
          if (requestIdRef.current === thisRequestId && isMounted) {
            setIsLoading(false);
            setInitialLoad(false);
          }
        }
      })();
    }, 500);
    return () => {
      isMounted = false;
      clearTimeout(debounce);
    };
  }, [search, genre, year, season, type, status]);


  const fetchMoreAnimes = useCallback(async () => {
    if (isLoading || isLoadingMore || !hasNextPage) return;
    setIsLoadingMore(true);
    const thisRequestId = requestIdRef.current;
    const nextPage = page + 1;

    try {
      const data = await fetchAnimeData(nextPage);
      if (requestIdRef.current === thisRequestId) {
        setAnimes(prev => [...prev, ...(data.data ?? [])]);
        setPage(nextPage);
        setHasNextPage(data.pagination?.has_next_page ?? false);
      }
    } catch (e) {
      console.error('Erro ao carregar mais animes:', e);
    } finally {
      if (requestIdRef.current === thisRequestId) {
        setIsLoadingMore(false);
      }
    }
  }, [isLoading, isLoadingMore, hasNextPage, page, search, genre, year, season, type, status]);


  useEffect(() => {
    if (!hasNextPage) return;
    let timeout: ReturnType<typeof setTimeout> | null = null;
    const handleScroll = () => {
      if (isLoading || isLoadingMore) return;
      const scrollY = window.scrollY;
      const viewport = window.innerHeight;
      const fullHeight = document.body.offsetHeight;
      if (scrollY + viewport >= fullHeight - 200) {
        if (!timeout) {
          timeout = setTimeout(() => {
            fetchMoreAnimes();
            timeout = null;
          }, 700);
        }
      } else if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (timeout) clearTimeout(timeout);
    };
  }, [fetchMoreAnimes, hasNextPage, isLoading, isLoadingMore]);

  return (
    <ClientLayout>
      <div className="p-6 bg-gray-900 text-white space-y-6">
        <AnimeSearchFilter
          search={search}
          setSearch={setSearch}
          genre={genre}
          setGenre={setGenre}
          year={year}
          setYear={setYear}
          season={season}
          setSeason={setSeason}
          format={type}
          setFormat={setType}
          status={status}
          setStatus={setStatus}
          onSearch={() => { }}
          genres={genres}
        />

        <AnimeCardGrid
          title="Resultados da Busca"
          animes={animes}
          isLoading={isLoading}
          columns={6}
          showViewAll={false}
        />

        {isLoading && (
          <div className="flex justify-center my-6">
            <span className="text-blue-400 animate-pulse">Procurando...</span>
          </div>
        )}

        {isLoadingMore && hasNextPage && (
          <div className="flex justify-center mt-4">
            <span className="text-blue-400">Carregando mais...</span>
          </div>
        )}
      </div>
    </ClientLayout>
  );
}

export { AnimeSearchPage };