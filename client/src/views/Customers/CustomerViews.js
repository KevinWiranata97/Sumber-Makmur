import React from "react";
import Sidebar from "../../components/sidebar";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { useState, useEffect } from "react";
import { Modal, Button, Form} from "react-bootstrap";
import Swal from "sweetalert2";
import { ThemeProvider } from '@mui/material/styles';
import theme from "../../components/theme";
const MyModal = ({ showModal, handleClose, data, fungsi }) => {
  const [id, setId] = useState();
  const [areas, setArea]=useState([])
  const [expeditions, setExpedition]=useState([])
  const columns = [
    { field: "customer_name", headerName: "Nama Customer", flex: 2 },

    { field: "customer_address_1", headerName: "Alamat", flex: 1 },
    { field: "customer_address_2", headerName: "Alamat 2", flex: 1 },
    { field: "customer_expedition_id", headerName: "Expedisi", flex: 1 },
    { field: "customer_area_id", headerName: "Area", flex: 1 },
    { field: "customer_phone", headerName: "Nomor Telpon", flex: 1 },
    { field: "customer_email", headerName: "Email", flex: 1 },
    { field: "customer_contact", headerName: "Kontak", flex: 1 },
    { field: "customer_plafon", headerName: "Plafon", flex: 1 },
    { field: "customer_NPWP", headerName: "NPWP", flex: 1 },
    { field: "customer_grade_id", headerName: "Grade", flex: 1 },
    { field: "customer_time", headerName: "Waktu", flex: 1 },
    { field: "customer_discount", headerName: "Potongan", flex: 1 },
  ];

  const [formData, setFormData] = useState({
    customer_name: "",
    customer_address_1: "",
    customer_address_2: "",
    customer_expedition_id: "",
    customer_area_id: "",
    customer_phone: "",
    customer_email: "",
    customer_contact: "",
    customer_plafon: "",
    customer_NPWP: "",
    customer_grade_id: "",
    customer_time: "",
    customer_discount: "",
});


  useEffect(() => {
    fetchArea() 
    fetchExpeditions()
    if (data) {
      setFormData(data);
      setId(data.id);
    } else {
      // Reset form data if data is empty
      setFormData({
        storage_name: "",
        storage_code: "",
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
        url: `${process.env.REACT_APP_API_URL}/customers/${id}`,
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

  async function fetchArea() {
    try {
      const response = await axios({
        method: "GET",
        url: `${process.env.REACT_APP_API_URL}/areas`,
        headers: {
          authorization: localStorage.getItem("authorization"),
        },
      });

    setArea(response.data)
    } catch (error) {
      console.log(error);
    }
  }
  async function fetchExpeditions() {
    try {
      const response = await axios({
        method: "GET",
        url: `${process.env.REACT_APP_API_URL}/expeditions`,
        headers: {
          authorization: localStorage.getItem("authorization"),
        },
      });

     setExpedition(response.data)
    } catch (error) {
      console.log(error);
    }
  }

  

  return (
    <Modal show={showModal} onHide={handleClose} size="xl">
      <Modal.Header>
        <Modal.Title>{data ? "Edit Customer" : "Tambah Customer"}</Modal.Title>
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
      {columns.map((column) => {
        if (column.field === "customer_expedition_id" || column.field === "customer_area_id") {
          return null; // Skip these fields for now, we'll add them separately
        }
        return (
          <div className="col-6 mb-2" key={column.field}>
            <Form.Group controlId={column.field}>
              <Form.Label>{column.headerName}</Form.Label>
              {column.field === "storage_id" || column.field === "Storage_id" ? (
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
        );
      })}
      {/* Add Expedition and Area after Alamat 2 and Telepon */}
      <div className="col-6 mb-2">
        <Form.Group controlId="customer_expedition_id">
          <Form.Label>Expedisi</Form.Label>
          <Form.Control
            as="select"
            name="customer_expedition_id"
            value={formData.customer_expedition_id}
            onChange={handleChange}
            required
          >
            <option value="">Pilih Expedisi</option>
            {expeditions.map((expedition) => (
              <option key={expedition.id} value={expedition.id}>
                {expedition.expedition_name}
              </option>
            ))}
          </Form.Control>
        </Form.Group>
      </div>
      <div className="col-6 mb-2">
        <Form.Group controlId="customer_area_id">
          <Form.Label>Area</Form.Label>
          <Form.Control
            as="select"
            name="customer_area_id"
            value={formData.customer_area_id}
            onChange={handleChange}
            required
          >
            <option value="">Pilih Area</option>
            {areas.map((area) => (
              <option key={area.id} value={area.id}>
                {area.area_name}
              </option>
            ))}
          </Form.Control>
        </Form.Group>
      </div>
      {/* Add Waktu and Potongan side by side */}
      <div className="col-6 mb-2">
        <div className="row">
          <div className="col-6 mb-2">
            <Form.Group controlId="customer_time">
              <Form.Label>Waktu</Form.Label>
              <Form.Control
                type="text"
                name="customer_time"
                value={formData.customer_time}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </div>
          <div className="col-6 mb-2">
            <Form.Group controlId="customer_discount">
              <Form.Label>Potongan</Form.Label>
              <Form.Control
                type="text"
                name="customer_discount"
                value={formData.customer_discount}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </div>
        </div>
      </div>
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
const Customer = () => {
  // Example data for the table
  const [rows, setRows] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [productById, setProductById] = useState();
  const handleClose = () => {
    setProductById(null);
    fetchCustomers();
    setShowModal(false);
  };
  const handleShow = (productId) => {
    if (productId === "tambahCustomer") {
      setProductById(null);
    } else {
      fetchCustomerById(productId);
    }

    setShowModal(true);
  };
  async function fetchCustomers() {
    try {
      const response = await axios({
        method: "GET",
        url: `${process.env.REACT_APP_API_URL}/customers`,
        headers: {
          authorization: localStorage.getItem("authorization"),
        },
      });

 
      
      setRows(response.data.data);
    } catch (error) {
      console.log(error);
    }
  }

  async function fetchCustomerById(id) {
    try {
      const response = await axios({
        method: "GET",
        url: `${process.env.REACT_APP_API_URL}/customers/${id}`,
        headers: {
          authorization: localStorage.getItem("authorization"),
        },
      });
   
      setProductById(response.data.data);
    } catch (error) {
      console.log(error);
    }
  }

  async function editCustomer(data, id) {
    try {
      const response = await axios({
        method: "PUT",
        url: `${process.env.REACT_APP_API_URL}/customers/${id}`,
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
        fetchCustomers();
      });
    } catch (error) {
      console.log(error);
    }
  }

  async function addCustomer(data) {
    try {
      const response = await axios({
        method: "POST",
        url: `${process.env.REACT_APP_API_URL}/customers`,
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
        fetchCustomers();
      });
    } catch (error) {
      console.log(error);
    }
  }
  const columns = [
    { field: "customer_name", headerName: "Nama Customer", flex: 2 },

    { field: "customer_address_1", headerName: "Alamat", flex: 1 },
    { field: "customer_address_2", headerName: "Alamat 2", flex: 1 },
    { field: "customer_expedition_id", headerName: "Expedisi", flex: 1 },
    { field: "customer_area_id", headerName: "Area", flex: 1 },
    { field: "customer_phone", headerName: "Nomor Telpon", flex: 1 },
    { field: "customer_email", headerName: "Email", flex: 1 },
    { field: "customer_contact", headerName: "Kontak", flex: 1 },
    { field: "customer_plafon", headerName: "Plafon", flex: 1 },
    { field: "customer_NPWP", headerName: "NPWP", flex: 1 },
    { field: "customer_grade_id", headerName: "Grade", flex: 1 },
    { field: "customer_time", headerName: "Waktu", flex: 1 },
    { field: "customer_discount", headerName: "Potongan", flex: 1 },
    // Add more columns as needed
  ];

  useEffect(() => {
    fetchCustomers();
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
                onClick={() => handleShow("tambahCustomer")}
                type="button"
                className="btn btn-outline-primary ml-1"
              >
                Tambah Customer
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
                    <ThemeProvider theme={theme}>

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
                    </ThemeProvider>
                  </div>

                  <div>
                    <MyModal
                      showModal={showModal}
                      handleClose={handleClose}
                      data={productById}
                      fungsi={productById ? editCustomer : addCustomer}
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

export default Customer;
