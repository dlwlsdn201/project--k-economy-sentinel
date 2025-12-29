import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { App } from './app';

describe('App', () => {
  it('renders dashboard page', () => {
    render(<App />);
    const header = screen.getByText('K-Economy Sentinel');
    expect(header).toBeInTheDocument();
  });

  it('renders footer', () => {
    render(<App />);
    const footer = screen.getByText(/한국 경제 파수꾼/i);
    expect(footer).toBeInTheDocument();
  });
});
