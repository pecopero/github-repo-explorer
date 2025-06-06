import axios from 'axios';
import { searchUsers, getUserRepositories } from './githubService';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('GitHub Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('searchUsers', () => {
    it('should fetch users successfully', async () => {
      const mockUsers = {
        data: {
          total_count: 2,
          incomplete_results: false,
          items: [
            { id: 1, login: 'user1', avatar_url: 'url1', html_url: 'html1' },
            { id: 2, login: 'user2', avatar_url: 'url2', html_url: 'html2' }
          ]
        }
      };

      mockedAxios.get.mockResolvedValueOnce(mockUsers);

      const result = await searchUsers('test', 2);

      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://api.github.com/search/users',
        {
          params: {
            q: 'test in:login',
            per_page: 2
          },
          headers: {
            Accept: 'application/vnd.github.v3+json'
          }
        }
      );
      expect(result).toEqual(mockUsers.data);
    });

    it('should handle errors when fetching users', async () => {
      const errorMessage = 'Network Error';
      mockedAxios.get.mockRejectedValueOnce(new Error(errorMessage));

      // Use spy to verify console.error is called
      const consoleSpy = jest.spyOn(console, 'error');
      
      await expect(searchUsers('test')).rejects.toThrow(errorMessage);
      expect(consoleSpy).toHaveBeenCalled();
    });
  });

  describe('getUserRepositories', () => {
    it('should fetch user repositories successfully', async () => {
      const mockRepos = {
        data: [
          { 
            id: 1, 
            name: 'repo1', 
            description: 'desc1', 
            html_url: 'url1', 
            stargazers_count: 10,
            created_at: '2023-01-01',
            updated_at: '2023-01-10',
            language: 'JavaScript'
          }
        ]
      };

      mockedAxios.get.mockResolvedValueOnce(mockRepos);

      const result = await getUserRepositories('testuser');

      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://api.github.com/users/testuser/repos',
        {
          params: {
            sort: 'updated',
            direction: 'desc',
            per_page: 100
          },
          headers: {
            Accept: 'application/vnd.github.v3+json'
          }
        }
      );
      expect(result).toEqual(mockRepos.data);
    });

    it('should handle errors when fetching repositories', async () => {
      const errorMessage = 'API rate limit exceeded';
      mockedAxios.get.mockRejectedValueOnce(new Error(errorMessage));

      // Use spy to verify console.error is called
      const consoleSpy = jest.spyOn(console, 'error');
      
      await expect(getUserRepositories('testuser')).rejects.toThrow(errorMessage);
      expect(consoleSpy).toHaveBeenCalled();
    });
  });
});
