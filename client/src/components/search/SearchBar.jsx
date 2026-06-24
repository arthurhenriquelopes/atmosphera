import { useState, useEffect } from 'react';
import { useDebounce } from '../../hooks/useDebounce';
import { Search, MapPin } from 'lucide-react';
import './SearchBar.css';

export default function SearchBar({ onSearch, onUseLocation }) {
  const [input, setInput] = useState('');
  const debouncedSearchTerm = useDebounce(input, 600);

  // automatically trigger search after typing stops
  useEffect(() => {
    if (debouncedSearchTerm && debouncedSearchTerm.length > 2) {
      onSearch(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) onSearch(input.trim());
  };

  return (
    <div className="search-bar-wrapper">
      <form onSubmit={handleSubmit} className="search-form">
        <Search className="search-icon" size={20} />
        <input
          type="text"
          className="search-input"
          placeholder="Search city, zip, or coordinates..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </form>
      <button 
        type="button" 
        className="location-btn"
        onClick={onUseLocation}
        title="Use my location"
      >
        <MapPin size={20} />
      </button>
    </div>
  );
}
