import Swal from "sweetalert2";
import Sidebar from "../../components/sidebar";
import axios from "axios";
import { useState, useEffect } from "react";
const Profiles = () => {
    useEffect(() => {
        getCompanyProfileById();
    }, []);



    const [formData, setFormData] = useState({
        company_name: "",
        address: "",
        phone: "",
        fax: "",
        city: "",
        postal_code: "",
        country: "",
        email: "",
        npwp: "",
        person_1: "",
        person_2: "",
        bank_accounts: [],
        tax_information: []
    });
    async function getCompanyProfileById() {
        try {
            const response = await axios({
                method: "GET",
                url: `${process.env.REACT_APP_API_URL}/profiles/1`,
                headers: {
                    authorization: localStorage.getItem("authorization"),
                },
            });



            setFormData({
                company_name: response.data.data.company_name || "",
                address: response.data.data.address || "",
                phone: response.data.data.phone || "",
                fax: response.data.data.fax || "",
                city: response.data.data.city || "",
                postal_code: response.data.data.postal_code || "",
                country: response.data.data.country || "",
                email: response.data.data.email || "",
                npwp: response.data.data.npwp || "",
                person_1: response.data.data.person_1 || "",
                person_2: response.data.data.person_2 || "",
                bank_accounts: response.data.data.bank_accounts || [],
                tax_information: response.data.data.tax_information || []
            });
        } catch (error) {
            console.log(error);
        }
    }


    async function editCompanyProfileById(data) {
        try {
            const response = await axios({
                method: "PUT",
                url: `${process.env.REACT_APP_API_URL}/profiles/3`,
                headers: {
                    authorization: localStorage.getItem("authorization"),
                },
                data: data
            });

            Swal.fire({
                icon: "success",
                title: "Save data",
                text: response.data.message,
            }).then(() => {
                getCompanyProfileById()
            });


        } catch (error) {
            console.log(error);
        }
    }
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

        console.log(data);

        editCompanyProfileById(data)

    };


    const handleBankAccountChange = (e, index) => {
        const { name, value } = e.target;
        const updatedBankAccounts = [...formData.bank_accounts];

        // Update the specific field (name) in the bank account at the specified index
        updatedBankAccounts[index] = {
            ...updatedBankAccounts[index],
            [name]: value
        };

        // Update the state with the modified bank_accounts array
        setFormData({
            ...formData,
            bank_accounts: updatedBankAccounts,
        });
    };

    // Handle input change for nested fields in tax_information
    const handleTaxInfoChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            tax_information: {
                ...formData.tax_information,
                [name]: value
            }
        });
    };
    const handleSelectedAccountChange = (selectedIndex) => {
        const updatedBankAccounts = formData.bank_accounts.map((account, index) => ({
            ...account,
            status: index === selectedIndex, // Set the selected account to true, others to false
        }));

        setFormData({
            ...formData,
            bank_accounts: updatedBankAccounts,
        });
    };

    return (
        <>
            <Sidebar />
            <div className="content-wrapper">


                {/* Main content */}
                <section className="content">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-12">
                                <div className="card">
                                    <div className="form-section shadow-sm p-4">
                                        <h5>Company Profile</h5>
                                        <form>
                                            <div className="row mb-3">
                                                <label className="col-sm-2 col-form-label">Company</label>
                                                <div className="col-sm-10">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="company_name"
                                                        value={formData.company_name}
                                                        
                                                        readOnly
                                                    />
                                                </div>
                                            </div>


                                            {/* Address */}
                                            <div className="row mb-3">
                                                <label className="col-sm-2 col-form-label">Address</label>
                                                <div className="col-sm-10">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="address"
                                                        value={formData.address}
                                                        onChange={handleChange}
                                                    />
                                                </div>
                                            </div>

                                            {/* Phone and Fax */}
                                            <div className="row mb-3">
                                                <label className="col-sm-2 col-form-label">Phone</label>
                                                <div className="col-sm-4">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="phone"
                                                        value={formData.phone}
                                                        onChange={handleChange}
                                                    />
                                                </div>
                                                <label className="col-sm-2 col-form-label">Fax</label>
                                                <div className="col-sm-4">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="fax"
                                                        value={formData.fax}
                                                        onChange={handleChange}
                                                    />
                                                </div>
                                            </div>

                                            {/* City, Postal Code, Country */}
                                            <div className="row mb-3">
                                                <label className="col-sm-2 col-form-label">City</label>
                                                <div className="col-sm-4">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="city"
                                                        value={formData.city}
                                                        onChange={handleChange}
                                                    />
                                                </div>
                                                <label className="col-sm-2 col-form-label">Postal Code</label>
                                                <div className="col-sm-4">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="postal_code"
                                                        value={formData.postal_code}
                                                        onChange={handleChange}
                                                    />
                                                </div>
                                            </div>

                                            <div className="row mb-3">
                                                <label className="col-sm-2 col-form-label">Country</label>
                                                <div className="col-sm-4">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="country"
                                                        value={formData.country}
                                                        onChange={handleChange}
                                                    />
                                                </div>
                                                <label className="col-sm-2 col-form-label">Email</label>
                                                <div className="col-sm-4">
                                                    <input
                                                        type="email"
                                                        className="form-control"
                                                        name="email"
                                                        value={formData.email}
                                                        onChange={handleChange}
                                                    />
                                                </div>
                                            </div>

                                            {/* NPWP */}
                                            <div className="row mb-3">
                                                <label className="col-sm-2 col-form-label">NPWP</label>
                                                <div className="col-sm-4">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="npwp"
                                                        value={formData.npwp}
                                                        onChange={handleChange}
                                                    />
                                                </div>
                                            </div>

                                            {/* Person 1 and Person 2 */}
                                            <div className="row mb-3">
                                                <label className="col-sm-2 col-form-label">Person 1</label>
                                                <div className="col-sm-4">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="person_1"
                                                        value={formData.person_1}
                                                        onChange={handleChange}
                                                    />
                                                </div>
                                                <label className="col-sm-2 col-form-label">Person 2</label>
                                                <div className="col-sm-4">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="person_2"
                                                        value={formData.person_2}
                                                        onChange={handleChange}
                                                    />
                                                </div>
                                            </div>


                                            <h5 className="text-primary">Bank Accounts</h5>
                                            <div className="row">
                                                {formData.bank_accounts && formData.bank_accounts.length > 0 ? (
                                                    formData.bank_accounts.map((account, index) => (
                                                        <div className="col-sm-6" key={account.id}>
                                                            <div className="d-flex justify-content-end align-items-center mb-2">
                                                                <div className="form-check">
                                                                    <input
                                                                        className="form-check-input-bank"
                                                                        type="radio"
                                                                        name="selected_account"
                                                                        id={`account${index}`}
                                                                        checked={account.status === true} // Mark the account as selected if status is true
                                                                        onChange={() => handleSelectedAccountChange(index)} // Handle radio button change
                                                                    />
                                                                    <label className="form-check-label ms-2" htmlFor={`account${index}`}>
                                                                        This Account
                                                                    </label>
                                                                </div>
                                                            </div>

                                                            <div className="row mb-2">
                                                                <label className="col-sm-4 col-form-label">A/N</label>
                                                                <div className="col-sm-8">
                                                                    <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        name="account_name"
                                                                        value={account.account_name}
                                                                        onChange={(e) => handleBankAccountChange(e, index)}
                                                                    />
                                                                </div>
                                                            </div>

                                                            <div className="row mb-2">
                                                                <label className="col-sm-4 col-form-label">AC</label>
                                                                <div className="col-sm-8">
                                                                    <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        name="account_number"
                                                                        value={account.account_number}
                                                                        onChange={(e) => handleBankAccountChange(e, index)}
                                                                    />
                                                                </div>
                                                            </div>

                                                            <div className="row mb-2">
                                                                <label className="col-sm-4 col-form-label">Bank Branch</label>
                                                                <div className="col-sm-8">
                                                                    <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        name="bank_branch"
                                                                        value={account.bank_branch}
                                                                        onChange={(e) => handleBankAccountChange(e, index)}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="col-12">
                                                        <p>No bank account information available.</p>
                                                    </div>
                                                )}


                                            </div>

                                            <h5 className="text-primary mt-3">Tax Information</h5>
                                            <div className="row mb-3 mt-2">
                                                <label className="col-sm-2 col-form-label">No. Pajak</label>
                                                <div className="col-sm-4">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="tax_number"
                                                        value={formData.tax_information.tax_number}
                                                        onChange={handleTaxInfoChange}
                                                    />
                                                </div>
                                                <label className="col-sm-2 col-form-label">Def. Rak</label>
                                                <div className="col-sm-4">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="default_rack"
                                                        value={formData.tax_information.default_rack}
                                                        onChange={handleTaxInfoChange}
                                                    />
                                                </div>
                                            </div>
                                            <div className="d-flex justify-content-end mt-4">

                                                <button type="button" className="btn btn-primary" onClick={handleSubmit}>
                                                    Simpan
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

            </div>




        </>
    );
};

export default Profiles;
