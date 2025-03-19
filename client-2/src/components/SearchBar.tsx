import React, { useState } from 'react';
import styles from './SearchBar.module.css';

const SearchBar = ({ onSearch, onToggleForm, page, hidden }: { onSearch: (query: string) => void, onToggleForm: (showForm: boolean) => void, page: string, hidden?: boolean }) => {
  const [query, setQuery] = useState('');

  if (hidden) return null;

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    onSearch(event.target.value);
  };

  const handleButtonClick = () => {
    onToggleForm(true); // Notify parent to show the form
  };

  return (
    <div className={styles.searchBar}>
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder="Search..."
        className={styles.input}
      />
      <button onClick={handleButtonClick} className={styles.addButton}>
        {page === "/products" ? "Add Product" : "Add Lead"}
      </button>
    </div>
  );
};

export default SearchBar;
