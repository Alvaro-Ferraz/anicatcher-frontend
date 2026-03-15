export interface RecentEpisode {
  id: string;
  animeId: number;
  animeTitle: string;
  episodeNumber: number;
  imageUrl: string;
  airedAt: string;
}

export const mockRecentEpisodes: RecentEpisode[] = [
  {
    id: 'solo-leveling-ep12',
    animeId: 52299,
    animeTitle: 'Solo Leveling',
    episodeNumber: 12,
    imageUrl: 'https://cdn.myanimelist.net/images/anime/1000/142491l.jpg',
    airedAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
  },
  {
    id: 'jujutsu-kaisen-ep23',
    animeId: 51009,
    animeTitle: 'Jujutsu Kaisen',
    episodeNumber: 23,
    imageUrl: 'https://cdn.myanimelist.net/images/anime/1792/138022l.jpg',
    airedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
  },
  {
    id: 'demon-slayer-ep8',
    animeId: 57864,
    animeTitle: 'Demon Slayer',
    episodeNumber: 8,
    imageUrl: 'https://cdn.myanimelist.net/images/anime/1286/99889l.jpg',
    airedAt: new Date(Date.now() - 32 * 60 * 1000).toISOString(),
  },
  {
    id: 'one-piece-ep1098',
    animeId: 21,
    animeTitle: 'One Piece',
    episodeNumber: 1098,
    imageUrl: 'https://cdn.myanimelist.net/images/anime/1244/138851l.jpg',
    airedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'frieren-ep28',
    animeId: 52991,
    animeTitle: 'Frieren',
    episodeNumber: 28,
    imageUrl: 'https://cdn.myanimelist.net/images/anime/1015/138006l.jpg',
    airedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'chainsaw-man-ep12',
    animeId: 44511,
    animeTitle: 'Chainsaw Man',
    episodeNumber: 12,
    imageUrl: 'https://cdn.myanimelist.net/images/anime/1806/126216l.jpg',
    airedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'spy-x-family-ep37',
    animeId: 50265,
    animeTitle: 'Spy x Family',
    episodeNumber: 37,
    imageUrl: 'https://cdn.myanimelist.net/images/anime/1441/122795l.jpg',
    airedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'my-hero-academia-ep154',
    animeId: 31964,
    animeTitle: 'My Hero Academia',
    episodeNumber: 154,
    imageUrl: 'https://cdn.myanimelist.net/images/anime/1911/142478l.jpg',
    airedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
];
