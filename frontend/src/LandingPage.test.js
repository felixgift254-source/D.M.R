import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LandingPage from './components/LandingPage';

describe('LandingPage Component', () => {
  const renderLandingPage = () => {
    return render(
      <BrowserRouter>
        <LandingPage />
      </BrowserRouter>
    );
  };

  test('renders Section 1: Executive summary at top and action buttons', () => {
    renderLandingPage();

    expect(screen.getByText(/Diabetes \(II\) metabolic reversal platform/i)).toBeInTheDocument();
    expect(
      screen.getByRole('heading', {
        level: 1,
        name: /Reversing Type 2 Diabetes Through Targeted Nutrition & Lifestyle/i
      })
    ).toBeInTheDocument();

    // Check 1 concise paragraph
    expect(
      screen.getByText(/The Digital Metabolic Reversal \(DMR\) System is a clinical lifestyle platform tailored for Kenya/i)
    ).toBeInTheDocument();

    // Check action gateways
    expect(screen.getByRole('link', { name: /Access Patient Portal/i })).toHaveAttribute('href', '/patient');
    expect(screen.getByRole('link', { name: /Clinician Care Portal/i })).toHaveAttribute('href', '/doctor');
    expect(screen.getByRole('link', { name: /Sign In \/ Register/i })).toHaveAttribute('href', '/login');
  });

  test('renders Section 2: Sub-Saharan Africa and Kenya crisis', () => {
    renderLandingPage();

    expect(
      screen.getByRole('heading', {
        level: 2,
        name: /The Sub-Saharan Africa & Kenyan Diabetes Crisis/i
      })
    ).toBeInTheDocument();

    expect(screen.getByText(/Sub-Saharan Africa faces the world's fastest-growing diabetes crisis/i)).toBeInTheDocument();
    expect(screen.getByText(/129% Surge/i)).toBeInTheDocument();
    expect(screen.getByText(/54%\+ Undiagnosed/i)).toBeInTheDocument();
    expect(screen.getByText(/30%–50%/i)).toBeInTheDocument();
  });

  test('renders Section 3: How patients get affected and organ interaction', () => {
    renderLandingPage();

    expect(
      screen.getByRole('heading', {
        level: 2,
        name: /How a Patient Gets Affected: Progression & Complications/i
      })
    ).toBeInTheDocument();

    // Check interactive organ buttons
    const kidneysButton = screen.getByRole('button', { name: /Kidneys/i });
    expect(kidneysButton).toBeInTheDocument();
    fireEvent.click(kidneysButton);

    expect(screen.getByText(/Diabetic Nephropathy/i)).toBeInTheDocument();
    expect(screen.getByText(/Dialysis costs KES 9,500\/session in Kenya/i)).toBeInTheDocument();

    const eyesButton = screen.getByRole('button', { name: /Eyes/i });
    fireEvent.click(eyesButton);
    expect(screen.getByRole('heading', { level: 4, name: /Diabetic Retinopathy/i })).toBeInTheDocument();
  });

  test('renders Section 4: Medications and limitations comparison', () => {
    renderLandingPage();

    expect(
      screen.getByRole('heading', {
        level: 2,
        name: /Medications Used to Manage Diabetes & Their Limitations/i
      })
    ).toBeInTheDocument();

    expect(screen.getByText(/Conventional diabetes care routinely prescribes Biguanides \(Metformin\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Standard Medical Management/i)).toBeInTheDocument();
    expect(screen.getByText(/DMR Nutritional Reversal/i)).toBeInTheDocument();
  });

  test('renders Section 5: Simple 3-step explanation of reversal', () => {
    renderLandingPage();

    expect(
      screen.getByRole('heading', {
        level: 3,
        name: /How Reversal Works: Unclogging the Organs/i
      })
    ).toBeInTheDocument();

    expect(screen.getByText(/Type 2 diabetes is not a permanent life sentence/i)).toBeInTheDocument();
    expect(screen.getByText(/Unclog the Liver/i)).toBeInTheDocument();
    expect(screen.getByText(/Clear the Pancreas/i)).toBeInTheDocument();
    expect(screen.getByText(/Cells Wake Up/i)).toBeInTheDocument();
  });

  test('renders Section 6: Priority 3-Phase Remission Protocol with interactive tabs', () => {
    renderLandingPage();

    expect(
      screen.getByRole('heading', {
        level: 3,
        name: /The 3-Phase Remission Protocol/i
      })
    ).toBeInTheDocument();

    expect(screen.getByText(/DMR operationalizes diabetes reversal through an evidence-based 3-Phase clinical protocol/i)).toBeInTheDocument();

    // Default Phase 1
    expect(screen.getByText(/Phase 1: Rapid Ectopic Fat Depletion \(Weeks 1 – 12\)/i)).toBeInTheDocument();

    // Click Phase 2
    const phase2Btn = screen.getByRole('button', { name: /Phase 2: Reintroduction/i });
    fireEvent.click(phase2Btn);
    expect(screen.getByText(/Phase 2: Stepped Food Reintroduction \(Weeks 13 – 18\)/i)).toBeInTheDocument();

    // Click Phase 3
    const phase3Btn = screen.getByRole('button', { name: /Phase 3: Maintenance/i });
    fireEvent.click(phase3Btn);
    expect(screen.getByText(/Phase 3: Long-Term Metabolic Maintenance \(Ongoing\)/i)).toBeInTheDocument();
  });

  test('renders Section 7: Healthy Foods Local to East Africa', () => {
    renderLandingPage();

    expect(
      screen.getByRole('heading', {
        level: 3,
        name: /Healthy Whole Foods Local to East Africa/i
      })
    ).toBeInTheDocument();

    expect(
      screen.getByAltText(/Array of healthy local foods: leafy vegetables, lean proteins, and low-glycemic fruits/i)
    ).toBeInTheDocument();
  });

  test('renders Section 8: Lifestyle habits and Final Action Gateways with Medical Governance', () => {
    renderLandingPage();

    expect(
      screen.getByRole('heading', {
        level: 3,
        name: /Daily Lifestyle Habits for Lasting Health/i
      })
    ).toBeInTheDocument();

    expect(screen.getByText(/Post-Meal Walking/i)).toBeInTheDocument();
    expect(screen.getByText(/7–8h Deep Sleep/i)).toBeInTheDocument();

    // Final Action CTAs
    expect(screen.getByRole('link', { name: /Open Patient Portal/i })).toHaveAttribute('href', '/patient');
    expect(screen.getByRole('link', { name: /Open Clinician Portal/i })).toHaveAttribute('href', '/doctor');

    // Clinical Governance
    expect(screen.getByText(/Clinical Safety Governance:/i)).toBeInTheDocument();
  });
});
