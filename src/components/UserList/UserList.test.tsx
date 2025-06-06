import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import UserList from './UserList';
import { GithubUser, GithubRepository } from '../../types/github-types';

describe('UserList Component', () => {
  const mockUsers: GithubUser[] = [
    { id: 1, login: 'user1', avatar_url: 'avatar1.jpg', html_url: 'https://github.com/user1' },
    { id: 2, login: 'user2', avatar_url: 'avatar2.jpg', html_url: 'https://github.com/user2' },
  ];

  const mockRepositories: GithubRepository[] = [
    { 
      id: 1, 
      name: 'repo1', 
      html_url: 'https://github.com/user1/repo1', 
      description: 'Test repo 1', 
      stargazers_count: 5,
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2023-01-02T00:00:00Z',
      language: 'TypeScript'
    },
  ];
  
  const mockOnUserSelect = jest.fn();
  
  beforeEach(() => {
    mockOnUserSelect.mockClear();
  });
  
  test('renders list of users', () => {
    render(
      <UserList 
        users={mockUsers}
        selectedUser={null}
        onUserSelect={mockOnUserSelect}
        isLoading={false}
        repositories={mockRepositories}
        isLoadingRepos={false}
      />
    );
    
    expect(screen.getByText('user1')).toBeInTheDocument();
    expect(screen.getByText('user2')).toBeInTheDocument();
  });
  
  test('calls onUserSelect when a user is clicked', () => {
    render(
      <UserList 
        users={mockUsers}
        selectedUser={null}
        onUserSelect={mockOnUserSelect}
        isLoading={false}
        repositories={mockRepositories}
        isLoadingRepos={false}
      />
    );
    
    fireEvent.click(screen.getByText('user1'));
    
    expect(mockOnUserSelect).toHaveBeenCalledWith('user1');
  });
  
  test('displays loading message when isLoading is true', () => {
    render(
      <UserList 
        users={[]}
        selectedUser={null}
        onUserSelect={mockOnUserSelect}
        isLoading={true}
        repositories={[]}
        isLoadingRepos={false}
      />
    );
    
    expect(screen.getByText('Searching for users...')).toBeInTheDocument();
  });
  
  test('shows selected user with expanded icon', () => {
    render(
      <UserList 
        users={mockUsers}
        selectedUser="user1"
        onUserSelect={mockOnUserSelect}
        isLoading={false}
        repositories={mockRepositories}
        isLoadingRepos={false}
      />
    );
    
    const userElement = screen.getByText('user1').closest('div');
    expect(userElement).toHaveStyle('background-color: #f1f8ff');
  });
});
