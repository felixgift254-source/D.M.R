import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import { AuthProvider } from './context/AuthContext';

const renderLoginPage = (props = {}) => {
  return render(
    <AuthProvider>
      <BrowserRouter>
        <LoginPage {...props} />
      </BrowserRouter>
    </AuthProvider>
  );
};

describe('LoginPage Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders both portal options: Patient Portal and Clinician Portal', () => {
    renderLoginPage();

    // Check portal toggle buttons with exact names
    const patientTab = screen.getByRole('button', { name: /^Patient Portal$/i });
    const clinicianTab = screen.getByRole('button', { name: /^Clinician Portal$/i });

    expect(patientTab).toBeInTheDocument();
    expect(clinicianTab).toBeInTheDocument();
  });

  test('defaults to Patient Portal and displays patient context', () => {
    renderLoginPage();

    expect(screen.getByRole('heading', { level: 2, name: /Patient Sign In/i })).toBeInTheDocument();
    expect(screen.getByText(/Personal Reversal Tracker for Type 2 Diabetes/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign In to Patient Portal/i })).toBeInTheDocument();
  });

  test('switches to Clinician Portal when clicking the Clinician tab', () => {
    renderLoginPage();

    const clinicianTab = screen.getByRole('button', { name: /^Clinician Portal$/i });
    fireEvent.click(clinicianTab);

    expect(screen.getByRole('heading', { level: 2, name: /Clinician Care Sign In/i })).toBeInTheDocument();
    expect(screen.getByText(/Clinical Care System/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign In to Clinician Portal/i })).toBeInTheDocument();
  });

  test('has accessible, semantic form inputs with autocomplete attributes', () => {
    renderLoginPage();

    const emailInput = screen.getByLabelText(/^Email Address$/i);
    const passwordInput = document.getElementById('login-password');

    expect(emailInput).toHaveAttribute('type', 'email');
    expect(emailInput).toHaveAttribute('autocomplete', 'username');
    expect(emailInput).toHaveAttribute('required');

    expect(passwordInput).toHaveAttribute('type', 'password');
    expect(passwordInput).toHaveAttribute('autocomplete', 'current-password');
    expect(passwordInput).toHaveAttribute('required');
  });

  test('toggles password visibility with accessible button', () => {
    renderLoginPage();

    const passwordInput = document.getElementById('login-password');
    expect(passwordInput).toHaveAttribute('type', 'password');

    const toggleButton = screen.getByLabelText(/Show password/i);
    fireEvent.click(toggleButton);

    expect(passwordInput).toHaveAttribute('type', 'text');
    expect(screen.getByLabelText(/Hide password/i)).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText(/Hide password/i));
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  test('populates Patient demo credentials with 1 click', () => {
    renderLoginPage();

    const patientDemoBtn = screen.getByRole('button', { name: /Patient Demo/i });
    fireEvent.click(patientDemoBtn);

    const emailInput = screen.getByLabelText(/^Email Address$/i);
    const passwordInput = document.getElementById('login-password');

    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('password123');
    expect(screen.getByRole('heading', { level: 2, name: /Patient Sign In/i })).toBeInTheDocument();
  });

  test('populates Clinician demo credentials with 1 click', () => {
    renderLoginPage();

    const doctorDemoBtn = screen.getByRole('button', { name: /Clinician Demo/i });
    fireEvent.click(doctorDemoBtn);

    const emailInput = screen.getByLabelText(/^Email Address$/i);
    const passwordInput = document.getElementById('login-password');

    expect(emailInput.value).toBe('doctor@example.com');
    expect(passwordInput.value).toBe('password123');
    expect(screen.getByRole('heading', { level: 2, name: /Clinician Care Sign In/i })).toBeInTheDocument();
  });

  test('allows switching between Sign In, Create Account, and Forgot Password modes', () => {
    renderLoginPage();

    // Switch to Create Account
    const createAccountBtn = screen.getByRole('button', { name: /Create an account/i });
    fireEvent.click(createAccountBtn);

    expect(screen.getByRole('heading', { level: 2, name: /Create Patient Account/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Create Patient Account/i })).toBeInTheDocument();

    // Switch back to Sign In
    const signInInsteadBtn = screen.getByRole('button', { name: /Sign in instead/i });
    fireEvent.click(signInInsteadBtn);
    expect(screen.getByRole('heading', { level: 2, name: /Patient Sign In/i })).toBeInTheDocument();

    // Switch to Forgot Password
    const forgotBtn = screen.getByRole('button', { name: /Forgot password\?/i });
    fireEvent.click(forgotBtn);
    expect(screen.getByRole('heading', { level: 2, name: /Reset Account Password/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Send Password Reset Link/i })).toBeInTheDocument();
  });
});
