import React, { useState} from 'react';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';


const SearchBar = ({ onAdd, fetchProducts }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleClear = () => {
    setSearchTerm('');
    fetchProducts(''); // Fetch all products when search is cleared
  };

  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  // Handle the input change and call the API
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedFetchProducts(value);
  };

  const debouncedFetchProducts = debounce(fetchProducts, 500); // 500ms delay for debouncing

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {/* Search Bar */}
      <TextField
        variant="outlined"
        value={searchTerm}
        onChange={handleSearchChange}
        placeholder="Search"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              {searchTerm && (
                <IconButton onClick={handleClear}>
                  <ClearIcon />
                </IconButton>
              )}
            </InputAdornment>
          ),
        }}
        sx={{
          width: 300,
          borderRadius: '50px',
          '& .MuiOutlinedInput-root': {
            borderRadius: '50px',
          },
        }}
      />

      {/* Plus Icon */}
      <IconButton
        onClick={onAdd}
        sx={{
          marginLeft: '10px',
        }}
      >
        <AddCircleOutlineIcon fontSize="large" color="primary" />
      </IconButton>
    </div>
  );
};

export default SearchBar;
