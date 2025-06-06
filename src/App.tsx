import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Search from './components/Search/Search';
import UserList from './components/UserList/UserList';
import RepositoryList from './components/RepositoryList/RepositoryList';
import GlobalStyles from './styles/GlobalStyles';
import { searchUsers, getUserRepositories } from './services/githubService';
import { GithubUser, GithubRepository } from './types/github-types';

const AppContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  
  @media (max-width: 768px) {
    padding: 16px;
    width: 100%;
  }
`;

const AppTitle = styled.h1`
  display: none;
  text-align: center;
  margin-bottom: 40px;
  color: #24292e;
  
  @media (max-width: 768px) {
    margin-bottom: 24px;
    font-size: 1.8rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.5rem;
    margin-bottom: 20px;
  }
`;

const ContentContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  
  @media (min-width: 768px) {
    grid-template-columns: 1fr 3fr;
    gap: 20px;
  }
  
  @media (max-width: 767px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

const LeftColumn = styled.div`
  @media (max-width: 767px) {
    margin-bottom: 16px;
  }
`;

const RightColumn = styled.div`
  width: 100%;
`;

const ErrorMessage = styled.div`
  background-color: #ffebe9;
  border: 1px solid #f9d0c4;
  color: #86181d;
  padding: 16px;
  border-radius: 4px;
  margin-bottom: 20px;
  
  @media (max-width: 480px) {
    padding: 12px;
    font-size: 0.9rem;
    margin-bottom: 16px;
  }
`;

function App() {
  const [users, setUsers] = useState<GithubUser[]>([]);
  const [repositories, setRepositories] = useState<GithubRepository[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingRepos, setIsLoadingRepos] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSearch = async (query: string) => {
    if (!query) return;

    setError(null);
    setIsSearching(true);
    setSelectedUser(null);
    setRepositories([]);
    
    try {
      const result = await searchUsers(query);
      setUsers(result.items);
      
      if (result.items.length === 0) {
        setError(`No users found matching "${query}"`);
      }
    } catch (err) {
      setError('Failed to search users. Please try again later.');
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleUserSelect = async (username: string) => {
    if (selectedUser === username) {
      setSelectedUser(null);
      setRepositories([]);
      return;
    }
    
    setSelectedUser(username);
    setRepositories([]);
    setError(null);
    setIsLoadingRepos(true);
    
    try {
      const repos = await getUserRepositories(username);
      setRepositories(repos);
    } catch (err) {
      setError(`Failed to fetch repositories for ${username}. Please try again later.`);
      console.error(err);
    } finally {
      setIsLoadingRepos(false);
    }
  };

  return (
    <>
      <GlobalStyles />
      <AppContainer>
        <AppTitle>GitHub Repository Explorer</AppTitle>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <Search 
          onSearch={handleSearch}
          isLoading={isSearching}
        />
        
        <ContentContainer>
          <LeftColumn>
            <UserList
              users={users}
              selectedUser={selectedUser}
              onUserSelect={handleUserSelect}
              isLoading={isSearching}
              repositories={repositories}
              isLoadingRepos={isLoadingRepos}
            />
          </LeftColumn>
          
          <RightColumn>
            {selectedUser && !isMobile && (
              <RepositoryList
                repositories={repositories}
                username={selectedUser}
                isLoading={isLoadingRepos}
                isMobile={isMobile}
              />
            )}
          </RightColumn>
        </ContentContainer>
      </AppContainer>
    </>
  );
}

export default App;
