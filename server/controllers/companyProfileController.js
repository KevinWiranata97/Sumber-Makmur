const { Company_Profile, Bank_Account, Tax_Information, sequelize } = require("../models");

class CompanyProfileController {
    static async getCompanyProfiles(req, res, next) {
        try {
            const companyProfiles = await Company_Profile.findAll({
                include: [
                    {
                        model: Bank_Account,
                        as: 'bank_accounts',
                    },
                    {
                        model: Tax_Information,
                        as: 'tax_information',
                    },
                ],
                where: {
                    status: true, // Only get non-deleted company profiles
                },
            });
            res.status(200).json({
                error: false,
                msg: `Success`,
                data: companyProfiles,
            });
        } catch (error) {
            next(error);
        }
    }

    static async createCompanyProfile(req, res, next) {
        const t = await sequelize.transaction(); // Create a transaction in case something goes wrong
        try {
            const {
                company_name,
                address,
                phone,
                fax,
                city,
                postal_code,
                country,
                email,
                website,
                npwp,
                person_1,
                person_2,
                bank_accounts, // Array of bank account data
                tax_information // Object for tax information
            } = req.body;

            // Step 1: Create the Company_Profile
            const companyProfile = await Company_Profile.create({
                company_name,
                address,
                phone,
                fax,
                city,
                postal_code,
                country,
                email,
                website,
                npwp,
                person_1,
                person_2,
            }, { transaction: t });

            // Step 2: Create related Bank Accounts (if provided)
            if (bank_accounts && bank_accounts.length > 0) {
                await Bank_Account.bulkCreate(
                    bank_accounts.map((bank, index) => ({
                        company_id: companyProfile.id,
                        account_name: bank.account_name,
                        account_number: bank.account_number,
                        bank_name: bank.bank_name,
                        bank_branch: bank.bank_branch,
                        status: index === 0 ? true : false  // Set status true for the first account, false for others
                    })),
                    { transaction: t }
                );
            }
            

            // Step 3: Create related Tax Information (if provided)
            if (tax_information) {
                await Tax_Information.create({
                    company_id: companyProfile.id,
                    tax_number: tax_information.tax_number,
                    tax_ppn: tax_information.tax_ppn,
                }, { transaction: t });
            }

            await t.commit(); // Commit the transaction if all is good

            res.status(201).json({
                error: false,
                msg: `Success`,
                data: companyProfile,
            });
        } catch (error) {
            await t.rollback(); // Rollback transaction if there was an error
            next(error);
        }
    }

    static async getCompanyProfileById(req, res, next) {
        try {

            const companyProfile = await Company_Profile.findOne({
                where: {
                    company_name: "CV.SUMBER MAKMUR DIESEL",
                    status: true, // Only get non-deleted company profiles
                },
                include: [
                    {
                        model: Bank_Account,
                        as: 'bank_accounts',
                    },
                    {
                        model: Tax_Information,
                        as: 'tax_information',
                    },
                ],
            });
            if (!companyProfile) {
                throw {
                    name: "not_found",
                    code: 404,
                    msg: "Company profile not found",
                };
            }

            res.status(200).json({
                error: false,
                msg: `Success`,
                data: companyProfile,
            });
        } catch (error) {
            next(error);
        }
    }

    static async deleteCompanyProfile(req, res, next) {
        try {
            const { id } = req.params;
            const companyProfile = await Company_Profile.findOne({
                where: {
                    id,
                    status: true
                },
            });
            if (!companyProfile) {
                throw {
                    name: "not_found",
                    code: 404,
                    msg: "Company profile not found",
                };
            }

            // Soft delete: Set the `deletedAt` field instead of actually deleting the record
            await Company_Profile.update(
                { status: false },
                { where: { id } }
            );

            res.status(200).json({
                error: false,
                msg: `Success delete company profile`,
                data: [],
            });
        } catch (error) {
            next(error);
        }
    }

    static async editCompanyProfile(req, res, next) {
        const t = await sequelize.transaction();
        try {

            const {
                company_name,
                address,
                phone,
                fax,
                city,
                postal_code,
                country,
                email,
                website,
                npwp,
                person_1,
                person_2,
                bank_accounts, // Array of updated bank account data
                tax_information // Updated tax information
            } = req.body;

       
            
            const companyProfile = await Company_Profile.findOne({
                where: {
                    company_name: "CV.SUMBER MAKMUR DIESEL",
                    status: true, // Only allow editing if the profile is not soft-deleted
                },
            });
            if (!companyProfile) {
                throw {
                    name: "not_found",
                    code: 404,
                    msg: "Company profile not found",
                };
            }

            // Step 1: Update the Company_Profile details
            const updatedProfile = await Company_Profile.update({
                company_name,
                address,
                phone,
                fax,
                city,
                postal_code,
                country,
                email,
                website,
                npwp,
                person_1,
                person_2,
            }, {
                where: {
                company_name: "CV.SUMBER MAKMUR DIESEL",

                },
                transaction: t,
            });

            // Step 2: Update Bank Accounts (if provided)
            if (bank_accounts && bank_accounts.length > 0) {
                await Bank_Account.destroy({ where: { company_id: companyProfile.id }, transaction: t }); // Remove old accounts
                await Bank_Account.bulkCreate(
                    bank_accounts.map(bank => ({
                        company_id: companyProfile.id,
                        account_name: bank.account_name,
                        account_number: bank.account_number,
                        bank_name: bank.bank_name,
                        bank_branch: bank.bank_branch,
                        status:bank.status
                    })),
                    { transaction: t }
                );
            }

            // Step 3: Update Tax Information (if provided)
            if (tax_information) {
                await Tax_Information.update({
                    tax_number: tax_information.tax_number,
                    tax_ppn: tax_information.tax_ppn,
                }, {
                    where: { company_id: companyProfile.id },
                    transaction: t,
                });
            }

            await t.commit();
            res.status(200).json({
                error: false,
                msg: `Success`,
                data: updatedProfile,
            });
        } catch (error) {
            await t.rollback();
            next(error);
        }
    }
}

module.exports = CompanyProfileController;
