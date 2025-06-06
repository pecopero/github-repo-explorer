import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Search from './Search';

describe('Search Component', () => {
  const mockOnSearch = jest.fn();
  
  beforeEach(() => {
    mockOnSearch.mockClear();
  });

  test('renders search input and button', () => {
    render(<Search onSearch={mockOnSearch} isLoading={false} />);
    
    expect(screen.getByPlaceholderText('Enter username')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
  });
  
  test('calls onSearch when form is submitted', async () => {
    render(<Search onSearch={mockOnSearch} isLoading={false} />);
    
    const input = screen.getByPlaceholderText('Enter username');
    const button = screen.getByRole('button', { name: /search/i });
    
    await userEvent.type(input, 'testuser');
    fireEvent.click(button);
    
    expect(mockOnSearch).toHaveBeenCalledWith('testuser');
  });
  
  test('disables button when input is empty', () => {
    render(<Search onSearch={mockOnSearch} isLoading={false} />);
    
    const button = screen.getByRole('button', { name: /search/i });
    
    expect(button).toBeDisabled();
  });
  
  test('disables input and button when loading', () => {
    render(<Search onSearch={mockOnSearch} isLoading={true} />);
    
    const input = screen.getByPlaceholderText('Enter username');
    const button = screen.getByRole('button', { name: /searching\.\.\./i });
    
    expect(input).toBeDisabled();
    expect(button).toBeDisabled();
  });
});
