import React, { useState } from 'react';
import styles from './SearchBar.module.css';
import SellingLeadsForm from './form';

const SearchBar = ({ onSearch, onToggleForm, columns, data, page }: { onSearch: (query: string) => void, onToggleForm: (showForm: boolean) => void, columns: any[], data: any, page: string }) => {
  const [query, setQuery] = useState('');
  const [showForm, setShowForm] = useState(false);

  console.log(page,"pemaiiiiiiii");
  
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    onSearch(event.target.value);
  };

  const handleButtonClick = () => {
    const newShowForm = !showForm;
    setShowForm(newShowForm);
    onToggleForm(newShowForm);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    onToggleForm(false);
  };

  return (
    <div>
      {!showForm && (
        <div className={styles.searchBar}>
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            placeholder="Search..."
            className={styles.input}
          />
          <button onClick={handleButtonClick} className={styles.addButton}>{page === "/products" ? "Add Product" : "Add Lead"}</button>
        </div>
      )}
      {showForm && <SellingLeadsForm onClose={handleCloseForm} columns={columns} data={data} page={page} />}
    </div>
  );
};

export default SearchBar;
