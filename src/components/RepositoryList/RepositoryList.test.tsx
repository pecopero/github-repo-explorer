import React from 'react';
import { render, screen } from '@testing-library/react';
import RepositoryList from './RepositoryList';
import { GithubRepository } from '../../types/github-types';

describe('RepositoryList Component', () => {
  const mockRepositories: GithubRepository[] = [
    {
      id: 1,
      name: 'repo1',
      description: 'Test repository 1',
      html_url: 'https://github.com/user/repo1',
      stargazers_count: 12,
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2023-01-10T00:00:00Z',
      language: 'TypeScript'
    },
    {
      id: 2,
      name: 'repo2',
      description: null,
      html_url: 'https://github.com/user/repo2',
      stargazers_count: 48,
      created_at: '2023-02-01T00:00:00Z',
      updated_at: '2023-02-10T00:00:00Z',
      language: 'JavaScript'
    }
  ];
  
  test('renders list of repositories', () => {
    render(
      <RepositoryList 
        repositories={mockRepositories}
        username="testuser"
        isLoading={false}
      />
    );
    
    expect(screen.getByText('testuser')).toBeInTheDocument();
    expect(screen.getByText('repo1')).toBeInTheDocument();
    expect(screen.getByText('repo2')).toBeInTheDocument();
    expect(screen.getByText('Test repository 1')).toBeInTheDocument();
    expect(screen.getByText('Repository description')).toBeInTheDocument(); // For null description
    expect(screen.getByText('12')).toBeInTheDocument();
    expect(screen.getByText('48')).toBeInTheDocument();
  });
  
  test('displays loading message when isLoading is true', () => {
    render(
      <RepositoryList 
        repositories={[]}
        username="testuser"
        isLoading={true}
      />
    );
    
    expect(screen.getByText('testuser')).toBeInTheDocument();
    expect(screen.getByText('Loading repositories...')).toBeInTheDocument();
  });
  
  test('displays no repositories message when list is empty', () => {
    render(
      <RepositoryList 
        repositories={[]}
        username="testuser"
        isLoading={false}
      />
    );
    
    expect(screen.getByText('testuser')).toBeInTheDocument();
    expect(screen.getByText('No repositories found')).toBeInTheDocument();
  });
  
  test('renders repository links correctly', () => {
    render(
      <RepositoryList 
        repositories={mockRepositories}
        username="testuser"
        isLoading={false}
      />
    );
    
    const links = screen.getAllByRole('link');
    expect(links[0]).toHaveAttribute('href', 'https://github.com/user/repo1');
    expect(links[1]).toHaveAttribute('href', 'https://github.com/user/repo2');
    
    links.forEach(link => {
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });
});
