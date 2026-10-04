import { Routes, Route } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import Home from './pages/Home';
import Search from './pages/Search';
import Discover from './pages/Discover';
import MovieDetails from './pages/MovieDetails';
import Genre from './pages/Genre';
import Watchlist from './pages/Watchlist';
import NotFound from './pages/NotFound';
import { WatchlistProvider } from './contexts/WatchlistContext';

function App() {
  return (
    <WatchlistProvider>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Home />} />
          <Route path="search" element={<Search />} />
          <Route path="discover" element={<Discover />} />
          <Route path="movie/:id" element={<MovieDetails />} />
          <Route path="genre/:genreId" element={<Genre />} />
          <Route path="watchlist" element={<Watchlist />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </WatchlistProvider>
  );
}

export default App;
