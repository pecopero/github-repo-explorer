import axios from 'axios';
import { GithubSearchUserResponse, GithubRepository } from '../types/github-types';

const BASE_URL = 'https://api.github.com';

/**
 * Search for GitHub users based on username
 * @param username - Username to search for
 * @param limit - Maximum number of users to return
 */
export const searchUsers = async (username: string, limit: number = 5): Promise<GithubSearchUserResponse> => {
  try {
    const response = await axios.get(`${BASE_URL}/search/users`, {
      params: {
        q: `${username} in:login`,
        per_page: limit
      },
      headers: {
        Accept: 'application/vnd.github.v3+json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error searching users:', error);
    throw error;
  }
};

/**
 * Get repositories for a specific user
 * @param username - Username to get repositories for
 */
export const getUserRepositories = async (username: string): Promise<GithubRepository[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/users/${username}/repos`, {
      params: {
        sort: 'updated',
        direction: 'desc',
        per_page: 100
      },
      headers: {
        Accept: 'application/vnd.github.v3+json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user repositories:', error);
    throw error;
  }
};
