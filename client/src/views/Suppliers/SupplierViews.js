import React from "react";
import Sidebar from "../../components/sidebar";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import Swal from "sweetalert2";
import { ThemeProvider } from '@mui/material/styles';
import theme from "../../components/theme";
import SearchBar from "../../components/searchbar";
const MyModal = ({ showModal, handleClose, data, fungsi }) => {
  const [id, setId] = useState();

  const columns = [
    { field: "supplier_name", headerName: "Nama Supplier", flex: 1 },

    { field: "supplier_address", headerName: "Alamat", flex: 1 },

    { field: "supplier_email", headerName: "Email", flex: 1 },

    { field: "supplier_contact", headerName: "Kontak", flex: 1 },

    { field: "supplier_fax", headerName: "Fax", flex: 1 },

    { field: "supplier_NPWP", headerName: "NPWP", flex: 1 },

    { field: "supplier_debt", headerName: "Saldo Hutang", flex: 1 },

    { field: "supplier_time", headerName: "Waktu", flex: 1 },

    // Add more columns as needed
  ];
  const [formData, setFormData] = useState({
    supplier_name: "",
    supplier_address: "",
    supplier_email: "",
    supplier_contact: "",
    supplier_fax: "",
    supplier_NPWP: "",
    supplier_debt: "",
    supplier_time: "",

  });

  useEffect(() => {

    if (data) {
      setFormData(data);
      setId(data.id);
    } else {
      // Reset form data if data is empty
      setFormData({
        supplier_name: "",
        supplier_address: "",
        supplier_email: "",
        supplier_contact: "",
        supplier_fax: "",
        supplier_NPWP: "",
        supplier_debt: "",
        supplier_time: "",
      });
    }
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let data = formData;

    fungsi(data, id);
    handleClose(); // Close modal after form submission
  };

  const handleDelete = (e) => {
    e.preventDefault();
    Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Anda tidak akan dapat mengembalikannya!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Ya, hapus!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteProduct(id);

      }
    });
  };

  async function deleteProduct(id) {
    try {
      const response = await axios({
        method: "DELETE",
        url: `${process.env.REACT_APP_API_URL}/suppliers/${id}`,
        headers: {
          authorization: localStorage.getItem("authorization"),
        },
      });


      Swal.fire({
        icon: "success",
        title: "Save data",
        text: response.data.message,
      }).then((result) => {
        handleClose()
      });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Modal show={showModal} onHide={handleClose} size="xl">
      <Modal.Header>
        <Modal.Title>{data ? "Edit Gudang" : "Tambah Gudang"}</Modal.Title>
        <button className="btn btn-link" onClick={handleDelete}>
          {data ? (
            <i className="fas fa-trash" style={{ color: "red" }}>
              {" "}
            </i>
          ) : (
            <></>
          )}
        </button>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <div className="row">
            {columns.map((column) => (
              <div className="col-6 mb-2" key={column.field}>
                <Form.Group controlId={column.field}>
                  <Form.Label>{column.headerName}</Form.Label>
                  {column.field === "storage_id" ||
                    column.field === "Storage_id" ? (
                    <Form.Control
                      as="select"
                      name={column.field}
                      value={formData[column.field]}
                      onChange={handleChange}
                      required
                    ></Form.Control>
                  ) : (
                    <Form.Control
                      type="text"
                      name={column.field}
                      value={formData[column.field]}
                      onChange={handleChange}
                      required
                    />
                  )}
                </Form.Group>
              </div>
            ))}
          </div>
          <div className="text-right mb-3 mt-3">
            <Button variant="secondary" className="mr-2" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" type="submit">
              Save
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};
const Supplier = () => {
  // Example data for the table
  const [rows, setRows] = useState([]);
  const [rowCount, setRowCount] = useState(0); // Total rows count from the server
  const [showModal, setShowModal] = useState(false);
  const [productById, setProductById] = useState();
  const [pageSize, setPageSize] = useState(25); // Number of rows per page
  const [page, setPage] = useState(0); // Current page number (zero-based)
  const [loading, setLoading] = useState(false); // Loading state for DataGrid

  const handleClose = () => {
    setProductById(null); 
    fetchSuppliers();
    setShowModal(false);
  };
  const handleShow = (productId) => {
    if (productId === "tambahBarang") {
      setProductById(null);
    } else {
      fetchSupplierById(productId);
    }

    setShowModal(true);
  };
  const fetchSuppliers = async (value) => {
    setLoading(true);
    try {
      const searchTerm = value || '';

      const response = await axios({
        method: 'GET',
        url: `${process.env.REACT_APP_API_URL}/suppliers?search=${searchTerm}&limit=${pageSize}&page=${page+1}`,
        headers: {
          authorization: localStorage.getItem('authorization'),
        },
      });

      // Update the rows and total row count based on the response
      setRows(response.data.data);
      setRowCount(Number(response.data.pagination.totalItems));
 // Total rows available
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  async function fetchSupplierById(id) {
    try {
      const response = await axios({
        method: "GET",
        url: `${process.env.REACT_APP_API_URL}/suppliers/${id}`,
        headers: {
          authorization: localStorage.getItem("authorization"),
        },
      });

      setProductById(response.data.data);
    } catch (error) {
      console.log(error);
    }
  }

  async function editSupplier(data, id) {
    try {
      const response = await axios({
        method: "PUT",
        url: `${process.env.REACT_APP_API_URL}/suppliers/${id}`,
        headers: {
          authorization: localStorage.getItem("authorization"),
        },
        data: data,
      });

      Swal.fire({
        icon: "success",
        title: "Save data",
        text: response.data.message,
      }).then(() => {
        fetchSuppliers();
      });
    } catch (error) {
      console.log(error);
    }
  }

  async function addSuppliers(data) {
    try {
      const response = await axios({
        method: "POST",
        url: `${process.env.REACT_APP_API_URL}/suppliers`,
        headers: {
          authorization: localStorage.getItem("authorization"),
        },
        data: data,
      });

      Swal.fire({
        icon: "success",
        title: "Save data",
        text: response.data.message,
      }).then(() => {
        fetchSuppliers();
      });
    } catch (error) {
      console.log(error);
    }
  }
  const columns = [
    { field: "supplier_name", headerName: "Nama Supplier", flex: 1 },

    { field: "supplier_address", headerName: "Alamat", flex: 1 },

    { field: "supplier_email", headerName: "Email", flex: 1 },

    { field: "supplier_contact", headerName: "Kontak", flex: 1 },

    { field: "supplier_fax", headerName: "Fax", flex: 1 },

    { field: "supplier_NPWP", headerName: "NPWP", flex: 1 },

    { field: "supplier_debt", headerName: "Saldo Hutang", flex: 1 },

    { field: "supplier_time", headerName: "Waktu", flex: 1 },

    // Add more columns as needed
  ];

  useEffect(() => {
    fetchSuppliers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[page, pageSize]);

  return (
    <>
      <Sidebar />

      <div className="content-wrapper">
        {/* Content Header (Page header) */}
        <section className="content-header">
          <div className="d-flex flex-row justify-content-between">
            {/* Remove Tambah Barang Button */}

            {/* Render SearchBar with the onAdd prop */}
            <SearchBar fetchProducts={fetchSuppliers} onAdd={() => handleShow("tambahBarang")} />
          </div>
        </section>
        {/* Main content */}
        <section className="content">
          <div className="container-fluid">
            <div className="row">
              <div className="col-12">
                <div className="card">
                <div style={{ height: "90vh", width: "100%" }}>
                <ThemeProvider theme={theme}>
                      <DataGrid
                        rows={rows}
                        columns={columns}
                        pageSize={pageSize}
                        rowCount={rowCount} // Total row count from the server for correct pagination
                        paginationMode="server" // Enable server-side pagination
                        paginationModel={{ page, pageSize }} // Bind page and pageSize states
                        onPaginationModelChange={(newPaginationModel) => {
                          setPage(newPaginationModel.page);
                          setPageSize(newPaginationModel.pageSize);
                        }}
                        onRowSelectionModelChange={(selection) => {
                          // Assuming rows contain products with an 'id' field
                          if (selection && selection.length > 0) {
                            handleShow(selection[0]);
                          }
                        }}
                        loading={loading} // Show loading indicator while fetching data
                        pagination // Enable pagination
                        sx={{
                          '& .MuiDataGrid-row:hover': {
                            backgroundColor: '#e0f7fa', // Customize hover background color
                            cursor: 'pointer', // Change cursor on hover (optional)
                          },
                          '& .MuiDataGrid-cell:hover': {
                            color: '#00695c', // Customize hover text color in cells (optional)
                          },
                        }}
                      />
                    </ThemeProvider>
                  </div>

                  <div>
                    <MyModal
                      showModal={showModal}
                      handleClose={handleClose}
                      data={productById}
                      fungsi={productById ? editSupplier : addSuppliers}
                    />
                  </div>
                </div>
              </div>
              {/* /.col */}
            </div>
            {/* /.row */}
          </div>
          {/* /.container-fluid */}
        </section>
        {/* /.content */}
      </div>
    </>
  );
};

export default Supplier;
