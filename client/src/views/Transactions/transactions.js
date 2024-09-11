import React from "react";
import Sidebar from "../../components/sidebar";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import Swal from "sweetalert2";
import { Checkbox } from '@mui/material';
const MyModal = ({ showModal, handleClose, data, fungsi }) => {
  const [id, setId] = useState();
  const [areas, setArea] = useState([])
  const [expeditions, setExpedition] = useState([])
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
        <Modal.Title>{data ? "Pembelian Form" : "Pembelian Form"}</Modal.Title>
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
        <div className="container">
          {/* Form section */}
          <div className="form-section row g-3">
            <div className="col-md-4">
              <label htmlFor="noBukti" className="form-label">No. Bukti#</label>
              <input type="text" className="form-control" id="noBukti" defaultValue="FB 24/04/000215" style={{ width: '100%' }} />
            </div>
            <div className="col-md-3 test1">
              <div className="form-check stock">
                <input className="form-check-input" type="checkbox" id="pembelianStok" />
                <label className="form-check-label" htmlFor="pembelianStok">Pembelian Stok</label>
              </div>
            </div>
            <div className="col-md-4">
              <label htmlFor="supplier" className="form-label">Supplier</label>
              <select className="form-select" id="supplier" style={{ width: '100%', height: "55%" }}>
                <option value="[S0002]">[S0002] MITRA FILTER</option>
              </select>
            </div>

            <div className="col-md-3 mt-2">
              <label htmlFor="tanggal" className="form-label">Tanggal</label>
              <input type="date" className="form-control" id="tanggal" style={{ width: '100%', height: "55%" }} />
            </div>

            <div className="col-md-3 mt-2">
              <label htmlFor="tanggal" className="form-label">Tgl. Tempo</label>
              <input type="date" className="form-control" id="tanggalTempo" style={{ width: '100%', height: "55%" }} />
            </div>
            <div className="col-md-3 mt-2">
              <div>
                <label htmlFor="noInvoice" className="form-label">No. Invoice</label>
                <input type="text" className="form-control" id="noInvoice" />
              </div>

            </div>

            <div className="col-md-3 mt-2">
              <label htmlFor="supplier" className="form-label">PPn</label>
              <select className="form-select" id="supplier" style={{ width: '100%', height: "55%" }}>
                <option value="True">PPn</option>
                <option value="False">Non PPn</option>
              </select>
            </div>
          </div>

          <div class="table-container mt-3">
            <table class="table table-bordered table-striped">
              <thead>
                <tr class="table-warning">
                  <th>No.</th>
                  <th>Kode Barang</th>
                  <th>Nama Barang</th>
                  <th>Qty</th>
                  <th>Satuan</th>
                  <th>Cost</th>
                  <th>Amount</th>
                  <th class="notes-col">Notes</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>P55-4005</td>
                  <td>OIL FILTER</td>
                  <td>12</td>
                  <td>PCS</td>
                  <td>148,650</td>
                  <td>1,783,800</td>
                  <td></td>
                </tr>
                <tr>
                  <td>2</td>
                  <td>FC-52040</td>
                  <td>FUEL FILTER</td>
                  <td>12</td>
                  <td>PCS</td>
                  <td>128,200</td>
                  <td>1,538,400</td>
                  <td></td>
                </tr>
                <tr>
                  <td>3</td>
                  <td>F-1004</td>
                  <td>FUEL FILTER</td>
                  <td>12</td>
                  <td>PCS</td>
                  <td>23,425</td>
                  <td>281,100</td>
                  <td></td>
                </tr>
                <tr>
                  <td>4</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <footer class="container mr-1">

          <div className="container">
            <div className="row g-1">


              <div className="col-md-2-custom d-flex align-items-center">
                <label htmlFor="totalAmount" className="form-label mb-0">Total Amount</label>
              </div>
              <div className="col-md-4">
                <div className="input-group">
                  <span className="input-group-text mr-1">Rp.</span>
                  <input type="text" className="form-control" id="totalAmount" />
                </div>
              </div>


              <div className="col-md-2-custom d-flex align-items-center test">
                <label htmlFor="totalQuantity" className="form-label mb-0">Total Quantity</label>
              </div>
              <div className="col-md-3 d-flex align-items-center">
                <input type="text" className="form-control" id="totalQuantity" />
              </div>


            </div>

            <div className="row g-1 mt-2">
              <div className="col-md-2-custom d-flex align-items-center">
                <label htmlFor="totalAmount" className="form-label mb-0">Disc</label>
              </div>
              <div className="col-md-1">
                <div className="input-group">
                  <input type="text" className="form-control mr-1" id="discAmount" />
                  <span className="input-group-text">%</span>
                </div>
              </div>
              <div className="col-md-3-custom test2">
                <input type="text" className="form-control" id="totalAmount" />
              </div>
            </div>

            <div className="row g-1 mt-2">
              <div className="col-md-2-custom d-flex align-items-center">
                <label htmlFor="totalAmount" className="form-label mb-0">Total DPP</label>
              </div>
              <div className="col-md-4">
                <div className="input-group">
                  <span className="input-group-text mr-1">Rp.</span>
                  <input type="text" className="form-control" id="totalAmount" />
                </div>
              </div>
            </div>


            <div className="row g-1 mt-2">
              <div className="col-md-2-custom d-flex align-items-center">
                <label htmlFor="totalAmount" className="form-label mb-0">Total PPn</label>
              </div>
              <div className="col-md-4">
                <div className="input-group">
                  <span className="input-group-text mr-1">Rp.</span>
                  <input type="text" className="form-control" id="totalAmount" />
                </div>
              </div>
            </div>

            <div className="row g-1 mt-2">
              <div className="col-md-2-custom d-flex align-items-center">
                <label htmlFor="totalAmount" className="form-label mb-0">Total Netto</label>
              </div>
              <div className="col-md-4">
                <div className="input-group">
                  <span className="input-group-text mr-1">Rp.</span>
                  <input type="text" className="form-control" id="totalAmount" />
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


        </footer>

      </Modal.Body>


    </Modal>
  );
};
const TransactionBuy = () => {
  // Example data for the table
  const [rows, setRows] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [productById, setProductById] = useState();
  const handleClose = () => {
    setProductById(null);
    fetchTransactions();
    setShowModal(false);
  };
  const handleShow = (productId) => {
    if (productId === "tambahPembelian") {
      setProductById(null);
    } else {
      fetchTransactionById(productId);
    }

    setShowModal(true);
  };
  async function fetchTransactions() {
    try {
      const response = await axios({
        method: "GET",
        url: `${process.env.REACT_APP_API_URL}/transactions?type=buy`,
        headers: {
          authorization: localStorage.getItem("authorization"),
        },
      });



      setRows(response.data.data);
    } catch (error) {
      console.log(error);
    }
  }

  async function fetchTransactionById(id) {
    try {
      const response = await axios({
        method: "GET",
        url: `${process.env.REACT_APP_API_URL}/transactions/${id}`,
        headers: {
          authorization: localStorage.getItem("authorization"),
        },
      });

      setProductById(response.data.data);
    } catch (error) {
      console.log(error);
    }
  }

  async function editTransaction(data, id) {
    try {
      const response = await axios({
        method: "PUT",
        url: `${process.env.REACT_APP_API_URL}/transactions/${id}`,
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
        fetchTransactions();
      });
    } catch (error) {
      console.log(error);
    }
  }

  async function addTransaction(data) {
    try {
      const response = await axios({
        method: "POST",
        url: `${process.env.REACT_APP_API_URL}/transactions`,
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
        fetchTransactions();
      });
    } catch (error) {
      console.log(error);
    }
  }
  const columns = [
    { field: "transaction_proof_number", headerName: "No. Bukti", flex: 2 },
    { field: "transaction_invoice_number", headerName: "No. Invoice", flex: 1 },
    { field: "transaction_date", headerName: "Tanggal Pembelian", flex: 2 },
    { field: "transaction_due_date", headerName: "Tgl. tempo", flex: 1 },
    { field: "Supplier", headerName: "Supplier", flex: 1, valueGetter: (params) => params.supplier_name },
    {
      field: "PPN",
      headerName: "PPN",
      flex: 1,
      renderCell: (params) => (
        <Checkbox
          checked={!!params.value} // Convert to boolean if necessary
          disabled // Optional: if you want the checkbox to be read-only
        />
      )
    }
    // Add more columns as needed
  ];

  useEffect(() => {
    fetchTransactions();
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
                onClick={() => handleShow("tambahPembelian")}
                type="button"
                className="btn btn-outline-primary ml-1"
              >
                Tambah Pembelian
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
                      fungsi={productById ? editTransaction : addTransaction}
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

export default TransactionBuy;
