const { Unit } = require("../models");
const { Op } = require('sequelize'); // Import Sequelize operators
class Controller {
  static async getUnit(req, res, next) {
    try {
      // Get search query, page, and limit from request query parameters
      const searchQuery = req.query.search || ''; // Default search is an empty string
      const limit = parseInt(req.query.limit) || 10; // Default limit is 10
      let page = parseInt(req.query.page);
      
      // Ensure page is at least 1, handle cases where page=0 or NaN
      page = !isNaN(page) && page > 0 ? page : 1;
  
      const offset = (page - 1) * limit; // Calculate the offset for pagination (1-based page)
  
      console.log(`Fetching units with offset: ${offset}, limit: ${limit}, page: ${page}, search: ${searchQuery}`);
  
      // Find all units with pagination and optional search query
      const { count, rows: units } = await Unit.findAndCountAll({
        where: {
          status: true, // Ensure the status is true
          [Op.or]: [
            {
              unit_name: {
                [Op.iLike]: `%${searchQuery}%`, // Case-insensitive search in unit_name field
              },
            },
            {
              unit_code: {
                [Op.iLike]: `%${searchQuery}%`, // Case-insensitive search in unit_code field
              },
            },
          ],
        },
        limit, // Limit the number of results returned per page
        offset, // Skip the first (page-1) * limit results
      });
  
      // Calculate the total number of pages
      const totalPages = Math.ceil(count / limit);
  
      console.log(`Total Items: ${count}, Total Pages: ${totalPages}, Current Page: ${page}`);
  
      // Return the results along with pagination metadata
      res.status(200).json({
        error: false,
        msg: 'Success',
        data: units,
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

  static async createUnit(req, res, next) {
    try {
      const { unit_name, unit_code } = req.body;
      const {username} = req.userAccess
      const data = {
        unit_name,
        unit_code,
        createdBy: username
      };

      await Unit.create(data);
      res.status(201).json({
        error: false,
        msg: `Success`,
        data: [],
      });
    } catch (error) {
      next(error);
    }
  }

  static async getUnitById(req, res, next) {
    try {
      const { id } = req.params;
      const unit = await Unit.findOne({
        where: {
          id,
          status: true,
        },
      });
      if (!unit) {
        throw {
          name: "not_found",
          code: 404,
          msg: "Unit not found",
        };
      }

      res.status(200).json({
        error: false,
        msg: `Success`,
        data: unit,
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteUnit(req, res, next) {
    try {
      const { id } = req.params;
      const {username} = req.userAccess
      const unit = await Unit.findOne({
        where: {
          id,
        },
      });
      if (!unit) {
        throw {
          name: "not_found",
          code: 404,
          msg: "Unit not found",
        };
      }
      const data = {
        updatedBy:username,
        status: false,
      };
      await Unit.update(data, {
        where: {
          id,
        },
      });
      res.status(200).json({
        error: false,
        msg: `success delete Units with id ${id}`,
        data: [],
      });
    } catch (error) {
      next(error);
    }
  }
  static async editUnit(req, res, next) {
    try {
      const { id } = req.params;
      const { unit_name, unit_code } = req.body;
      const {username} = req.userAccess
      const unit = await Unit.findOne({
        where: {
          id,
        },
      });
      if (!unit) {
        throw {
          name: "not_found",
          code: 404,
          msg: "Unit not found",
        };
      }
      const data = {
       unit_code,
       unit_name,
       updatedBy:username
      };
      await Unit.update(data, {
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
