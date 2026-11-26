import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import PortalHeader from './components/PortalHeader';
import PatientNavigation from './components/PatientNavigation';
import ClinicianNavigation from './components/ClinicianNavigation';
import ClinicianGuard from './components/ClinicianGuard';
import { AuthProvider } from './context/AuthContext';

describe('Portal Separation & Navigation', () => {
  beforeEach(() => {
    // Mock fetch so silent refresh attempt finishes quickly with null
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        status: 401,
        json: () => Promise.resolve({ error: 'Unauthorized' })
      })
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('PortalHeader renders links to both Patient Portal and Clinician Portal', () => {
    render(
      <AuthProvider>
        <BrowserRouter>
          <PortalHeader />
        </BrowserRouter>
      </AuthProvider>
    );

    const patientLink = screen.getByRole('link', { name: /Patient Portal/i });
    const clinicianLink = screen.getByRole('link', { name: /Clinician Portal/i });

    expect(patientLink).toBeInTheDocument();
    expect(patientLink).toHaveAttribute('href', '/patient');
    expect(clinicianLink).toBeInTheDocument();
    expect(clinicianLink).toHaveAttribute('href', '/doctor');
  });

  test('PatientNavigation only contains patient-centric links and does not include clinician tab in primary nav', () => {
    render(
      <AuthProvider>
        <BrowserRouter>
          <PatientNavigation />
        </BrowserRouter>
      </AuthProvider>
    );

    expect(screen.getByRole('link', { name: /Dashboard/i })).toHaveAttribute('href', '/patient');
    expect(screen.getByRole('link', { name: /Meals & Diet/i })).toHaveAttribute('href', '/meals');
    expect(screen.getByRole('link', { name: /Kitchen Garden/i })).toHaveAttribute('href', '/garden');
    expect(screen.getByRole('link', { name: /EduHub/i })).toHaveAttribute('href', '/education');
    expect(screen.getByRole('link', { name: /Community/i })).toHaveAttribute('href', '/community');
    expect(screen.getByRole('link', { name: /My Health Profile/i })).toHaveAttribute('href', '/profile');

    // The primary navigation bar should not have a "Clinician" tab alongside meals/garden
    expect(screen.queryByRole('link', { name: /^Clinician$/i })).not.toBeInTheDocument();
  });

  test('ClinicianNavigation displays clinical branding and link back to Patient Portal', () => {
    render(
      <AuthProvider>
        <BrowserRouter>
          <ClinicianNavigation />
        </BrowserRouter>
      </AuthProvider>
    );

    expect(screen.getByText(/DMR Clinical Care/i)).toBeInTheDocument();
    expect(screen.getByText(/Provider Portal/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Patient Portal/i })).toHaveAttribute('href', '/patient');
  });

  test('ClinicianGuard blocks unauthenticated users and shows login prompt', async () => {
    render(
      <AuthProvider>
        <BrowserRouter>
          <ClinicianGuard>
            <div data-testid="doctor-content">Secret Doctor Content</div>
          </ClinicianGuard>
        </BrowserRouter>
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Clinician Authentication Required/i)).toBeInTheDocument();
    });

    expect(screen.queryByTestId('doctor-content')).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Sign In to Clinician Portal/i })).toHaveAttribute(
      'href',
      '/login?portal=doctor&redirect=/doctor'
    );
    expect(screen.getByRole('link', { name: /Return to Patient Portal/i })).toHaveAttribute('href', '/patient');
  });
});
