const { Expedition } = require("../models");
const { Op } = require('sequelize');
class Controller {
  static async getExpedition(req, res, next) {
    try {
      // Get search query, page, and limit from request query parameters
      const searchQuery = req.query.search || ''; // Default search is an empty string
      const limit = parseInt(req.query.limit) || 10; // Default limit is 10
      let page = parseInt(req.query.page);
      
      // Ensure page is at least 1, handle cases where page=0 or NaN
      page = !isNaN(page) && page > 0 ? page : 1;
  
      const offset = (page - 1) * limit; // Calculate the offset for pagination (1-based page)
  
      // Find all expeditions with pagination and optional search query
      const { count, rows: expeditions } = await Expedition.findAndCountAll({
        where: {
          status: true, // Ensure the status is true
          [Op.or]: [
            {
              expedition_name: {
                [Op.iLike]: `%${searchQuery}%`, // Case-insensitive search in expedition_name field
              },
            },
            {
              expedition_address: {
                [Op.iLike]: `%${searchQuery}%`, // Case-insensitive search in expedition_address field
              },
            },
            {
              expedition_contact: {
                [Op.iLike]: `%${searchQuery}%`, // Case-insensitive search in expedition_contact field
              },
            },
            {
              expedition_phone: {
                [Op.iLike]: `%${searchQuery}%`, // Case-insensitive search in expedition_phone field
              },
            },
            {
              expedition_destination: {
                [Op.iLike]: `%${searchQuery}%`, // Case-insensitive search in expedition_destination field
              },
            }
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
        data: expeditions,
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

  static async createExpedition(req, res, next) {
    try {
      const {
        expedition_name,
        expedition_address,
        expedition_contact,
        expedition_phone,
        expedition_fax,
        expedition_destination,
      } = req.body;

      const data = {
        expedition_name,
        expedition_address,
        expedition_contact,
        expedition_phone,
        expedition_fax,
        expedition_destination,
      };

      await Expedition.create(data);
      res.status(201).json({
        error: false,
        msg: `Success`,
        data: [],
      });
    } catch (error) {
      next(error);
    }
  }

  static async getExpeditionById(req, res, next) {
    try {
      const { id } = req.params;
      const expedition = await Expedition.findOne({
        where: {
          id,
          status: true,
        },
      });
      if (!expedition) {
        throw {
          name: "not_found",
          code: 404,
          msg: "Expedition not found",
        };
      }

      res.status(200).json({
        error: false,
        msg: `Success`,
        data: expedition,
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteExpedition(req, res, next) {
    try {
      const { id } = req.params;
      const expedition = await Expedition.findOne({
        where: {
          id,
        },
      });
      if (!expedition) {
        throw {
          name: "not_found",
          code: 404,
          msg: "Expedition not found",
        };
      }
      const data = {
        status: false,
      };
      await Expedition.update(data, {
        where: {
          id,
        },
      });
      res.status(200).json({
        error: false,
        msg: `success delete Expeditions with id ${id}`,
        data: [],
      });
    } catch (error) {
      next(error);
    }
  }
  static async editExpedition(req, res, next) {
    try {
      const { id } = req.params;
      const {
        expedition_name,
        expedition_address,
        expedition_contact,
        expedition_phone,
        expedition_fax,
        expedition_destination,
      } = req.body;

      const data = {
        expedition_name,
        expedition_address,
        expedition_contact,
        expedition_phone,
        expedition_fax,
        expedition_destination,
      };
      const expedition = await Expedition.findOne({
        where: {
          id,
        },
      });
      if (!expedition) {
        throw {
          name: "not_found",
          code: 404,
          msg: "Expedition not found",
        };
      }
    
      await Expedition.update(data, {
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
