"use client";

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import styles from './products.module.css';
import Sidebar from '../../components/Sidebar';
import MUITable from '../../components/MUITable';
import SearchBar from '../../components/SearchBar';
import useStore from '../../store/useStore';
import SellingLeadsForm from '../../components/form';

const Products = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { fetchProducts, products, totalProducts } = useStore();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [showForm, setShowForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const pathname = usePathname();
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => {
    setCurrentUrl(pathname);
  }, [pathname]);

  useEffect(() => {
    fetchProducts(searchQuery, page, rowsPerPage);
  }, [fetchProducts, searchQuery, page, rowsPerPage]);

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
        return params.Storage.storage_name;
      },
    },
    {
      field: "Unit",
      headerName: "Satuan",
      flex: 1,
      valueGetter: (params: { Unit: { unit_code: any; }; }) => {
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
    setPage(0);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleToggleForm = (showForm: boolean) => {
    setShowForm(showForm);
  };

  return (
    <div className={styles.productsPage}>
      <Sidebar />
      <div className={styles.content}>
        <SearchBar onSearch={handleSearch} onToggleForm={handleToggleForm} columns={columns} data={products} page={currentUrl} />
        {!showForm && (
          <div className={styles.tableContainer}>
            <MUITable
              columns={columns}
              data={products}
              rowCount={totalProducts}
              page={page}
              rowsPerPage={rowsPerPage}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </div>
        )}
        {showForm && selectedProduct && (
          <SellingLeadsForm onClose={() => setShowForm(false)} columns={columns} data={selectedProduct} page={currentUrl} />
        )}
      </div>
    </div>
  );
};

export default Products;
