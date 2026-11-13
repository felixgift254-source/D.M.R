import React from 'react';

export const BrowserRouter = ({ children }) => <>{children}</>;
export const MemoryRouter = ({ children }) => <>{children}</>;
export const Router = ({ children }) => <>{children}</>;
export const Routes = ({ children }) => <>{children}</>;
export const Route = ({ element }) => element || null;
export const Outlet = ({ context }) => <div data-testid="outlet" />;

export const Link = ({ to, children, ...props }) => (
  <a href={to} {...props}>
    {children}
  </a>
);

export const useLocation = () => ({
  pathname: window.location.pathname || '/',
  search: window.location.search || '',
  hash: window.location.hash || ''
});

export const useNavigate = () => jest.fn();

export const useSearchParams = () => {
  const params = new URLSearchParams(window.location.search);
  return [params, jest.fn()];
};
