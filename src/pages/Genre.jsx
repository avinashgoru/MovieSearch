import { useParams } from 'react-router-dom';

const Genre = () => {
  const { genreId } = useParams();
  
  return (
    <div className="py-24 px-8 text-center">
      <h1 className="text-4xl font-display">Genre</h1>
      <p className="text-secondary mt-4">Movies for genre: {genreId} coming soon.</p>
    </div>
  );
};

export default Genre;
