import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { GithubUser, GithubRepository } from '../../types/github-types';
import RepositoryList from '../RepositoryList/RepositoryList';

interface UserListProps {
  users: GithubUser[];
  selectedUser: string | null;
  onUserSelect: (username: string) => void;
  isLoading: boolean;
  repositories: GithubRepository[];
  isLoadingRepos: boolean;
}

const UserListContainer = styled.div`
  flex: 1;
  max-width: 100%;
  animation: fadeIn 0.5s ease-in-out;
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  @media (max-width: 767px) {
    max-width: 100%;
    margin-right: 0;
    margin-bottom: 20px;
  }
`;

const UserItem = styled.div<{ isSelected: boolean }>`
  padding: 12px;
  border: 1px solid ${props => props.isSelected ? '#2188ff' : '#e1e4e8'};
  border-radius: 6px;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  cursor: pointer;
  background-color: ${props => props.isSelected ? '#f1f8ff' : 'white'};
  position: relative;
  transition: all 0.25s ease;
  box-shadow: ${props => props.isSelected ? '0 4px 12px rgba(33, 136, 255, 0.15)' : '0 2px 6px rgba(0, 0, 0, 0.03)'};
  
  &:hover {
    border-color: #2188ff;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(33, 136, 255, 0.15);
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 0;
    background-color: #2188ff;
    transition: height 0.3s ease;
  }
  
  &:hover::before,
  &.${props => props.isSelected && 'selected'}::before {
    height: 100%;
  }
`;

const Username = styled.div`
  flex: 1;
  font-weight: 600;
  color: #24292e;
  position: relative;
  transition: color 0.2s ease;
  display: flex;
  align-items: center;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 0;
    height: 2px;
    background: linear-gradient(90deg, #2188ff, #79b8ff);
    transition: width 0.3s ease;
  }
  
  ${UserItem}:hover & {
    color: #0366d6;
    
    &::after {
      width: 60%;
    }
  }
`;

const ExpandIcon = styled.span`
  margin-left: 8px;
  font-size: 0.8em;
  transition: transform 0.3s ease;
  opacity: 0.7;
  
  ${UserItem}:hover & {
    opacity: 1;
    animation: pulse 1s infinite;
  }
  
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.1); }
    100% { transform: scale(1); }
  }
`;

const ExpandedIcon = styled(ExpandIcon)`
  transform: rotate(180deg);
`;

const UsersHeading = styled.div`
  font-size: 14px;
  color: #586069;
  margin-bottom: 10px;
  word-break: break-word;
  
  @media (max-width: 480px) {
    font-size: 13px;
  }
`;

const LoadingText = styled.div`
  text-align: center;
  padding: 20px;
  color: #586069;
  position: relative;
  overflow: hidden;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background: linear-gradient(90deg, transparent, #2188ff, transparent);
    animation: shimmer 1.5s infinite;
  }
  
  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
`;

const RepositoryContainer = styled.div<{ isVisible: boolean }>`
  display: ${props => props.isVisible ? 'block' : 'none'};
  border: 1px solid #e1e4e8;
  border-top: none;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  margin-bottom: 16px;
  background-color: white;
  overflow-y: auto;
  transition: all 0.3s ease-in-out;
  max-height: ${props => props.isVisible ? '400px' : '0'};
  opacity: ${props => props.isVisible ? '1' : '0'};
  position: relative;
  
  /* Custom scrollbar styling */
  &::-webkit-scrollbar {
    width: 8px;
    height: 8px;
    background-color: #f5f5f5;
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: #c1c1c1;
    border-radius: 4px;
    
    &:hover {
      background-color: #a8a8a8;
    }
  }
  
  /* Firefox scrollbar styling */
  scrollbar-width: thin;
  scrollbar-color: #c1c1c1 #f5f5f5;
  
  /* Add a visual indicator for scrolling */
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 20px;
    background: linear-gradient(transparent, rgba(0, 0, 0, 0.05));
    pointer-events: none;
    opacity: ${props => props.isVisible ? '1' : '0'};
    transition: opacity 0.3s ease;
  }
  
  @media (max-width: 480px) {
    width: 95%;
    margin: 0 auto;
    margin-bottom: 10px;
  }
`;

const MobileVisibilityWrapper = styled.div`
  @media (min-width: 768px) {
    display: none;
  }
`;

const UserList: React.FC<UserListProps> = ({ 
  users, 
  selectedUser, 
  onUserSelect, 
  isLoading, 
  repositories,
  isLoadingRepos 
}) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  if (isLoading) {
    return (
      <UserListContainer>
        <LoadingText>Searching for users...</LoadingText>
      </UserListContainer>
    );
  }

  if (users.length === 0) {
    return null;
  }

  return (
    <UserListContainer>
      <UsersHeading>
        Showing users for "{users[0]?.login.split('').filter(char => !parseInt(char)).join('')}"
      </UsersHeading>
      {users.map(user => (
        <React.Fragment key={user.id}>
          <UserItem 
            onClick={() => onUserSelect(user.login)}
            isSelected={selectedUser === user.login}
            data-testid={`user-${user.login}`}
          >
            <Username>{user.login}</Username>
            {selectedUser === user.login ? <ExpandedIcon>▲</ExpandedIcon> : <ExpandIcon>▼</ExpandIcon>}
          </UserItem>
          <MobileVisibilityWrapper>
            {isMobile && selectedUser === user.login && (
              <RepositoryContainer isVisible={selectedUser === user.login}>
                <RepositoryList 
                  username={user.login}
                  repositories={repositories}
                  isLoading={isLoadingRepos}
                  isMobile={isMobile}
                />
              </RepositoryContainer>              
            )}
          </MobileVisibilityWrapper>
        </React.Fragment>
      ))}
    </UserListContainer>
  );
};

export default UserList;
