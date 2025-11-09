import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';

interface AnimeGenresProps {
  genres: { mal_id: number; name: string }[];
  onGenreSelect: (genre: { mal_id: number; name: string }) => void;
}

const AnimeGenres: React.FC<AnimeGenresProps> = ({ genres, onGenreSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState<{ mal_id: number; name: string } | null>(null);

  const toggleDropdown = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  }, []);

  const handleGenreClick = (genre: { mal_id: number; name: string }) => {
    setSelectedGenre(genre);
    onGenreSelect(genre);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = () => setIsOpen(false);
    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
    }
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isOpen]);

  return (
    <div className="relative px-5 sm:px-5">
      <button
        className="flex items-center bg-utils text-gray-400 px-4 py-2 rounded w-full sm:w-auto"
        onClick={toggleDropdown}
        onTouchStart={toggleDropdown} 
        >
        {selectedGenre ? selectedGenre.name : 'Filtro de Categorias'}
        <svg
          aria-hidden="true"
          focusable="false"
          data-prefix="fas"
          data-icon="chevron-down"
          role="img"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 448 512"
          className="w-3.5 h-3.5 ml-2"
        >
          <path
            fill="currentColor"
            d="M207.029 381.476L12.686 187.132c-9.373-9.373-9.373-24.569 0-33.941l22.667-22.667c9.357-9.357 24.522-9.375 33.901-.04L224 284.505l154.745-154.021c9.379-9.335 24.544-9.317 33.901.04l22.667 22.667c9.373 9.373 9.373 24.569 0 33.941L240.971 381.476c-9.373 9.372-24.569 9.372-33.942 0z"
          ></path>
        </svg>
      </button>

      {isOpen && (
        <div className="absolute mt-2 w-full sm:w-48 bg-utils border border-gray-600 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
          <ul className="py-1">
            {genres.map((genre) => (
              <li
                key={`${genre.mal_id}-${genre.name}`}
                className="px-4 py-2 text-gray-400 hover:bg-gray-700 cursor-pointer"
                onClick={() => handleGenreClick(genre)}
                onTouchStart={() => handleGenreClick(genre)}
              >
                {genre.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

AnimeGenres.propTypes = {
  genres: PropTypes.arrayOf(
    PropTypes.shape({
      mal_id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  onGenreSelect: PropTypes.func.isRequired,
};

export default AnimeGenres;