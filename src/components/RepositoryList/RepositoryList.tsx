import React from 'react';
import styled from 'styled-components';
import { GithubRepository } from '../../types/github-types';

interface RepositoryListProps {
  repositories: GithubRepository[];
  username: string;
  isLoading: boolean;
  isMobile?: boolean;
}

// Removed unused RepositoryListContainer

const RepositoryItem = styled.div`
  padding: 16px;
  border: 1px solid #e1e4e8;
  border-radius: 8px;
  margin-bottom: 16px;
  background-color: white;
  position: relative;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
    border-color: #2188ff;
  }
  
  @media (max-width: 768px) {
    padding: 14px;
    margin-bottom: 12px;
    border-left: none;
    border-right: none;
    border-radius: 0;
  }
  
  @media (max-width: 480px) {
    padding: 12px 8px;
    margin-bottom: 2px;
    border-left: none;
    border-right: none;
    border-radius: 0;
  }
  
  &:last-child {
    margin-bottom: 0;
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 3px;
    background: linear-gradient(90deg, #2188ff, #79b8ff);
    transition: width 0.3s ease;
  }
  
  &:hover::after {
    width: 100%;
  }
`;

const RepositoryTitle = styled.h3`
  margin: 0;
  font-size: 16px;
  margin-bottom: 8px;
  padding-right: 40px; /* Make room for the star count */
  word-break: break-word;
  color: #0366d6;
  transition: color 0.2s ease;
  
  a {
    position: relative;
    text-decoration: none;
    color: inherit;
    
    &::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 0;
      width: 0;
      height: 1px;
      background-color: currentColor;
      transition: width 0.3s ease;
    }
    
    &:hover {
      text-decoration: none;
      color: #2188ff;
      
      &::after {
        width: 100%;
      }
    }
  }
  
  @media (max-width: 480px) {
    font-size: 14px;
  }
`;

const RepositoryDescription = styled.p`
  color: #586069;
  font-size: 14px;
  margin: 0;
  word-break: break-word;
  line-height: 1.6;
  opacity: 0.85;
  transition: opacity 0.2s ease;
  overflow: hidden;
  position: relative;
  
  ${RepositoryItem}:hover & {
    opacity: 1;
  }
  
  @media (max-width: 480px) {
    font-size: 13px;
  }
`;

const StarCount = styled.span`
  position: absolute;
  top: 16px;
  right: 16px;
  display: flex;
  align-items: center;
  color: #586069;
  font-size: 14px;
  background-color: rgba(241, 224, 90, 0.1);
  padding: 3px 8px;
  border-radius: 20px;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: rgba(241, 224, 90, 0.2);
    transform: scale(1.05);
  }
  
  @media (max-width: 768px) {
    top: 14px;
    right: 14px;
  }
  
  @media (max-width: 480px) {
    top: 12px;
    right: 12px;
    font-size: 13px;
    padding: 2px 6px;
  }
`;

const StarIcon = styled.span`
  margin-left: 4px;
  color: #f1e05a;
  display: inline-block;
  animation: twinkle 1.5s infinite alternate;
  transition: transform 0.2s ease;
  
  @keyframes twinkle {
    0% { opacity: 0.8; }
    100% { opacity: 1; }
  }
  
  ${StarCount}:hover & {
    transform: rotate(72deg);
    animation-duration: 0.8s;
  }
`;

const LoadingMessage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 150px;
  color: #586069;
  
  @media (max-width: 480px) {
    height: 100px;
    padding: 20px;
  }
`;

// Removed unused LoadingText

const UserHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  
  @media (max-width: 768px) {
    margin-bottom: 12px;
  }
  
  @media (max-width: 480px) {
    margin: 10px 0;
    padding: 0 8px;
  }
`;

const Username = styled.h2`
  font-size: 20px;
  margin: 0;
  word-break: break-word;
  color: #24292e;
  background: linear-gradient(90deg, #24292e, #0366d6);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 600;
  letter-spacing: 0.5px;
  
  @media (max-width: 480px) {
    font-size: 18px;
  }
`;

const NoRepositories = styled.div`
  text-align: center;
  padding: 20px;
  color: #586069;
`;

const RepositoryList: React.FC<RepositoryListProps> = ({ repositories, username, isLoading, isMobile = false }) => {
  if (isLoading) {
    return (
      <div>
        {!isMobile && (
          <UserHeader>
            <Username>{username}'s Repositories</Username>
          </UserHeader>
        )}
        <LoadingMessage>Loading repositories...</LoadingMessage>
      </div>
    );
  }

  if (repositories.length === 0 && !isLoading) {
    return (
      <div>
        {!isMobile && (
          <UserHeader>
            <Username>{username}'s Repositories</Username>
          </UserHeader>
        )}
        <NoRepositories>No repositories found</NoRepositories>
      </div>
    );
  }

  return (
    <div>
      {!isMobile && (
        <UserHeader>
          <Username>{username}'s Repositories</Username>
        </UserHeader>
      )}
      {repositories.map(repo => (
        <RepositoryItem key={repo.id} data-testid="repository-item">
          <StarCount>
          {repo.stargazers_count}
            <StarIcon>⭐</StarIcon>
          </StarCount>
          <RepositoryTitle>
            <a href={repo.html_url} target="_blank" rel="noopener noreferrer" data-testid="repo-link">
              {repo.name}
            </a>
          </RepositoryTitle>
          {repo.description && (
            <RepositoryDescription>{repo.description}</RepositoryDescription>
          )}
        </RepositoryItem>
      ))}
    </div>
  );
};

export default RepositoryList;
