// Type definitions for the MN Dramas API — matches kisskh.co's internal schema.

export interface DramaList {
  totalCount: number;
  data: DramaSummary[];
}

export interface DramaSummary {
  id: number;
  title: string;
  originalTitle?: string | null;
  thumbnail?: string | null;
  thumbnailHash?: string | null;
  episodesCount?: number;
  latestEpisode?: number | null;
  countryID?: number;
  type?: string | null;
  status?: string | null;
  year?: number | null;
  description?: string | null;
  // used by the "most viewed / top rated" endpoints
  rank?: number;
  subCount?: number;
  label?: string | null;
}

export interface DramaDetail {
  id: number;
  title: string;
  originalTitle: string | null;
  description: string | null;
  releaseDate: string | null;
  thumbnail: string | null;
  thumbnailHash: string | null;
  trailer: string | null;
  countryID: number;
  type: string | null;
  status: string | null;
  status2: string | null;
  episodesCount: number;
  episodes: Episode[];
  casts: { name: string; id: number }[];
  categories: { name: string; id: number }[];
  country: string;
  year: number | null;
}

export interface Episode {
  id: number;
  number: number;
  subTitleCount: number;
  videoId: string | null;
  filler: boolean;
  // sometimes the API returns episodeNumber
  episodeNumber?: number;
}

export interface StreamData {
  Video?: string; // m3u8 URL
  ThirdParty?: string | null;
  // sometimes kisskh returns {Video, ThirdParty} and sometimes {video, thirdParty}
  video?: string;
  thirdParty?: string;
}

export interface Subtitle {
  id: number;
  label: string;
  src: string;
  default?: boolean;
}

export type SearchItem = {
  id: number;
  title: string;
  thumbnail: string | null;
  episodesCount?: number;
  countryID?: number;
  type?: string | null;
};

export interface ApiEnvelope<T> {
  source: string;
  endpoint: string;
  data: T;
}
