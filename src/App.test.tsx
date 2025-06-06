import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import { searchUsers, getUserRepositories } from './services/githubService';

// Mock the GitHub service
jest.mock('./services/githubService');
const mockedSearchUsers = searchUsers as jest.MockedFunction<typeof searchUsers>;
const mockedGetUserRepositories = getUserRepositories as jest.MockedFunction<typeof getUserRepositories>;

describe('App Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  test('renders the application title', () => {
    render(<App />);
    expect(screen.getByText('GitHub Repository Explorer')).toBeInTheDocument();
  });
  
  test('searches for users and displays results', async () => {
    const mockUsers = {
      total_count: 2,
      incomplete_results: false,
      items: [
        { id: 1, login: 'testuser1', avatar_url: 'url1', html_url: 'html1' },
        { id: 2, login: 'testuser2', avatar_url: 'url2', html_url: 'html2' }
      ]
    };
    
    mockedSearchUsers.mockResolvedValueOnce(mockUsers);
    
    render(<App />);
    
    // Find and interact with search form
    const input = screen.getByPlaceholderText('Enter username');
    const button = screen.getByRole('button', { name: /search/i });
    
    await userEvent.type(input, 'testuser');
    fireEvent.click(button);
    
    // Wait for results to be displayed
    await waitFor(() => {
      expect(screen.getByText('testuser1')).toBeInTheDocument();
      expect(screen.getByText('testuser2')).toBeInTheDocument();
    });
    
    expect(mockedSearchUsers).toHaveBeenCalledWith('testuser');
  });
  
  test('displays repositories when a user is selected', async () => {
    const mockUsers = {
      total_count: 1,
      incomplete_results: false,
      items: [
        { id: 1, login: 'testuser', avatar_url: 'url1', html_url: 'html1' }
      ]
    };
    
    const mockRepos = [
      { 
        id: 1, 
        name: 'testrepo', 
        description: 'Test repository', 
        html_url: 'repourl',
        stargazers_count: 42,
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-10T00:00:00Z',
        language: 'TypeScript'
      }
    ];
    
    mockedSearchUsers.mockResolvedValueOnce(mockUsers);
    mockedGetUserRepositories.mockResolvedValueOnce(mockRepos);
    
    render(<App />);
    
    // Search for users
    const input = screen.getByPlaceholderText('Enter username');
    const button = screen.getByRole('button', { name: /search/i });
    
    await userEvent.type(input, 'testuser');
    fireEvent.click(button);
    
    // Wait for results and select a user
    await waitFor(() => {
      const userElement = screen.getByText('testuser');
      expect(userElement).toBeInTheDocument();
      fireEvent.click(userElement);
    });
    
    // Wait for repositories to be displayed
    await waitFor(() => {
      expect(screen.getByText('testrepo')).toBeInTheDocument();
      expect(screen.getByText('Test repository')).toBeInTheDocument();
      expect(screen.getByText('42')).toBeInTheDocument();
    });
    
    expect(mockedGetUserRepositories).toHaveBeenCalledWith('testuser');
  });
  
  test('displays error message when API fails', async () => {
    mockedSearchUsers.mockRejectedValueOnce(new Error('API failure'));
    
    render(<App />);
    
    // Search for users
    const input = screen.getByPlaceholderText('Enter username');
    const button = screen.getByRole('button', { name: /search/i });
    
    await userEvent.type(input, 'testuser');
    fireEvent.click(button);
    
    // Wait for error message
    await waitFor(() => {
      expect(screen.getByText('Failed to search users. Please try again later.')).toBeInTheDocument();
    });
  });
});
