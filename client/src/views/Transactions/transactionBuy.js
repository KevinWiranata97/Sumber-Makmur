import React from "react";
import Sidebar from "../../components/sidebar";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import Swal from "sweetalert2";
import { Checkbox } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import theme from "../../components/theme";
import SearchBar from "../../components/searchbar";
const MyModal = ({ showModal, handleClose, data, fungsi }) => {

  // console.log(data, ">>>>>>");
  // console.log(data.Transaction_Products.length);

  // const [dataRender, setDataRender] = useState([])

  // if(data){
  //   setDataRender(data)
  // }



  const [transaction_id, setTransactionId] = useState();
  const [suppliers, setSuppliers] = useState([])
  const [products, setProducts] = useState([])


  const [rows, setRows] = useState([]);

  const [formData, setFormData] = useState({
    transaction_proof_number: "",
    transaction_invoice_number: "",
    transaction_date: "",
    transaction_due_date: "",
    transaction_supplier_id: "",
    PPN: "true",
    transaction_note: ""
  });





  useEffect(() => {
    fetchSuppliers()
    fetchProducts()

    // fetchTransactionById(28)
    if (data) {
      setFormData(data);
      setTransactionId(data.id);
      setRows(data.Transaction_Products);
    } else {
      setFormData({
        transaction_proof_number: "",
        transaction_invoice_number: "",
        transaction_date: "",
        transaction_due_date: "",
        transaction_supplier_id: "",
        PPN: "true",
        transaction_note: ""
      });

      setRows([])
    }
  }, [data]);



  useEffect(() => {
    // Initialize Bootstrap tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new window.bootstrap.Tooltip(tooltipTriggerEl);
    });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };




  const handleSubmit = (e) => {
    e.preventDefault();

    let newData = rows.filter((e) => e.isNew
    )

    let product_id = []
    let qty = []

    newData.forEach((item) => {


      product_id.push(item.Product.id)
      qty.push(item.qty)
    })

    if (!data) {
      if (!formData.transaction_date) {
        Swal.fire('Kesalahan', 'Tanggal Transaksi wajib diisi!', 'error');
        return;
      }

      if (!formData.transaction_due_date) {
        Swal.fire('Kesalahan', 'Tanggal Jatuh Tempo wajib diisi!', 'error');
        return;
      }

      if (!formData.transaction_supplier_id) {
        Swal.fire('Kesalahan', 'Supplier wajib diisi!', 'error');
        return;
      }

      if (!formData.PPN) {
        Swal.fire('Kesalahan', 'PPN wajib diisi!', 'error');
        return;
      }

      if (rows.length < 1) {
        Swal.fire('Kesalahan', 'Tambah setidaknya 1 barang!', 'error');
        return;
      }




      if (!rows[0].Product.name) {
        Swal.fire('Kesalahan', 'Tidak ada barang terpilih', 'error');
        return;
      }
      let payload = {
        product_id,
        qty,
        transaction_type: "buy",
        transaction_date: formData.transaction_date,
        transaction_due_date: formData.transaction_due_date,
        transaction_supplier_id: formData.transaction_supplier_id,
        transaction_note: formData.transaction_note,
        PPN: formData.PPN
      }

      fungsi(payload).then(() => {
        handleClose()
      })

      setFormData({
        transaction_proof_number: "",
        transaction_invoice_number: "",
        transaction_date: "",
        transaction_due_date: "",
        transaction_supplier_id: "",
        PPN: "true",
        transaction_note: ""
      });

      setRows([])
    } else {



      let payload = {
        product_id,
        qty,
        transaction_type: "buy",
        transaction_id: transaction_id
      }


      addProduct(payload)


      let data = {
        transaction_supplier_id: formData.transaction_supplier_id,
        transaction_date: formData.transaction_date,
        transaction_due_date: formData.transaction_due_date,
        PPN: formData.PPN,
        transaction_note: formData.transaction_note
      }



      editTransaction(data, transaction_id)
    }

    // handleClose(); // Close modal after form submission
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Anda tidak akan dapat mengembalikannya!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Ya, hapus!",
    }).then((result) => {
      if (result.isConfirmed) {

        deleteProduct(id); // Call your delete function here
      }
    });
  };


  const handleDeleteTransaction = (id) => {
    Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Anda tidak akan dapat mengembalikannya!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Ya, hapus!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteTransaction(transaction_id)
        // deleteProduct(id); // Call your delete function here
      }
    });
  };

  const handleDownload = async () => {
    try {



      const response = await axios({
        method: "GET",
        url: `${process.env.REACT_APP_API_URL}/transactions/generate-invoice/${transaction_id}`,
        headers: {
          authorization: localStorage.getItem("authorization"),
        },
      });



      // Extract the fileUrl from the API response
      const fileUrl = response.data.data.fileUrl;

      // Create a hidden <a> element and trigger the download
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = 'invoice.pdf'; // Optional: specify the file name for download
      document.body.appendChild(link); // Append the link to the body
      link.click(); // Programmatically trigger the click
      document.body.removeChild(link); // Clean up by removing the link
    } catch (error) {
      console.error('Error downloading the invoice:', error);
      // Handle error (e.g., show a message to the user)
    }
  };
  async function deleteProduct(id) {


    try {
      const response = await axios({
        method: "DELETE",
        url: `${process.env.REACT_APP_API_URL}/transactions/transaction-product/${id}`,
        headers: {
          authorization: localStorage.getItem("authorization"),
        },
      });


      Swal.fire({
        icon: "success",
        title: "Save data",
        text: response.data.message,
      }).then(() => {
        fungsi(transaction_id);
      })
    } catch (error) {
      console.log(error);
    }
  }

  async function addProduct(payload) {


    try {
      const response = await axios({
        method: "POST",
        url: `${process.env.REACT_APP_API_URL}/transactions/transaction-product`,
        headers: {
          authorization: localStorage.getItem("authorization"),
        },
        data: payload
      });


      Swal.fire({
        icon: "success",
        title: "Save data",
        text: response.data.message,
      }).then(() => {
        fungsi(transaction_id);
      })
    } catch (error) {
      console.log(error);
    }
  }


  async function fetchSuppliers() {
    try {
      const response = await axios({
        method: "GET",
        url: `${process.env.REACT_APP_API_URL}/suppliers`,
        headers: {
          authorization: localStorage.getItem("authorization"),
        },
      });

      setSuppliers(response.data.data)
    } catch (error) {
      console.log(error);
    }
  }

  async function fetchProducts() {
    try {
      const response = await axios({
        method: "GET",
        url: `${process.env.REACT_APP_API_URL}/products`,
        headers: {
          authorization: localStorage.getItem("authorization"),
        },
      });


      setProducts(response.data.data)
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
      })
    } catch (error) {
      console.log(error);
    }
  }

  async function deleteTransaction(id) {


    try {
      const response = await axios({
        method: "DELETE",
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
      }).then((result) => {
        handleClose()
      });
    } catch (error) {
      console.log(error);
    }
  }

  const handleAddRow = async () => {
    const newProduct = {
      id: Date.now(), // Unique identifier for the new row
      Product: {
        id: '',
        part_number: '',
        name: '',
        unit_code: ''
      },
      qty: 1,
      current_cost: 0,
      isNew: true // Mark the row as new
    };

    // Add the new row locally
    setRows([...rows, newProduct]);






  };


  const deleteRowLocally = (index) => {
    const updatedRows = [...rows]; // Make a copy of the rows
    updatedRows.splice(index, 1); // Remove the row at the given index
    setRows(updatedRows); // Update the state with the new rows
  };


  // Handle updating the selected barang in the row
  const handleBarangChange = (index, selectedBarang) => {
    ;

    const newRows = [...rows];


    newRows[index].Product = selectedBarang;
    newRows[index].current_cost = selectedBarang.cost;

    setRows(newRows);
  };


  const calculateTotalAmount = (rows) => {
    return rows.reduce((totals, row) => {
      const quantity = parseInt(row.qty, 10) || 0; // Convert qty to integer, fallback to 0 if invalid
      const cost = row.current_cost || 0; // Ensure cost is a valid number

      totals.totalQty += quantity;
      totals.totalCost += quantity * cost; // Calculate total cost based on quantity
      totals.PPN = totals.totalCost * 0.1; // 10% tax
      totals.netto = totals.totalCost + totals.PPN;

      // Formatting to add Rp. and using toLocaleString() for proper formatting
      totals.totalCostFormatted = `Rp. ${totals.totalCost.toLocaleString('id-ID')}`;
      totals.PPNFormatted = `Rp. ${totals.PPN.toLocaleString('id-ID')}`;
      totals.nettoFormatted = `Rp. ${totals.netto.toLocaleString('id-ID')}`;

      return totals;
    }, { totalQty: 0, totalCost: 0, PPN: 0, netto: 0 }); // Initial values
  };

  // Example usage:
  const totals = calculateTotalAmount(rows);







  return (
    <Modal show={showModal} onHide={handleClose} size="xl">
      <Modal.Header>
        <Modal.Title>{data ? 'Pembelian Form' : 'Pembelian Form'}</Modal.Title>

        <div>
          <button
            className="btn btn-link"
            onClick={handleAddRow} // Add row when clicked
            data-bs-toggle="tooltip"
            data-bs-placement="top"
            title="Tambah Barang"
          >
            <i className="fas fa-plus" style={{ color: 'green', fontSize: '24px' }}></i>
          </button>

          <button
            className="btn btn-link"
            onClick={handleDownload} // Add row when clicked
            data-bs-toggle="tooltip"
            data-bs-placement="top"
            title="Print Invoice"
          >
            <i className="fas fa-print" style={{ color: '#6c757d', fontSize: '24px' }}></i> {/* Gray */}
          </button>
          <button
            className="btn btn-link"
            onClick={handleDeleteTransaction}
            data-bs-toggle="tooltip"
            data-bs-placement="top"
            title="Hapus Transaksi"
          >
            <i className="fas fa-trash" style={{ color: 'red', fontSize: '24px' }}></i>
          </button>
        </div>
      </Modal.Header>

      <Modal.Body>
        <div className="container">
          {/* Form section */}
          <div className="form-section row g-3">
            <div className="col-md-4 mt-2">
              <label htmlFor="noBukti" className="form-label">No. Bukti#</label>
              <input type="text" className="form-control" name="transaction_proof_number" value={formData.transaction_proof_number} onChange={handleChange} readOnly style={{ width: '100%' }} />
            </div>

            <div className="col-md-4 mt-2">
              <label htmlFor="supplier" className="form-label">Supplier</label>
              <select
                className="form-select"
                name="transaction_supplier_id"
                onChange={handleChange}
                value={formData.transaction_supplier_id}
                style={{ width: '100%', height: '55%' }}
              >
                <option value="">Select Supplier</option> {/* Default option */}
                {suppliers.length > 0 ? (
                  suppliers.map((supplier) => (
                    <option key={supplier.id} value={supplier.id}>
                      {supplier.supplier_name}
                    </option>
                  ))
                ) : (
                  <option disabled>No suppliers available</option>
                )}
              </select>
            </div>


            <div className="col-md-4 mt-2">
              <label htmlFor="tanggal" className="form-label">Tanggal</label>
              <input type="date" className="form-control" name="transaction_date" value={formData.transaction_date} onChange={handleChange} style={{ width: '100%', height: "55%" }} />
            </div>

            <div className="col-md-4 mt-2">
              <label htmlFor="tanggal" className="form-label">Tgl. Tempo</label>
              <input type="date" className="form-control" value={formData.transaction_due_date} onChange={handleChange} name="transaction_due_date" style={{ width: '100%', height: "55%" }} />
            </div>
            <div className="col-md-4 mt-2">
              <div>
                <label htmlFor="noInvoice" className="form-label">No. Invoice</label>
                <input type="text" className="form-control" id="noInvoice" readOnly value={data ?
                  data.transaction_invoice_number : ""
                } />
              </div>

            </div>

            <div className="col-md-2 mt-2">
              <label htmlFor="supplier" className="form-label">PPn</label>
              <select
                className="form-select"
                name="PPN"
                style={{ width: '100%', height: '55%' }}
                value={formData.PPN} // Ensure formData.PPN defaults to "true"
                onChange={(e) =>
                  handleChange({ target: { name: 'PPN', value: e.target.value } })
                }
              >
                <option value="" disabled>Select Ppn</option> {/* Default option */}
                <option value="true">PPn</option>
                <option value="false">Non PPn</option>
              </select>
            </div>
            <div className="col-md-2 mt-2">
              <div className="form-check stock">
                <input className="form-check-input custom-checkbox" type="checkbox" name="transaction_type" checked readOnly />
                <label className="form-check-label mb-2" htmlFor="pembelianStok">Pembelian Stok</label>
              </div>
            </div>
          </div>

          <div className="table-container mt-3">
            <table className="table table-bordered table-striped">
              <thead>
                <tr className="table-warning">
                  <th>No.</th>
                  <th>Kode Barang</th>
                  <th>Nama Barang</th>

                  <th>Qty</th>
                  <th>Satuan</th>
                  <th>Cost</th>
                  <th>Amount</th>
                  <th className="notes-col">Action</th>
                </tr>
              </thead>
              <tbody>
                {rows.length > 0 ? (
                  rows.map((item, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>
                        {item.isNew ? (
                          <select
                            value={item.Product.id || ''}
                            onChange={(e) =>
                              handleBarangChange(
                                index,
                                products.find((b) => b.id === Number(e.target.value))
                              )
                            }
                          >
                            <option value="">Pilih Barang</option>
                            {products.map((barang) => (
                              <option key={barang.id} value={barang.id} defaultValue={1}>
                                {barang.part_number}
                              </option>
                            ))}
                          </select>
                        ) : (
                          item.Product.part_number
                        )}
                      </td>
                      <td>{item.isNew ? item.Product.name : item.Product.name}</td>
                      <td>
                        {item.isNew ? (
                          <input
                            type="number"
                            value={item.qty}
                            onChange={(e) => {
                              setRows((prevRows) => {
                                const updatedRows = [...prevRows];
                                updatedRows[index].qty = e.target.value;
                                return updatedRows;
                              });
                            }}
                            min="1"
                          />
                        ) : (
                          item.qty
                        )}
                      </td>
                      {/* Add a conditional check for Unit */}
                      <td>{item.Product.Unit ? item.Product.Unit.unit_code : 'N/A'}</td>
                      <td>{item.current_cost.toLocaleString()}</td>
                      <td>{(item.qty * item.current_cost).toLocaleString()}</td>
                      <td>
                        {index === 0 ? (
                          <span></span>
                        ) : data && rows.length > 1 && !item.isNew ? (
                          <button
                            className="btn btn-link"
                            onClick={() => handleDelete(item.id)}
                            title="Hapus Barang"
                          >
                            <i className="fas fa-trash" style={{ color: 'blue', marginTop: '-5px' }}></i>
                          </button>
                        ) : rows.length > 1 ? (
                          <button
                            className="btn btn-link"
                            onClick={() => deleteRowLocally(index)}
                            title="Hapus Barang"
                          >
                            <i className="fas fa-trash" style={{ color: 'red', marginTop: '-5px' }}></i>
                          </button>
                        ) : null}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" style={{ textAlign: 'center' }}>
                      No data available
                    </td>
                  </tr>
                )}
              </tbody>

            </table>
          </div>
        </div>

        <footer className="container mr-1">

          <div className="container mt-5">
            <div className="row">
              <div className="col-md-8">
                <table className="table table-bordered">
                  <tbody>
                    <tr>
                      <td>Total Amount</td>
                      <td><input type="text" className="form-control" value={data ? "Rp." + data.total_amount.toLocaleString() : totals.totalCostFormatted} readOnly /></td>
                    </tr>
                    <tr>
                      <td>Disc</td>
                      <td><input type="text" className="form-control" defaultValue={0} /></td>
                    </tr>
                    <tr>
                      <td>Total (DPP)</td>
                      <td><input type="text" className="form-control" value={data ? "Rp." + data.total_dpp.toLocaleString() : totals.totalCostFormatted} readOnly /></td>
                    </tr>
                    <tr>
                      <td>Total PPN</td>
                      <td><input type="text" className="form-control" value={data ? "Rp." + data.total_ppn.toLocaleString() : totals.PPNFormatted} readOnly /></td>
                    </tr>
                    <tr>
                      <td>Total Netto</td>
                      <td><input type="text" className="form-control" value={data ? "Rp." + data.total_netto.toLocaleString() : totals.nettoFormatted} readOnly /></td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="col-md-4">
                <div className="form-group">
                  <label htmlFor="totalQty">Total Qty</label>
                  <input type="text" className="form-control" id="totalQty" value={data ? data.total_qty : totals.totalQty} readOnly />
                </div>
                <div className="form-group">
                  <label htmlFor="notes">Notes</label>
                  <textarea className="form-control" name="transaction_note" rows={5} value={formData.transaction_note} onChange={handleChange} />
                </div>
              </div>
            </div>
          </div>


          <div className="text-right mb-3 mt-3">
            <Button variant="secondary" className="mr-2" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" type="submit" onClick={handleSubmit}>
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
  const [rowCount, setRowCount] = useState(0); // Total rows count from the server
  const [pageSize, setPageSize] = useState(25); // Number of rows per page
  const [page, setPage] = useState(0); // Current page number (zero-based)
  const [loading, setLoading] = useState(false); // Loading state for DataGrid

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


  const fetchTransactions = async (value) => {
    setLoading(true);
    try {
      const searchTerm = value || '';

      const response = await axios({
        method: 'GET',
        url: `${process.env.REACT_APP_API_URL}/transactions?type=buy&search=${searchTerm}&limit=${pageSize}&page=${page+1}`,
        headers: {
          authorization: localStorage.getItem('authorization'),
        },
      });

      // Update the rows and total row count based on the response
      setRows(response.data.data);
      setRowCount(response.data.pagination.totalItems); // Total rows available
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };
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
    { field: "transaction_date", headerName: "Tanggal Pembelian", flex: 2, },
    { field: "transaction_due_date", headerName: "Tgl. tempo", flex: 1, },
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
  }, [page, pageSize]);

  return (
    <>
      <Sidebar />

      <div className="content-wrapper">
        {/* Content Header (Page header) */}
        <section className="content-header">
          <div className="d-flex flex-row justify-content-between">
            {/* Remove Tambah Barang Button */}

            {/* Render SearchBar with the onAdd prop */}
            <SearchBar fetchProducts={fetchTransactions} onAdd={() => handleShow("tambahBarang")} />
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
                      fungsi={productById ? fetchTransactionById : addTransaction}
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
