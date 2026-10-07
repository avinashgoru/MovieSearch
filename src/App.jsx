import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import Home from './pages/Home';
import { WatchlistProvider } from './contexts/WatchlistContext';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/layout/ProtectedRoute';

// Lazy loaded routes
const Search = React.lazy(() => import('./pages/Search'));
const Discover = React.lazy(() => import('./pages/Discover'));
const MovieDetails = React.lazy(() => import('./pages/MovieDetails'));
const Genre = React.lazy(() => import('./pages/Genre'));
const Watchlist = React.lazy(() => import('./pages/Watchlist'));
const Login = React.lazy(() => import('./pages/Login'));
const Register = React.lazy(() => import('./pages/Register'));
const NotFound = React.lazy(() => import('./pages/NotFound'));

// Minimal fallback to avoid layout flashes during split-chunk loading
const PageFallback = () => (
  <div className="flex-1 flex items-center justify-center min-h-[50vh]">
    <div className="w-5 h-5 border-[2px] border-accent/20 border-t-accent rounded-full animate-spin" />
  </div>
);

function App() {
  return (
    <AuthProvider>
      <WatchlistProvider>
        <Suspense fallback={<PageFallback />}>
          <Routes>
            <Route path="/" element={<AppLayout />}>
              <Route index element={<Home />} />
              <Route path="search" element={<Search />} />
              <Route path="discover" element={<Discover />} />
              <Route path="movie/:id" element={<MovieDetails />} />
              <Route path="genre/:genreId" element={<Genre />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="watchlist" element={
                <ProtectedRoute>
                  <Watchlist />
                </ProtectedRoute>
              } />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Suspense>
      </WatchlistProvider>
    </AuthProvider>
  );
}

export default App;
