import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import EduHub from './components/EduHub';

const mockArticles = [
  {
    id: 'art-1',
    title: 'The Personal Fat Threshold & Liver Fat Dynamics',
    type: 'article',
    isLowData: true,
    content: JSON.stringify({
      category: 'Pathophysiology',
      readTime: '5 min read',
      summary: 'Discover why Type 2 Diabetes is primarily driven by ectopic fat overflow.',
      takeaways: ['Type 2 Diabetes is caused by ectopic fat storage exceeding PFT.'],
      body: '### The Twin Cycle Hypothesis\nDetailed explanation of liver and pancreatic fat.',
      sources: [
        {
          title: 'DiRECT trial',
          authors: 'Taylor R, et al.',
          journal: 'The Lancet',
          year: '2018',
          doi: 'https://doi.org/10.1016/S0140-6736(17)33102-1'
        }
      ]
    })
  },
  {
    id: 'art-2',
    title: 'The 1-2-3 Metabolic Reversal Protocol',
    type: 'article',
    isLowData: true,
    content: JSON.stringify({
      category: 'Clinical Protocol',
      readTime: '6 min read',
      summary: 'A structured clinical guide to navigating the 3 phases of metabolic remission.',
      takeaways: ['Phase 1 focuses on rapid liver fat depletion.'],
      body: '### 3 Remission Phases\nPhase 1, Phase 2, Phase 3 details.',
      sources: [
        {
          title: 'Durability of a primary care-led weight-management intervention',
          authors: 'Lean ME, et al.',
          journal: 'The Lancet Diabetes & Endocrinology',
          year: '2019',
          doi: 'https://doi.org/10.1016/S0140-6736(19)30684-3'
        }
      ]
    })
  }
];

describe('EduHub Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn((url) => {
      if (url.includes('/api/education')) {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve(mockArticles)
        });
      }
      return Promise.resolve({
        ok: false,
        status: 404,
        json: () => Promise.resolve({ error: 'Not found' })
      });
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('renders Education Hub and lists educational articles', async () => {
    render(<EduHub />);

    expect(screen.getByText('Education Hub')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('The Personal Fat Threshold & Liver Fat Dynamics')).toBeInTheDocument();
      expect(screen.getByText('The 1-2-3 Metabolic Reversal Protocol')).toBeInTheDocument();
    });
  });

  test('opens article detail reader modal with takeaways and peer-reviewed sources when card is clicked', async () => {
    render(<EduHub />);

    await waitFor(() => {
      expect(screen.getByText('The Personal Fat Threshold & Liver Fat Dynamics')).toBeInTheDocument();
    });

    // Click on the article card
    const articleCard = screen.getByText('The Personal Fat Threshold & Liver Fat Dynamics').closest('[role="button"]');
    fireEvent.click(articleCard);

    // Modal should now be open
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText(/Key Clinical Takeaways/i)).toBeInTheDocument();
      expect(screen.getByText('Type 2 Diabetes is caused by ectopic fat storage exceeding PFT.')).toBeInTheDocument();
      expect(screen.getByText(/Peer-Reviewed Sources & Clinical Trials/i)).toBeInTheDocument();
      expect(screen.getByText('DiRECT trial')).toBeInTheDocument();
      expect(screen.getByText(/The Lancet/i)).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /View DOI Reference/i })).toHaveAttribute('href', 'https://doi.org/10.1016/S0140-6736(17)33102-1');
    });

    // Close modal
    const closeBtn = screen.getByRole('button', { name: /Close Guide/i });
    fireEvent.click(closeBtn);

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  test('filters articles by category when category pill is selected', async () => {
    render(<EduHub />);

    await waitFor(() => {
      expect(screen.getByText('The Personal Fat Threshold & Liver Fat Dynamics')).toBeInTheDocument();
    });

    // Click Clinical Protocol category pill
    const protocolPill = screen.getByRole('button', { name: 'Clinical Protocol' });
    fireEvent.click(protocolPill);

    await waitFor(() => {
      expect(screen.queryByText('The Personal Fat Threshold & Liver Fat Dynamics')).not.toBeInTheDocument();
      expect(screen.getByText('The 1-2-3 Metabolic Reversal Protocol')).toBeInTheDocument();
    });
  });

  test('filters articles using the search input', async () => {
    render(<EduHub />);

    await waitFor(() => {
      expect(screen.getByText('The Personal Fat Threshold & Liver Fat Dynamics')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/Search articles, topics, or guidelines/i);
    fireEvent.change(searchInput, { target: { value: 'reversal protocol' } });

    await waitFor(() => {
      expect(screen.queryByText('The Personal Fat Threshold & Liver Fat Dynamics')).not.toBeInTheDocument();
      expect(screen.getByText('The 1-2-3 Metabolic Reversal Protocol')).toBeInTheDocument();
    });
  });
});
