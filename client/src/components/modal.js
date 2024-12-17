import React, { useState } from "react";
import { Modal, Button, Table } from "react-bootstrap";

const MyComponent = ({showModal,onHide}) => {

    
  const [rows, setRows] = useState([]); // Table rows
  const [newProduct, setNewProduct] = useState({
    id: Date.now(),
    Product: {
      id: "",
      part_number: "",
      name: "",
      unit_code: "",
    },
    qty: 1,
    current_cost: 0,
    isNew: true,
  });

//   const handleAddRow = () => {
//     setShowModal(true); // Open the modal
//   };

  const handleSave = () => {
    // Add new product to rows
    setRows([...rows, newProduct]);
    // setShowModal(false); // Close the modal
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({
      ...newProduct,
      Product: { ...newProduct.Product, [name]: value },
    });
  };

  return (
    <div>
      {/* React-Bootstrap Modal with custom styling for horizontal scroll */}
      <Modal show={showModal} onHide={onHide} centered size="lg" className="product-modal">
        <Modal.Header>
            
    
          <Modal.Title>Add New Product</Modal.Title>

          <div>
            <button
              className="btn btn-link"
              data-bs-toggle="tooltip"
              data-bs-placement="top"
              title="Close"
            >
              <i
                className="fas fa-times"
                style={{ color: "red", fontSize: "24px" }}
                onClick={onHide}
              ></i>
            </button>
    
          </div>
        </Modal.Header>
        <Modal.Body className="scrollable-table">
          {/* Table inside Modal Body */}
          <Table striped bordered hover className="table-scroll">
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
              <tr>
                <td>Starter Motor</td>
                <td>01-001-223-016</td>
                <td>BOSCH</td>
                <td>WELDING MILLER 400</td>
                <td> 0118 2384 KZ - CW ROTATION0118 2384 KZ - CW ROTATION0118 2384 KZ - CW ROTATION0118 2384 KZ - CW ROTATION0118 2384 KZ - CW ROTATION0118 2384 KZ - CW ROTATION0118 2384 KZ - CW ROTATION</td>
                <td>Location 1</td>
                <td>Pcs</td>
                <td>10</td>
                <td>5000</td>
                <td>10000</td>
              </tr>
              <tr>
                <td>Starter Motor</td>
                <td>01-001-223-016</td>
                <td>BOSCH</td>
                <td>WELDING MILLER 400</td>
                <td> 0118 2384 KZ - CW ROTATION0118 2384 KZ - CW ROTATION0118 2384 KZ - CW ROTATION0118 2384 KZ - CW ROTATION0118 2384 KZ - CW ROTATION0118 2384 KZ - CW ROTATION0118 2384 KZ - CW ROTATION</td>
                <td>Location 1</td>
                <td>Pcs</td>
                <td>10</td>
                <td>5000</td>
                <td>10000</td>
              </tr>
              <tr>
                <td>Starter Motor</td>
                <td>01-001-223-016</td>
                <td>BOSCH</td>
                <td>WELDING MILLER 400</td>
                <td> 0118 2384 KZ - CW ROTATION0118 2384 KZ - CW ROTATION0118 2384 KZ - CW ROTATION0118 2384 KZ - CW ROTATION0118 2384 KZ - CW ROTATION0118 2384 KZ - CW ROTATION0118 2384 KZ - CW ROTATION</td>
                <td>Location 1</td>
                <td>Pcs</td>
                <td>10</td>
                <td>5000</td>
                <td>10000</td>
              </tr>
              <tr>
                <td>Starter Motor</td>
                <td>01-001-223-016</td>
                <td>BOSCH</td>
                <td>WELDING MILLER 400</td>
                <td> 0118 2384 KZ - CW ROTATION0118 2384 KZ - CW ROTATION0118 2384 KZ - CW ROTATION0118 2384 KZ - CW ROTATION0118 2384 KZ - CW ROTATION0118 2384 KZ - CW ROTATION0118 2384 KZ - CW ROTATION</td>
                <td>Location 1</td>
                <td>Pcs</td>
                <td>10</td>
                <td>5000</td>
                <td>10000</td>
              </tr>
              <tr>
                <td>Starter Motor</td>
                <td>01-001-223-016</td>
                <td>BOSCH</td>
                <td>WELDING MILLER 400</td>
                <td> 0118 2384 KZ - CW ROTATION0118 2384 KZ - CW ROTATION0118 2384 KZ - CW ROTATION0118 2384 KZ - CW ROTATION0118 2384 KZ - CW ROTATION0118 2384 KZ - CW ROTATION0118 2384 KZ - CW ROTATION</td>
                <td>Location 1</td>
                <td>Pcs</td>
                <td>10</td>
                <td>5000</td>
                <td>10000</td>
              </tr>
              <tr>
                <td>Starter Motor</td>
                <td>01-001-223-016</td>
                <td>BOSCH</td>
                <td>WELDING MILLER 400</td>
                <td> 0118 2384 KZ - CW ROTATION0118 2384 KZ - CW ROTATION0118 2384 KZ - CW ROTATION0118 2384 KZ - CW ROTATION0118 2384 KZ - CW ROTATION0118 2384 KZ - CW ROTATION0118 2384 KZ - CW ROTATION</td>
                <td>Location 1</td>
                <td>Pcs</td>
                <td>10</td>
                <td>5000</td>
                <td>10000</td>
              </tr>
              <tr>
                <td>Oil Pressure</td>
                <td>0-001</td>
                <td>USA</td>
                <td>GENSET</td>
                <td>CINA / 0.100 PSI / 7 KG-CM</td>
                <td>Location 2</td>
                <td>Pcs</td>
                <td>5</td>
                <td>2000</td>
                <td>4500</td>
              </tr>
              <tr>
                <td>Regulator</td>
                <td>0-33719-0031</td>
                <td>TW</td>
                <td>LU/ KOMATSU</td>
                <td>KDO 33719-0031</td>
                <td>Location 3</td>
                <td>Pcs</td>
                <td>20</td>
                <td>1500</td>
                <td>3000</td>
              </tr>
            </tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default MyComponent;
