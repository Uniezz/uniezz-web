export type Material = {
  subject: string;
  university: string;
  type: string;
  author: string;
  rating: string;
  votes: number;
  downloads: string;
  own?: boolean;
};

export type ExamsFilters = { search: string; tab: string; university: string };
