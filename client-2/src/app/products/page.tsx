"use client";

import React, { useState, useEffect } from 'react';
import styles from './products.module.css';
import Sidebar from '../../components/Sidebar';
import MUITable from '../../components/MUITable';
import SearchBar from '../../components/SearchBar';
import useStore from '../../store/useStore';

const Products = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { fetchProducts, products } = useStore();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    console.log('Fetched products:', products); // Log the fetched products data
  }, [products]);

  const columns = [
    { field: "name", headerName: "Nama Barang", flex: 2 },
    { field: "part_number", headerName: "Part Number", flex: 1 },
    { field: "product", headerName: "Product", flex: 1 },
    { field: "type", headerName: "Type Mesin", flex: 1 },
    { field: "replacement_code", headerName: "Kode Pengganti", flex: 2 },
    {
      field: "Storage",
      headerName: "Lokasi Id",
      flex: 1,
      valueGetter: (params: { Storage: { storage_name: any; }; }) => {
        console.log('Storage value:', params.Storage.storage_name); // Log the Storage value
        return params.Storage.storage_name;
      },
    },
    {
      field: "Unit",
      headerName: "Satuan",
      flex: 1,
      valueGetter: (params: { Unit: { unit_code: any; }; }) => {
        console.log('Unit value:', params.Unit.unit_code); // Log the Unit value
        return params.Unit.unit_code;
      },
    },
    { field: "stock", headerName: "Stock", flex: 1 },
    {
      field: "cost",
      headerName: "Cost",
      flex: 1,
      valueGetter: (params: { cost: number; }) => `Rp. ${params.cost.toLocaleString("id-ID")}`,
    },
    {
      field: "sell_price",
      headerName: "Harga Jual",
      flex: 1,
      valueGetter: (params: { sell_price: number; }) => `Rp. ${params.sell_price.toLocaleString("id-ID")}`,
    },
  ];

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
          <MUITable columns={columns} data={products} />
        </div>
      </div>
    </div>
  );
};

export default Products;
