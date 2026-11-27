import React from 'react';
import { render, screen, act } from '@testing-library/react';
import Dashboard from './components/Dashboard';
import { AuthProvider } from './context/AuthContext';

describe('Dashboard Component - Blood Glucose Testing Guide', () => {
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
          json: () => Promise.resolve({ history: [] })
        });
      }
      return Promise.resolve({
        ok: false,
        status: 401,
        json: () => Promise.resolve({ error: 'Unauthorized' })
      });
    });
  });

  test('renders Metabolic Control Dashboard and Blood Glucose Testing steps', async () => {
    await act(async () => {
      render(
        <AuthProvider>
          <Dashboard currentPhase="PHASE_1" lastLogUpdate={null} />
        </AuthProvider>
      );
    });

    // Check heading
    expect(screen.getByText(/Metabolic Control Dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/Steps for Testing Blood Glucose/i)).toBeInTheDocument();

    // Check 8 testing steps
    expect(screen.getByText(/Wash and dry hands:/i)).toBeInTheDocument();
    expect(screen.getByText(/Prepare the lancing device:/i)).toBeInTheDocument();
    expect(screen.getByText(/Insert a test strip:/i)).toBeInTheDocument();
    expect(screen.getByText(/Prick the finger:/i)).toBeInTheDocument();
    expect(screen.getByText(/Collect a drop of blood:/i)).toBeInTheDocument();
    expect(screen.getByText(/Apply blood to the strip:/i)).toBeInTheDocument();
    expect(screen.getByText(/Read and record:/i)).toBeInTheDocument();
    expect(screen.getByText(/Dispose safely:/i)).toBeInTheDocument();

    // Check highlighted devices in maroon and bold
    const alcoholSwab = screen.getByText(/alcohol swab/i);
    expect(alcoholSwab).toHaveStyle('color: #800000');
    expect(alcoholSwab).toHaveClass('font-bold');

    const sharpsContainer = screen.getByText(/sharps container/i);
    expect(sharpsContainer).toHaveStyle('color: #800000');
    expect(sharpsContainer).toHaveClass('font-bold');
  });
});
