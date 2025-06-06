import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';

interface SearchProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
  error?: string;
}

const SearchContainer = styled.div`
  margin-bottom: 20px;
  width: 100%;
  animation: slideDown 0.6s ease-out;

  @keyframes slideDown {
    from { transform: translateY(-20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }

  @media (max-width: 480px) {
    margin-bottom: 16px;
  }
`;

const Title = styled.h1`
  font-size: 28px;
  margin-bottom: 22px;
  color: #24292e;
  position: relative;
  display: block;
  font-weight: 600;
  letter-spacing: 0.5px;
  background: linear-gradient(90deg, #24292e, #0366d6);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-align: center;

  &::after {
    content: '';
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    bottom: -6px;
    width: 60px;
    height: 3px;
    background: linear-gradient(90deg, #2188ff, transparent);
    border-radius: 2px;
  }

  @media (max-width: 768px) {
    font-size: 24px;
    margin-bottom: 18px;
  }

  @media (max-width: 480px) {
    font-size: 22px;
    margin-bottom: 16px;
  }
`;

const SearchForm = styled.form`
  display: flex;
  width: 100%;
  position: relative;
  z-index: 2;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08);
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
  margin-bottom: 16px;
  
  &:focus-within {
    box-shadow: 0 6px 18px rgba(33, 136, 255, 0.15);
    transform: translateY(-2px);
  }

  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #e1e4e8;
  border-right: none;
  border-radius: 8px 0 0 8px;
  font-size: 16px;
  transition: all 0.3s ease;
  z-index: 1;

  &:focus {
    outline: none;
    border-color: #0366d6;
    background-color: #fafbfc;
  }

  &::placeholder {
    color: #8b949e;
    transition: opacity 0.2s ease, transform 0.2s ease;
  }

  &:focus::placeholder {
    opacity: 0.7;
    transform: translateX(3px);
  }

  @media (max-width: 480px) {
    padding: 12px;
    font-size: 15px;
    border-radius: 8px 8px 0 0;
    border-right: 1px solid #e1e4e8;
    border-bottom: none;
  }
`;

const SearchButton = styled.button`
  padding: 12px 20px;
  background: linear-gradient(135deg, #2188ff, #0366d6);
  color: white;
  border: none;
  border-radius: 0 8px 8px 0;
  font-size: 16px;
  cursor: pointer;
  font-weight: 500;
  letter-spacing: 0.3px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: all 0.6s ease;
  }

  &:hover {
    background: linear-gradient(135deg, #0366d6, #044289);
    box-shadow: 0 2px 10px rgba(3, 102, 214, 0.3);

    &::before {
      left: 100%;
    }
  }

  &:active {
    transform: scale(0.98);
  }

  &:disabled {
    background-color: #b3d9ff;
    cursor: not-allowed;
  }

  @media (max-width: 480px) {
    padding: 12px;
    font-size: 15px;
    border-radius: 0 0 8px 8px;
  }
`;

const ErrorMessage = styled.div`
  padding: 12px 16px;
  color: #cb2431;
  background-color: rgba(203, 36, 49, 0.05);
  border: 1px solid rgba(203, 36, 49, 0.2);
  border-left: 4px solid #cb2431;
  border-radius: 4px;
  margin-top: 12px;
  margin-bottom: 16px;
  font-size: 15px;
  position: relative;
  animation: slideIn 0.3s ease-out;
  
  @keyframes slideIn {
    from { transform: translateY(-10px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
`;

const Search: React.FC<SearchProps> = ({ onSearch, isLoading, error }) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Focus the input field when component mounts
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <SearchContainer>
      <Title>GitHub Repository Explorer</Title>
      <SearchForm onSubmit={handleSubmit}>
        <SearchInput
          type="text"
          placeholder="Enter GitHub username..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          ref={inputRef}
          data-testid="search-input"
        />
        <SearchButton type="submit" disabled={isLoading} data-testid="search-button">
          {isLoading ? 'Searching...' : 'Search'}
        </SearchButton>
      </SearchForm>
      {error && <ErrorMessage data-testid="error-message">{error}</ErrorMessage>}
    </SearchContainer>
  );
};

export default Search;
