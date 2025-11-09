export interface Anime {
  mal_id?: number;
  title: string;
  title_japanese?: string;
  title_english?: string;
  title_synonyms?: string[];
  trailer?: {
    images?: {
      maximum_image_url?: string;
    };
  };
  images?: {
    jpg?: {
      large_image_url?: string;
      image_url?: string;
    };
  };
  year?: number;
  genres?: { name: string }[];
  episodes?: number;
  episodes_detail?: Episode[];
  type?: string;
  duration?: string;
  status?: string;
  aired?: {
    from?: string;
    to?: string;
    prop?: {
      from?: {
        day?: number;
        month?: number;
        year?: number;
      };
      to?: {
        day?: number;
        month?: number;
        year?: number;
      };
    };
  };
  season?: string;
  score?: number;
  scored_by?: number;
  rank?: number;
  popularity?: number;
  members?: number;
  favorites?: number;
  licensors?: { name: string }[];
  studios?: { name: string }[];
  producers?: { name: string }[];
  source?: string;
  streaming?: { name: string; url: string }[];
}
export interface Episode {
  mal_id: number;
  title: string;
  episode: string;
  url: string;
  images: {
    jpg: {
      image_url: string;
    };
  };
}

export interface Trailer {
  youtube_id: string;
  url: string;
  embed_url: string;
  images: {
    image_url: string;
    small_image_url: string;
    medium_image_url: string;
    large_image_url: string;
    maximum_image_url: string;
  };
}


export interface Recommendation {
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