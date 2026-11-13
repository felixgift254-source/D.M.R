import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import WeeklyMealPlan from './components/WeeklyMealPlan';
import { AuthProvider } from './context/AuthContext';

const mockMealPlan = [
  {
    id: 'meal-1',
    dayOfWeek: 'Monday',
    mealType: 'Breakfast',
    recipe: {
      id: 'rec-1',
      name: 'Sukuma Wiki & Egg Scramble',
      description: 'Low-carb breakfast with rich iron and vitamins.',
      carbsPerServing: 5.0,
      ingredients: [
        { id: 'ing-1', name: 'Eggs', isGrowable: false, isActiveGardenCrop: false },
        { id: 'ing-2', name: 'Sukuma Wiki', isGrowable: true, isActiveGardenCrop: true }
      ]
    }
  }
];

describe('WeeklyMealPlan Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn((url, options) => {
      if (url.includes('/api/auth/refresh')) {
        return Promise.resolve({ ok: false, status: 401 });
      }
      if (url.includes('/generate') && options?.method === 'POST') {
        return Promise.resolve({
          ok: true,
          status: 201,
          json: () =>
            Promise.resolve({
              mealPlan: [
                ...mockMealPlan,
                {
                  id: 'meal-2',
                  dayOfWeek: 'Monday',
                  mealType: 'Lunch',
                  recipe: {
                    id: 'rec-2',
                    name: 'Grilled Tilapia with Kachumbari',
                    description: 'Fresh tilapia with diced tomatoes and onions.',
                    carbsPerServing: 4.5,
                    ingredients: [
                      { id: 'ing-3', name: 'Tilapia Fillet', isGrowable: false, isActiveGardenCrop: false }
                    ]
                  }
                }
              ]
            })
        });
      }
      if (url.includes('/api/meal-plan')) {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve({ mealPlan: mockMealPlan })
        });
      }
      return Promise.reject(new Error('Unknown URL: ' + url));
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('loads and displays the weekly meal plan', async () => {
    render(
      <AuthProvider>
        <BrowserRouter>
          <WeeklyMealPlan />
        </BrowserRouter>
      </AuthProvider>
    );

    // Verify day and recipe title appear after fetch
    await waitFor(() => {
      expect(screen.getByText(/Sukuma Wiki & Egg Scramble/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/5g carbs/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: /Monday/i })).toBeInTheDocument();
    expect(screen.getAllByText(/Growing/i)[0]).toBeInTheDocument();
  });

  test('regenerates the meal plan when clicking Regenerate Plan', async () => {
    render(
      <AuthProvider>
        <BrowserRouter>
          <WeeklyMealPlan />
        </BrowserRouter>
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Sukuma Wiki & Egg Scramble/i)).toBeInTheDocument();
    });

    const regenerateBtn = screen.getByRole('button', { name: /Regenerate Plan/i });
    fireEvent.click(regenerateBtn);

    await waitFor(() => {
      expect(screen.getByText(/Grilled Tilapia with Kachumbari/i)).toBeInTheDocument();
    });
  });

  test('renders error state with retry button when fetch fails', async () => {
    global.fetch = jest.fn((url) => {
      if (url.includes('/api/auth/refresh')) {
        return Promise.resolve({ ok: false, status: 401 });
      }
      return Promise.reject(new Error('Failed to fetch'));
    });

    render(
      <AuthProvider>
        <BrowserRouter>
          <WeeklyMealPlan />
        </BrowserRouter>
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Failed to fetch/i)).toBeInTheDocument();
    });

    expect(screen.getByRole('button', { name: /Retry/i })).toBeInTheDocument();
  });
});
