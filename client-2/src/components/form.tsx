import React, { useEffect, useState } from "react";
import "./form.css";
import { addProduct as addProductApi, editProduct, deleteProduct } from "../services/apiServices"; // Import deleteProduct API
import useStore from "../store/useStore";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Bounce } from "react-toastify";
import 'boxicons'; // Import BoxIcons

const SellingLeadsForm = ({ onClose, columns, data, page, onSuccess }: { onClose: () => void, columns: any[], data: any, page: string, onSuccess: () => void }) => {
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

    const payload = {
      ...formData,
      stock: formData.stock,
      storage_id: formData.Storage, // Use storage_id for API
      unit_id: formData.Unit, // Use unit_id for API
    };
    delete payload.Storage;
    delete payload.Unit;

    try {
      if (data.id) {
        // Edit product if ID exists
        await editProduct(data.id, payload);
        toast.success("Produk berhasil diperbarui!"); // Success notification
      } else {
        // Add product if no ID
        await addProductApi(payload);
        toast.success("Produk berhasil ditambahkan!"); // Success notification
      }

      // Trigger the onSuccess callback to refresh the table
      onSuccess();

      // Delay closing the form to allow the toast to display
      setTimeout(() => {
        onClose();
      }, 1000); // Adjust the delay to match the toast's autoClose duration
    } catch (error) {
      toast.error("Terjadi kesalahan saat memproses produk."); // Error notification
      console.error("Error submitting product:", error);
    }
  };

  const handleDelete = async () => {
    toast(
      <div>
        <p>Apakah Anda yakin ingin menghapus produk ini?</p>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px" }}>
          <button
            style={{
              backgroundColor: "red",
              color: "white",
              padding: "5px 10px",
              border: "none",
              cursor: "pointer",
              borderRadius: "8px", // Rounded corners
              fontFamily: "Poppins, sans-serif", // Use Poppins font
            }}
            onClick={async () => {
              try {
                toast.dismiss(); // Dismiss the confirmation toast first
                await deleteProduct(data.id); // Call delete API
                toast.success("Produk berhasil dihapus!", { autoClose: 1000 }); // Show success notification for 1 second
                setTimeout(() => {
                  onSuccess(); // Refresh the table
                  onClose(); // Close the form
                }, 1000); // Delay other actions by 1 second
              } catch (error) {
                toast.error("Terjadi kesalahan saat menghapus produk."); // Error notification
                console.error("Error deleting product:", error);
              }
            }}
          >
            Hapus
          </button>
          <button
            style={{
              backgroundColor: "gray",
              color: "white",
              padding: "5px 10px",
              border: "none",
              cursor: "pointer",
              borderRadius: "8px", // Rounded corners
              fontFamily: "Poppins, sans-serif", // Use Poppins font
            }}
            onClick={() => toast.dismiss()} // Dismiss the confirmation toast
          >
            Batal
          </button>
        </div>
      </div>,
      {
        autoClose: false, // Disable auto-close for confirmation
        closeOnClick: false, // Prevent closing on click outside
        draggable: false, // Disable dragging
      }
    );
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
              {data.id && (
                <i
                  className="bx bx-trash"
                  style={{ color: "white", fontSize: "24px", cursor: "pointer" }}
                  onClick={handleDelete} // Trigger delete confirmation
                ></i>
              )}
            </div>
            <div className="form-grid">
              {columns
                .filter((column) => !(isProductPage && column.field === "stock")) // Exclude "stock" field for products page
                .map((column, index) => (
                  <div key={index} className="form-field">
                    <label>{column.headerName}</label>
                    {column.field === "Storage" ? (
                      <select
                        value={formData.Storage || ''} // Bind to Storage
                        onChange={(e) => handleInputChange("Storage", e.target.value)} // Update Storage
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
                        value={formData.Unit || ''} // Bind to Unit
                        onChange={(e) => handleInputChange("Unit", e.target.value)} // Update Unit
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
