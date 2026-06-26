import { useState, useEffect, useRef } from 'react';
import { useDebounce } from '../../hooks/useDebounce';
import { Search, MapPin } from 'lucide-react';
import { weatherService } from '../../services/api';
import './SearchBar.css';

export default function SearchBar({ onSearch, onUseLocation }) {
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debouncedSearchTerm = useDebounce(input, 400);
  const wrapperRef = useRef(null);

  // fetch autocomplete suggestions
  useEffect(() => {
    let active = true;
    if (debouncedSearchTerm && debouncedSearchTerm.length > 2) {
      weatherService.geocode(debouncedSearchTerm)
        .then(results => {
          if (active) {
            setSuggestions(results || []);
            setShowSuggestions(true);
          }
        })
        .catch(() => {
          if (active) setSuggestions([]);
        });
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
    return () => { active = false; };
  }, [debouncedSearchTerm]);

  // close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowSuggestions(false);
    if (input.trim()) onSearch(input.trim());
  };

  const handleSuggestionClick = (suggestion) => {
    const query = `${suggestion.name}${suggestion.state ? `, ${suggestion.state}` : ''}, ${suggestion.country}`;
    setInput(query);
    setShowSuggestions(false);
    onSearch(query);
  };

  return (
    <div className="search-bar-wrapper" ref={wrapperRef}>
      <form onSubmit={handleSubmit} className="search-form">
        <Search className="search-icon" size={20} />
        <input
          type="text"
          className="search-input"
          placeholder="Search city, zip, or coordinates..."
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => {
            if (suggestions.length > 0) setShowSuggestions(true);
          }}
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

      {showSuggestions && suggestions.length > 0 && (
        <ul className="suggestions-dropdown">
          {suggestions.map((item, index) => (
            <li key={index} onClick={() => handleSuggestionClick(item)}>
              <span className="sugg-name">{item.name}</span>
              <span className="sugg-state">{item.state ? `${item.state}, ` : ''}{item.country}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
