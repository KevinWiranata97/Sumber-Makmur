import React from "react";
import Sidebar from "../components/sidebar";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import Swal from "sweetalert2";

const MyModal = ({ showModal, handleClose, data,fungsi }) => {
  const [id, setId] = useState();
  const [units, setUnits]=useState([])
  const [storages, setStorages]=useState([])
  const columns = [
    { field: "name", headerName: "Nama Barang", flex: 2 },
    { field: "part_number", headerName: "Part Number", flex: 1 },
    { field: "product", headerName: "Product", flex: 1 },
    { field: "type", headerName: "Type Mesin", flex: 1 },
    { field: "replacement_code", headerName: "Kode Pengganti", flex: 2 },
    {
      field: "storage_id",
      headerName: "Lokasi Id",
      flex: 1,
    },
    {
      field: "unit_id",
      headerName: "Satuan",
      flex: 1,
    },
    { field: "cost", headerName: "Cost", flex: 1 },
    { field: "sell_price", headerName: "Harga Jual", flex: 1 },
    // Add more columns as needed
  ];


  const [formData, setFormData] = useState({
    name: "",
    part_number: "",
    product: "",
    type: "",
    replacement_code: "",
    storage_id: "",
    unit_id: "",
    cost: "",
    sell_price: "",
  });

  useEffect(() => {
    fetchUnit()
    fetchStorages()
    if (data) {
      setFormData(data);
      setId(data.id);
    } else {
      // Reset form data if data is empty
      setFormData({
        name: "",
        part_number: "",
        product: "",
        type: "",
        replacement_code: "",
        storage_id: "",
        unit_id: "",
        cost: "",
        sell_price: "",
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
    let data = formData


    fungsi(data,id)
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
        deleteProduct(id)
        handleClose();
      }
    })
  };

  async function deleteProduct(id) {
    try {
      const response = await axios({
        method: "DELETE",
        url: `${process.env.REACT_APP_API_URL}/products/${id}`,
        headers: {
          authorization: localStorage.getItem("authorization"),
        },
      });

      console.log(response);
      Swal.fire({
        icon: "success",
        title: "Save data",
        text: response.data.message,
      }).then((result) => {
        handleClose();
      })

    } catch (error) {
      console.log(error);
    }
  }
  async function fetchUnit() {
    try {
      const response = await axios({
        method: "GET",
        url: `${process.env.REACT_APP_API_URL}/units`,
        headers: {
          authorization: localStorage.getItem("authorization"),
        },
      });

      setUnits(response.data);
    } catch (error) {
      console.log(error);
    }
  }
  async function fetchStorages() {
    try {
      const response = await axios({
        method: "GET",
        url: `${process.env.REACT_APP_API_URL}/storages`,
        headers: {
          authorization: localStorage.getItem("authorization"),
        },
      });

      setStorages(response.data);
    } catch (error) {
      console.log(error);
    }
  }
return (
  <Modal show={showModal} onHide={handleClose} size="xl">
  <Modal.Header>
    <Modal.Title>{data ? 'Edit Barang' : 'Tambah Barang'}</Modal.Title>
    <button className="btn btn-link" onClick={handleDelete}>
    {data ?<i className="fas fa-trash"  style={{ color: 'red' }}> </i> : <></> }  
    </button>
  </Modal.Header>
  <Modal.Body>
    <Form onSubmit={handleSubmit}>
      <div className="row">
        {columns.map((column) => (
          <div className="col-6 mb-2" key={column.field}>
            <Form.Group controlId={column.field}>
              <Form.Label>{column.headerName}</Form.Label>
              {column.field === 'storage_id' || column.field === 'unit_id' ? (
                <Form.Control
                  as="select"
                  name={column.field}
                  value={formData[column.field]}
                  onChange={handleChange}
                  required
                >
                  {/* Generate dropdown options */}
                  <option value="">{`Pilih ${column.headerName}`}</option>
                  {column.field === 'storage_id' ? (
                    storages.map((storage) => (
                      <option key={storage.id} value={storage.id} selected={formData.storage_id === storage.id}>
                        {storage.storage_name}
                      </option>
                    ))
                  ) : null}
                  {column.field === 'unit_id' ? (
                    units.map((unit) => (
                      <option key={unit.id} value={unit.id} selected={formData.unit_id === unit.id}>
                        {unit.unit_code}
                      </option>
                    ))
                  ) : null}
                </Form.Control>
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
const Home = () => {
  // Example data for the table
  const [rows, setRows] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [productById, setProductById] = useState();
  const handleClose = () =>{
    setProductById(null)
    fetchProducts()
    setShowModal(false);
  }
  const handleShow = (productId) => {

   if(productId === 'tambahBarang'){
    setProductById(null)
   }else{
    fetchProductsById(productId);
   }
  
    setShowModal(true);
  };
  async function fetchProducts() {
    try {
      const response = await axios({
        method: "GET",
        url: `${process.env.REACT_APP_API_URL}/products`,
        headers: {
          authorization: localStorage.getItem("authorization"),
        },
      });

      setRows(response.data.data);
    } catch (error) {
      console.log(error);
    }
  }

  async function fetchProductsById(id) {
    try {
      const response = await axios({
        method: "GET",
        url: `${process.env.REACT_APP_API_URL}/products/${id}`,
        headers: {
          authorization: localStorage.getItem("authorization"),
        },
      });

      setProductById(response.data.data);
    } catch (error) {
      console.log(error);
    }
  }

    async function editProduct(data,id) {
    try {
      const response = await axios({
        method: "PUT",
        url: `${process.env.REACT_APP_API_URL}/products/${id}`,
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
        fetchProducts()
      });
    } catch (error) {
      console.log(error);
    }
  }

  async function addProduct(data,id) {
    try {
      const response = await axios({
        method: "POST",
        url: `${process.env.REACT_APP_API_URL}/products`,
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
        fetchProducts()
      });
    } catch (error) {
      console.log(error);
    }
  }
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
      valueGetter: (params) => params.storage_name,
    },
    {
      field: "Unit",
      headerName: "Satuan",
      flex: 1,
      valueGetter: (params) => params.unit_code,
    },
    { field: "stock", headerName: "Stock", flex: 1 },
    { field: "cost", headerName: "Cost", flex: 1 },
    { field: "sell_price", headerName: "Harga Jual", flex: 1 },
    // Add more columns as needed
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  
  return (
    <>
      <Sidebar />

      <div className="content-wrapper">
        {/* Content Header (Page header) */}
        <section className="content-header">
        <div className="d-flex flex-row justify-content-between">
            <div>
              <div
                  onClick={() => handleShow("tambahBarang")}
                type="button"
               className="btn btn-outline-primary ml-1"
              >
                Tambah Barang
              </div>
            </div>
          </div>
        </section>
        {/* Main content */}
        <section className="content">
          <div className="container-fluid">
            <div className="row">
              <div className="col-12">
                <div className="card">
                  <div style={{ height: "90vh", width: "100%" }}>
                    <DataGrid
                      rows={rows}
                      columns={columns}
                      pageSize={5}
                      onRowSelectionModelChange={(selection) => {
                        // Assuming rows contain products with an 'id' field
                        if (selection && selection.length > 0) {
                          handleShow(selection[0]);
                        }
                      }}
                    />
                  </div>

                  <div>
                    <MyModal
                      showModal={showModal}
                      handleClose={handleClose}
                      data={productById}
                      fungsi={productById?editProduct:addProduct}
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

export default Home;
