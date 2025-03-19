import React, { useEffect, useState } from "react";
import "./form.css";
import { addProduct as addProductApi } from "../services/apiServices";
import useStore from "../store/useStore";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Bounce } from "react-toastify";

const SellingLeadsForm = ({ onClose, columns, data, page }: { onClose: () => void, columns: any[], data: any, page: string }) => {
  const [formData, setFormData] = useState({
    ...data,
    stock: data.stock || 0, // Set default value of 0 for stock
  });
  const {  fetchStorages, storages, fetchUnits, units } = useStore();

  useEffect(() => {
    document.body.style.zoom = "100%"; // Set the zoom level to 100%
    fetchStorages("", 0, 100); // Fetch storages on component mount
    fetchUnits("", 0, 100); // Fetch units on component mount
  }, [fetchStorages, fetchUnits]);

  const isProductPage = page === "/products";

  const handleInputChange = (field: string, value: string) => {
    setFormData((prevData: any) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    // Validate form data
    const emptyFields = columns
      .filter((column) => column.field !== "stock") // Exclude stock from validation
      .filter((column) => !formData[column.field]);
      
    if (emptyFields.length > 0) {
      toast.error(`Harap isi semua kolom: ${emptyFields.map((col) => col.headerName).join(", ")}`);
      return;
    }

    if (isProductPage) {
      try {
        const payload = {
          ...formData,
          stock:formData.stock,
          storage_id: formData.Storage,
          unit_id: formData.Unit,
        };
        delete payload.Storage;
        delete payload.Unit;

        const response = await addProductApi(payload);
        toast.success("Produk berhasil ditambahkan!"); // Success notification
        console.log(response);

        // Delay closing the form to allow the toast to display
        setTimeout(() => {
          onClose();
        }, 2000); // Adjust the delay to match the toast's autoClose duration
      } catch (error) {
        toast.error("Terjadi kesalahan saat menambahkan produk."); // Error notification
        console.error("Error submitting product:", error);
      }
    } else {
      console.log("Form submitted for non-product page");

      // Delay closing the form to allow the toast to display
      setTimeout(() => {
        onClose();
      }, 2000); // Adjust the delay to match the toast's autoClose duration
    }
  };

  return (
    <div className="modal-wrapper">
      <div className="modal-container">
        {/* Header Section */}
        <div className="modal-header">
          <span className="modal-title">{isProductPage ? "Barang" : "Selling Leads"}</span>
          <span className="close-button" onClick={onClose}>✕</span>
        </div>

        {/* Form Section */}
        <div className="container">
          <div className="form-wrapper">
            <div className="tabs">
              <button className="active">{isProductPage ? "Barang" : "Leads"}</button>
              <button>History Pembelian Barang</button>
              <button>History Penjualan Barang</button>
            </div>
            <div className="header">
              <span>{isProductPage ? "Tambah Barang" : "Leads Detail"}:</span>
              <span>▼</span>
            </div>
            <div className="form-grid">
              {columns
                .filter((column) => !(isProductPage && column.field === "stock")) // Exclude "stock" field for products page
                .map((column, index) => (
                  <div key={index} className="form-field">
                    <label>{column.headerName}</label>
                    {column.field === "Storage" ? (
                      <select
                        value={formData[column.field] || ''}
                        onChange={(e) => handleInputChange(column.field, e.target.value)}
                      >
                        <option value="">Select Storage</option>
                        {storages.map((storage: any) => (
                          <option key={storage.id} value={storage.id}>
                            {storage.storage_name}
                          </option>
                        ))}
                      </select>
                    ) : column.field === "Unit" ? (
                      <select
                        value={formData[column.field] || ''}
                        onChange={(e) => handleInputChange(column.field, e.target.value)}
                      >
                        <option value="">Select Unit</option>
                        {units.map((unit: any) => (
                          <option key={unit.id} value={unit.id}>
                            {unit.unit_name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        value={formData[column.field] || ''}
                        onChange={(e) => handleInputChange(column.field, e.target.value)}
                      />
                    )}
                  </div>
                ))}
            </div>

            <div className="form-footer">
              <button className="submit-button" onClick={handleSubmit}>
                Submit
              </button>
            </div>
          </div>
        </div>
        <ToastContainer
          position="top-center" // Ensure the toast is positioned in the top-right corner
          style={{ width: "400px", fontSize: "16px" }} // Make the toast bigger
          autoClose={2000} // Close the toast after 5 seconds
          limit={3} // Limit the number of toasts displayed at once
          pauseOnHover
          theme="light"
          transition={Bounce}
        />
      </div>
    </div>
  );
};

export default SellingLeadsForm;
