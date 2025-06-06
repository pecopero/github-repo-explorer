export interface GithubUser {
  id: number;
  login: string;
  avatar_url: string;
  html_url: string;
}

export interface GithubSearchUserResponse {
  total_count: number;
  incomplete_results: boolean;
  items: GithubUser[];
}

export interface GithubRepository {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  created_at: string;
  updated_at: string;
  language: string | null;
}
