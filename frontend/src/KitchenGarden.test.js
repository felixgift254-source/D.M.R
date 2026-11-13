import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import KitchenGarden from './components/KitchenGarden';
import { AuthProvider } from './context/AuthContext';

const mockGuides = [
  {
    id: 'guide-sukuma-id',
    title: 'Container Sukuma Wiki',
    description: 'Grow kale easily in small containers.',
    plantType: 'Leafy Green',
    difficulty: 'Easy',
    timeToHarvest: '30 days',
    plantingMethods: 'Sow seeds in small nursery, transplant after 3 weeks.',
    companionPlants: 'Onions, Beans',
    growingConditions: 'Full sun, rich loamy soil'
  }
];

const mockCrops = [
  {
    id: 'crop-1',
    userId: 'mock-user-id',
    gardenGuideId: 'guide-sukuma-id',
    plantingDate: '2026-10-01T00:00:00.000Z',
    expectedHarvestDate: '2026-10-31T00:00:00.000Z',
    status: 'GROWING',
    gardenGuide: {
      id: 'guide-sukuma-id',
      title: 'Container Sukuma Wiki',
      companionPlants: 'Onions, Beans'
    }
  }
];

describe('KitchenGarden Component', () => {
  beforeEach(() => {
    global.fetch = jest.fn((url) => {
      if (url === '/api/garden') {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve(mockGuides)
        });
      }
      if (url === '/api/garden/my-crops') {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve(mockCrops)
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

  test('renders guide library tab by default and fetches /api/garden', async () => {
    render(
      <AuthProvider>
        <BrowserRouter>
          <KitchenGarden />
        </BrowserRouter>
      </AuthProvider>
    );

    expect(screen.getByText(/Garden Planner/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Guide Library/i })).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Container Sukuma Wiki')).toBeInTheDocument();
      expect(screen.getByText(/Grow kale easily in small containers/i)).toBeInTheDocument();
    });
  });

  test('switches to My Garden tab and loads crops from /api/garden/my-crops', async () => {
    render(
      <AuthProvider>
        <BrowserRouter>
          <KitchenGarden />
        </BrowserRouter>
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Container Sukuma Wiki')).toBeInTheDocument();
    });

    const myGardenTab = screen.getByRole('button', { name: /My Garden/i });
    fireEvent.click(myGardenTab);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/garden/my-crops',
        expect.objectContaining({ credentials: 'include' })
      );
      expect(screen.getByText('GROWING')).toBeInTheDocument();
    });
  });
});
