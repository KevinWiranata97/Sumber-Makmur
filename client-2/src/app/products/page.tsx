"use client";

import React, { useState } from 'react';
import styles from './products.module.css';
import Sidebar from '../../components/Sidebar';
import MUITable from '../../components/MUITable';
import SearchBar from '../../components/SearchBar';

const Products = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Implement search logic here
  };

  return (
    <div className={styles.productsPage}>
      <Sidebar />
      <div className={styles.content}>
        <SearchBar onSearch={handleSearch} />
        <div className={styles.tableContainer}>
          <MUITable />
        </div>
      </div>
    </div>
  );
};

export default Products;
