import React, { useState, useEffect } from "react";
import { Modal, Table, Pagination, Form } from "react-bootstrap";
import axios from "axios";
import Swal from "sweetalert2";
const MyComponent = ({ showModal, onHide, onDataSubmit }) => {
  const [newProducts, setNewProducts] = useState([]); // Stores product data
  const [filteredProducts, setFilteredProducts] = useState([]); // Stores filtered data
  const [currentPage, setCurrentPage] = useState(1); // Tracks the current page
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [totalItems, setTotalItems] = useState(0); // Total number of items from the backend
  const rowsPerPage = 10; // Number of rows per page (backend controlled)
  const maxPageButtons = 5; // Maximum number of visible page buttons

  const fetchProducts = async (searchTerm = "", page = 1) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/products`,
        {
          params: {
            search: searchTerm,
            page: page,
            limit: rowsPerPage, // Send the page and limit for backend pagination
          },
          headers: {
            authorization: localStorage.getItem("authorization"),
          },
        }
      );

      setNewProducts(response.data.data); // Data returned from the server
      setTotalItems(response.data.pagination.totalItems); // Total number of items (needed for pagination)
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchProducts(searchQuery, currentPage); // Fetch products on load
  }, [searchQuery, currentPage]);

  // Filter rows based on the search query
  const handleSearch = (event) => {
    const query = event.target.value;
    setSearchQuery(query); // Update search query
    setCurrentPage(1); // Reset to the first page when search changes
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Total pages based on totalItems and rowsPerPage
  const totalPages = Math.ceil(totalItems / rowsPerPage);

  // Generate pagination range dynamically
  const getPaginationItems = () => {
    let startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

    if (endPage - startPage < maxPageButtons) {
      startPage = Math.max(1, endPage - maxPageButtons + 1);
    }

    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  const handleRowDoubleClick = (row) => {
    onDataSubmit(row);
  };

  return (
    <div>
      <Modal
        show={showModal}
        onHide={onHide}
        centered
        size="lg"
        className="product-modal"
      >
        <Modal.Header>
          <Modal.Title>Tambah Barang</Modal.Title>
          <div>
            <button className="btn btn-link" title="Close" onClick={onHide}>
              <i
                className="fas fa-times"
                style={{ color: "red", fontSize: "24px" }}
              ></i>
            </button>
          </div>
        </Modal.Header>
        <Modal.Body className="scrollable-table">
          {/* Search Bar */}
          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              placeholder="Search by any field"
              value={searchQuery}
              onChange={handleSearch}
            />
          </Form.Group>
          <Table striped bordered hover className="table-scroll table-hover">
            <thead>
              <tr>
                <th>Nama Barang</th>
                <th>Part Number</th>
                <th>Product</th>
                <th>Type Mesin</th>
                <th>KodePengganti</th>
                <th>Lokasi id</th>
                <th>Satuan</th>
                <th>Stock</th>
                <th>Cost</th>
                <th>Harga Jual</th>
              </tr>
            </thead>
            <tbody>
              {newProducts.map((row) => (
                <tr
                  key={row.id}
                  onDoubleClick={() => handleRowDoubleClick(row)}
                >
                  <td>{row.name}</td>
                  <td>{row.part_number}</td>
                  <td>{row.product}</td>
                  <td>{row.type}</td>
                  <td>{row.replacement_code}</td>
                  <td>{row.Storage?.storage_name}</td>
                  <td>{row.Unit?.unit_code}</td>
                  <td>{row.stock}</td>
                  <td>{`Rp. ${row.cost.toLocaleString("id-ID")}`}</td>
                  <td>{`Rp. ${row.sell_price.toLocaleString("id-ID")}`}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          {/* Pagination Controls */}
          <Pagination>
            <Pagination.Prev
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            />
            {currentPage > Math.floor(maxPageButtons / 2) + 1 && (
              <Pagination.Item onClick={() => handlePageChange(1)}>
                1
              </Pagination.Item>
            )}
            {currentPage > Math.floor(maxPageButtons / 2) + 2 && (
              <Pagination.Ellipsis />
            )}
            {getPaginationItems().map((page) => (
              <Pagination.Item
                key={page}
                active={page === currentPage}
                onClick={() => handlePageChange(page)}
                activeLabel=""
              >
                {page}
              </Pagination.Item>
            ))}
            {currentPage < totalPages - Math.floor(maxPageButtons / 2) - 1 && (
              <Pagination.Ellipsis />
            )}
            {currentPage < totalPages - Math.floor(maxPageButtons / 2) && (
              <Pagination.Item onClick={() => handlePageChange(totalPages)}>
                {totalPages}
              </Pagination.Item>
            )}
            <Pagination.Next
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            />
          </Pagination>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default MyComponent;
