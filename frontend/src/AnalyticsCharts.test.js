import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import AnalyticsCharts from './components/AnalyticsCharts';
import { AuthProvider } from './context/AuthContext';

const mockLogs = [
  {
    id: 'log-1',
    loggedAt: '2026-11-12T08:00:00Z',
    glucose: 5.8,
    weight: 71.0
  },
  {
    id: 'log-2',
    loggedAt: '2026-11-13T08:00:00Z',
    glucose: 5.2,
    weight: 70.4
  }
];

describe('AnalyticsCharts Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn((url) => {
      if (url.includes('/api/auth/refresh')) {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve({ token: 'mock-valid-token' })
        });
      }
      if (url.includes('/api/auth/me')) {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve({ user: { id: 'mock-user-id', email: 'test@example.com', role: 'PATIENT' } })
        });
      }
      if (url.includes('/api/logs/history')) {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve({ history: mockLogs })
        });
      }
      return Promise.resolve({
        ok: false,
        status: 401,
        json: () => Promise.resolve({ error: 'Unauthorized' })
      });
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('renders AnalyticsCharts with real user history from /api/logs/history', async () => {
    render(
      <AuthProvider>
        <AnalyticsCharts />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Reversal Analytics & Trends/i)).toBeInTheDocument();
      expect(screen.getByText(/5.2 mmol\/L/i)).toBeInTheDocument();
      expect(screen.getByText(/Tracking 2 logged entries/i)).toBeInTheDocument();
    });
  });

  test('switches metric to weight and shows weight data', async () => {
    render(
      <AuthProvider>
        <AnalyticsCharts />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/5.2 mmol\/L/i)).toBeInTheDocument();
    });

    const weightBtn = screen.getByRole('button', { name: /^Weight$/i });
    fireEvent.click(weightBtn);

    await waitFor(() => {
      expect(screen.getByText(/70.4 kg/i)).toBeInTheDocument();
    });
  });

  test('switches to Table View and renders log history table', async () => {
    render(
      <AuthProvider>
        <AnalyticsCharts />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Tracking 2 logged entries/i)).toBeInTheDocument();
    });

    const tableToggle = screen.getByTitle('Log History Table');
    fireEvent.click(tableToggle);

    await waitFor(() => {
      expect(screen.getByRole('columnheader', { name: /Fasting Glucose/i })).toBeInTheDocument();
      expect(screen.getAllByText(/5.8 mmol\/L/i).length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText(/5.2 mmol\/L/i).length).toBeGreaterThanOrEqual(1);
    });
  });

  test('re-fetches when health-log-updated window event is fired', async () => {
    render(
      <AuthProvider>
        <AnalyticsCharts />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/5.2 mmol\/L/i)).toBeInTheDocument();
    });

    const updatedLogs = [
      ...mockLogs,
      {
        id: 'log-3',
        loggedAt: '2026-11-13T12:00:00Z',
        glucose: 4.9,
        weight: 70.0
      }
    ];

    global.fetch = jest.fn((url) => {
      if (url.includes('/api/auth/refresh')) {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve({ token: 'mock-valid-token' })
        });
      }
      if (url.includes('/api/auth/me')) {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve({ user: { id: 'mock-user-id', email: 'test@example.com', role: 'PATIENT' } })
        });
      }
      if (url.includes('/api/logs/history')) {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve({ history: updatedLogs })
        });
      }
      return Promise.resolve({
        ok: false,
        status: 401,
        json: () => Promise.resolve({ error: 'Unauthorized' })
      });
    });

    act(() => {
      window.dispatchEvent(new CustomEvent('health-log-updated'));
    });

    await waitFor(() => {
      expect(screen.getByText(/4.9 mmol\/L/i)).toBeInTheDocument();
      expect(screen.getByText(/Tracking 3 logged entries/i)).toBeInTheDocument();
    });
  });

  test('displays Hypoglycemia Alert banner and Rule of 15 instructions when latest glucose <= 4.0 mmol/L', async () => {
    const hypoLogs = [
      { id: 'h1', loggedAt: '2026-11-12T08:00:00Z', glucose: 5.5, weight: 70.0 },
      { id: 'h2', loggedAt: '2026-11-13T08:00:00Z', glucose: 3.8, weight: 69.8 }
    ];

    global.fetch = jest.fn((url) => {
      if (url.includes('/api/auth/refresh')) {
        return Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve({ token: 'mock-valid-token' }) });
      }
      if (url.includes('/api/auth/me')) {
        return Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve({ user: { id: 'mock-user-id', email: 'test@example.com', role: 'PATIENT' } }) });
      }
      if (url.includes('/api/logs/history')) {
        return Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve({ history: hypoLogs }) });
      }
      return Promise.resolve({ ok: false, status: 401, json: () => Promise.resolve({ error: 'Unauthorized' }) });
    });

    render(
      <AuthProvider>
        <AnalyticsCharts />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Hypoglycemia Alert \(≤ 4.0 mmol\/L\)/i)).toBeInTheDocument();
      expect(screen.getByText(/Rule of 15/i)).toBeInTheDocument();
      expect(screen.getByText(/test your glucose after 15 minutes/i)).toBeInTheDocument();
      expect(screen.getByText(/sent to your supervising clinician/i)).toBeInTheDocument();
    });

    // Check SVG threshold line
    expect(screen.getByText(/Hypo Alert \(≤ 4.0\) — Retest 15m/i)).toBeInTheDocument();
  });

  test('displays Hyperglycemia Risk Alert banner when latest glucose >= 11.1 mmol/L', async () => {
    const hyperLogs = [
      { id: 'hy1', loggedAt: '2026-11-12T08:00:00Z', glucose: 6.0, weight: 72.0 },
      { id: 'hy2', loggedAt: '2026-11-13T08:00:00Z', glucose: 11.5, weight: 72.2 }
    ];

    global.fetch = jest.fn((url) => {
      if (url.includes('/api/auth/refresh')) {
        return Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve({ token: 'mock-valid-token' }) });
      }
      if (url.includes('/api/auth/me')) {
        return Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve({ user: { id: 'mock-user-id', email: 'test@example.com', role: 'PATIENT' } }) });
      }
      if (url.includes('/api/logs/history')) {
        return Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve({ history: hyperLogs }) });
      }
      return Promise.resolve({ ok: false, status: 401, json: () => Promise.resolve({ error: 'Unauthorized' }) });
    });

    render(
      <AuthProvider>
        <AnalyticsCharts />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Hyperglycemia Risk Alert \(≥ 11.1 mmol\/L\)/i)).toBeInTheDocument();
      expect(screen.getByText(/Drink plenty of water to help flush excess glucose/i)).toBeInTheDocument();
      expect(screen.getByText(/logged on your clinician portal/i)).toBeInTheDocument();
    });

    // Check SVG threshold line and legend footer
    expect(screen.getAllByText(/Hyperglycemia Risk \(≥ 11.1\)/i).length).toBeGreaterThanOrEqual(1);
  });
});
