const years = ['Any', ...Array.from({ length: 30 }, (_, i) => `${2025 - i}`)];
const seasons = ['Any', 'Winter', 'Spring', 'Summer', 'Fall'];
const formats = ['Any', 'TV', 'Movie', 'OVA', 'Special', 'ONA', 'Music'];
const statuses = ['Any', 'Airing', 'Complete', 'Upcoming'];



type Genre = { mal_id: number; name: string };
type AnimeSearchFilterProps = {
  search: string;
  setSearch: (v: string) => void;
  genre: number;
  setGenre: (v: number) => void;
  genres: Genre[];
  year: string;
  setYear: (v: string) => void;
  season: string;
  setSeason: (v: string) => void;
  format: string;
  setFormat: (v: string) => void;
  status: string;
  setStatus: (v: string) => void;
  onSearch: () => void;
};

const AnimeSearchFilter: React.FC<AnimeSearchFilterProps> = ({
  search,
  setSearch,
  genre,
  setGenre,
  genres,
  year,
  setYear,
  season,
  setSeason,
  format,
  setFormat,
  status,
  setStatus,
  onSearch,
}) => {

  const clearFilters = () => {
    setSearch('');
    setGenre(0);
    setYear('Any');
    setSeason('Any');
    setFormat('Any');
    setStatus('Any');
  };

  return (
    <div className="space-y-6 p-6 bg-gray-900 text-white rounded-lg">
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <div className="flex flex-col">
          <label className="mb-1 text-xs text-gray-400">Buscar</label>
          <input
            type="text"
            placeholder="Buscar anime..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && onSearch()}
            className="px-3 py-2 bg-gray-800 rounded focus:outline-none border border-gray-700 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-1 text-xs text-gray-400">Gênero</label>
          <select
            value={genre}
            onChange={e => setGenre(Number(e.target.value))}
            className="px-3 py-2 bg-gray-800 rounded focus:outline-none border border-gray-700 focus:ring-2 focus:ring-blue-500"
          >
            {genres.map(g => (
              <option key={g.mal_id} value={g.mal_id}>{g.name}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label className="mb-1 text-xs text-gray-400">Ano</label>
          <select
            value={year}
            onChange={e => setYear(e.target.value)}
            className="px-3 py-2 bg-gray-800 rounded focus:outline-none border border-gray-700 focus:ring-2 focus:ring-blue-500"
          >
            {years.map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label className="mb-1 text-xs text-gray-400">Temporada</label>
          <select
            value={season}
            onChange={e => setSeason(e.target.value)}
            className="px-3 py-2 bg-gray-800 rounded focus:outline-none border border-gray-700 focus:ring-2 focus:ring-blue-500"
          >
            {seasons.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label className="mb-1 text-xs text-gray-400">Formato</label>
          <select
            value={format}
            onChange={e => setFormat(e.target.value)}
            className="px-3 py-2 bg-gray-800 rounded focus:outline-none border border-gray-700 focus:ring-2 focus:ring-blue-500"
          >
            {formats.map(f => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label className="mb-1 text-xs text-gray-400">Status</label>
          <select
            value={status}
            onChange={e => setStatus(e.target.value)}
            className="px-3 py-2 bg-gray-800 rounded focus:outline-none border border-gray-700 focus:ring-2 focus:ring-blue-500"
          >
            {statuses.map(st => (
              <option key={st} value={st}>{st}</option>
            ))}
          </select>
          <button
            onClick={clearFilters}
            className="px-4 py-2 mt-5 rounded-md bg-blue-600 hover:bg-blue-700 text-sm font-medium shadow-sm"
            aria-label="Limpar todos os filtros"
          >
            Limpar filtros
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnimeSearchFilter;
