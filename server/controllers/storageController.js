const {Storage } = require("../models");
const { Op } = require('sequelize');

class Controller {
  static async getStorage(req, res, next) {
    try {
      // Get search query, page, and limit from request query parameters
      const searchQuery = req.query.search || ''; // Default search is an empty string
      const limit = parseInt(req.query.limit) || 10; // Default limit is 10
      let page = parseInt(req.query.page);
      
      // Ensure page is at least 1, handle cases where page=0 or NaN
      page = !isNaN(page) && page > 0 ? page : 1;
  
      const offset = (page - 1) * limit; // Calculate the offset for pagination (1-based page)
  
     
      // Find all storages with pagination and optional search query
      const { count, rows: storages } = await Storage.findAndCountAll({
        where: {
          status: true, // Ensure the status is true
          [Op.or]: [
            {
              storage_name: {
                [Op.iLike]: `%${searchQuery}%`, // Case-insensitive search in storage_name field
              },
            },
            {
              storage_code: {
                [Op.iLike]: `%${searchQuery}%`, // Case-insensitive search in storage_code field (if applicable)
              },
            },
          ],
        },
        limit, // Limit the number of results returned per page
        offset, // Skip the first (page-1) * limit results
      });
  
      // Calculate the total number of pages
      const totalPages = Math.ceil(count / limit);
 
  
      // Return the results along with pagination metadata
      res.status(200).json({
        error: false,
        msg: 'Success',
        data: storages,
        pagination: {
          totalItems: count,
          currentPage: page,
          totalPages,
          itemsPerPage: limit,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async createStorage(req, res, next) {
    try {
      const { storage_name, storage_code } = req.body;

      const data = {
    storage_name,
        storage_code,
      };

      await Storage.create(data);
      res.status(201).json({
        error: false,
        msg: `Success`,
        data: [],
      });
    } catch (error) {
      next(error);
    }
  }

  static async getStorageById(req, res, next) {
    try {
      const { id } = req.params;
      const storage = await Storage.findOne({
        where: {
          id,
          status: true,
        },
      });
      if (!storage) {
        throw {
          name: "not_found",
          code: 404,
          msg: "Storage not found",
        };
      }

      res.status(200).json({
        error: false,
        msg: `Success`,
        data: storage,
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteStorage(req, res, next) {
    try {
      const { id } = req.params;
      const storage = await Storage.findOne({
        where: {
          id,
        },
      });
      if (!storage) {
        throw {
          name: "not_found",
          code: 404,
          msg: "Storage not found",
        };
      }
      const data = {
        status: false,
      };
      await Storage.update(data, {
        where: {
          id,
        },
      });
      res.status(200).json({
        error: false,
        msg: `success delete Storages with id ${id}`,
        data: [],
      });
    } catch (error) {
      next(error);
    }
  }
  static async editStorage(req, res, next) {
    try {
      const { id } = req.params;
      const { storage_name, storage_code } = req.body;
      const storage = await Storage.findOne({
        where: {
          id,
        },
      });
      if (!storage) {
        throw {
          name: "not_found",
          code: 404,
          msg: "Storage not found",
        };
      }
      const data = {
       storage_code,
       storage_name
      };
      await Storage.update(data, {
        where: {
          id,
        },
      });
      res.status(200).json({
        error: false,
        msg: `success`,
        data: [],
      });
    } catch (error) {
      next(error);
    }
  }

}

module.exports = Controller;
